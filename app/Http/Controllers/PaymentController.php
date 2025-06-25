<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\PaymentHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Exception\ApiErrorException;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    /**
     * @throws ApiErrorException
     */
    public function showPaymentForm(Shipment $shipment): Response | \Illuminate\Http\RedirectResponse
    {
        // Ensure user can only make payments for their own shipments
        if ($shipment->sender_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access to shipment payment.');
        }

        if ($shipment->payment_status === 'paid') {
            return redirect()->route('shipments.show', $shipment)
                ->with('error', 'This shipment has already been paid for.');
        }

        $shipment->load(['originLocation', 'destinationLocation']);

        return Inertia::render('Payments/Create', [
            'shipment' => $shipment,
            'stripe_publishable_key' => config('cashier.key'),
        ]);
    }

    public function createPaymentIntent(Request $request, Shipment $shipment)
    {
        // Ensure user can only create payment intents for their own shipments
        if ($shipment->sender_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super_admin'])) {
            return response()->json(['error' => 'Unauthorized access to shipment payment.'], 403);
        }

        if ($shipment->payment_status === 'paid') {
            return response()->json(['error' => 'This shipment has already been paid for.'], 400);
        }

        try {
            // Use Stripe directly to create PaymentIntent
            \Stripe\Stripe::setApiKey(config('cashier.secret'));

            $intent = \Stripe\PaymentIntent::create([
                'amount' => $shipment->price * 100, // Convert to cents
                'currency' => 'usd',
                'description' => "Payment for shipment {$shipment->tracking_id}",
                'metadata' => [
                    'shipment_id' => $shipment->id,
                    'tracking_id' => $shipment->tracking_id,
                    'user_id' => auth()->id(),
                ],
                'confirmation_method' => 'automatic',
                'confirm' => false,
            ]);

            // Log payment attempt
            PaymentHistory::createPaymentAttempt(
                $shipment->id,
                auth()->id(),
                $shipment->price,
                $intent->id,
                'automatic',
                [
                    'tracking_id' => $shipment->tracking_id,
                    'stripe_intent_id' => $intent->id,
                ]
            );

            // Store payment intent ID in session for later status checking
            session()->put("payment_intent_{$shipment->id}", $intent->id);

            return response()->json([
                'client_secret' => $intent->client_secret,
                'payment_intent_id' => $intent->id,
            ]);
        } catch (\Exception $e) {
            \Log::error('Payment intent creation failed', [
                'shipment_id' => $shipment->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to create payment intent. Please try again.'
            ], 500);
        }
    }

    public function processPayment(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'payment_intent_id' => 'required|string',
        ]);

        // Check if the shipment is already paid (possible due to webhook processing)
        if ($shipment->payment_status === 'paid') {
            return redirect()->route('payments.success', [
                'shipment' => $shipment->id,
                'tracking' => $shipment->tracking_id
            ]);
        }

        try {
            // Verify the payment with Stripe
            \Stripe\Stripe::setApiKey(config('cashier.secret'));

            $paymentIntent = \Stripe\PaymentIntent::retrieve($validated['payment_intent_id']);

            if ($paymentIntent->status !== 'succeeded') {
                return back()->withErrors([
                    'payment' => 'Payment was not successful. Please try again.'
                ])->withInput();
            }

            // Verify this payment is for the correct shipment
            if ($paymentIntent->metadata->shipment_id != $shipment->id) {
                return back()->withErrors([
                    'payment' => 'Payment verification failed. Please try again.'
                ])->withInput();
            }

            $user = auth()->user();

            // Add payment method to user for future use
            $user->addPaymentMethod($validated['payment_method']);

            // Update payment history
            $paymentHistory = PaymentHistory::where('payment_intent_id', $validated['payment_intent_id'])->first();
            if ($paymentHistory) {
                $paymentHistory->markAsSucceeded(
                    $paymentIntent->latest_charge ?? null,
                    $validated['payment_method']
                );
            }

            // Update shipment payment status (with race condition protection)
            $shipment->refresh(); // Refresh to get latest state
            if ($shipment->payment_status !== 'paid') {
                $shipment->update(['payment_status' => 'paid']);

                // Create notification only if we're the one updating the status
                $shipment->sender->notifications()->create([
                    'type' => 'success',
                    'title' => 'Payment Successful',
                    'message' => "Payment for shipment {$shipment->tracking_id} has been processed successfully.",
                    'action_url' => route('shipments.show', $shipment),
                    'action_text' => 'View Shipment',
                ]);
            }

            return redirect()->route('payments.success', [
                'shipment' => $shipment->id,
                'tracking' => $shipment->tracking_id
            ]);

        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Mark payment as failed in history
            if (isset($validated['payment_intent_id'])) {
                $paymentHistory = PaymentHistory::where('payment_intent_id', $validated['payment_intent_id'])->first();
                $paymentHistory?->markAsFailed('Stripe API error: ' . $e->getMessage());
            }

            return back()->withErrors([
                'payment' => 'Stripe error: ' . $e->getMessage()
            ])->withInput();
        } catch (\Exception $e) {
            // Mark payment as failed in history
            if (isset($validated['payment_intent_id'])) {
                $paymentHistory = PaymentHistory::where('payment_intent_id', $validated['payment_intent_id'])->first();
                $paymentHistory?->markAsFailed('Processing error: ' . $e->getMessage());
            }

            return back()->withErrors([
                'payment' => 'Payment processing failed: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function checkPaymentStatus(Request $request, Shipment $shipment)
    {
        // Ensure user can only check payment status for their own shipments
        if ($shipment->sender_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super_admin'])) {
            return response()->json(['error' => 'Unauthorized access to shipment payment.'], 403);
        }

        // Try to get payment intent ID from query param first, then session
        $paymentIntentId = $request->query('payment_intent_id') ?? session()->get("payment_intent_{$shipment->id}");

        if (!$paymentIntentId) {
            return response()->json([
                'payment_status' => $shipment->payment_status,
                'shipment_id' => $shipment->id,
                'tracking_id' => $shipment->tracking_id
            ]);
        }

        try {
            // Check directly with Stripe for most accurate status
            \Stripe\Stripe::setApiKey(config('cashier.secret'));
            $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);

            // Update local records if payment succeeded and we haven't processed it yet
            if ($paymentIntent->status === 'succeeded' && $shipment->payment_status !== 'paid') {
                // Verify this payment is for the correct shipment
                if ($paymentIntent->metadata->shipment_id == $shipment->id) {
                    // Update shipment status
                    $shipment->update(['payment_status' => 'paid']);

                    // Update payment history
                    $paymentHistory = PaymentHistory::where('payment_intent_id', $paymentIntentId)->first();
                    if ($paymentHistory) {
                        $paymentHistory->markAsSucceeded(
                            $paymentIntent->latest_charge ?? null,
                            $paymentIntent->payment_method ?? null
                        );
                    }

                    // Create notification
                    $shipment->sender->notifications()->create([
                        'type' => 'success',
                        'title' => 'Payment Successful',
                        'message' => "Payment for shipment {$shipment->tracking_id} has been processed successfully.",
                        'action_url' => route('shipments.show', $shipment),
                        'action_text' => 'View Shipment',
                    ]);
                    
                    // Clean up session
                    session()->forget("payment_intent_{$shipment->id}");
                }
            }

            return response()->json([
                'payment_status' => $paymentIntent->status === 'succeeded' ? 'paid' : $shipment->payment_status,
                'stripe_status' => $paymentIntent->status,
                'shipment_id' => $shipment->id,
                'tracking_id' => $shipment->tracking_id
            ]);

        } catch (\Stripe\Exception\ApiErrorException $e) {
            \Log::error('Failed to check payment status with Stripe', [
                'payment_intent_id' => $paymentIntentId,
                'shipment_id' => $shipment->id,
                'error' => $e->getMessage()
            ]);

            // Fallback to local status
            return response()->json([
                'payment_status' => $shipment->payment_status,
                'shipment_id' => $shipment->id,
                'tracking_id' => $shipment->tracking_id,
                'error' => 'Could not verify with Stripe'
            ]);
        }
    }

    /**
     * Stripe webhook handler
     *
     * Note: Webhooks are primarily used as a backup/redundancy mechanism.
     * The main payment verification happens via direct Stripe API calls in checkPaymentStatus().
     * Webhooks are useful for:
     * - Handling edge cases where frontend polling might miss updates
     * - Processing events when users close browser before completion
     * - Providing audit trail and redundancy
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('cashier.webhook.secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );

            // Handle the event
            switch ($event['type']) {
                case 'payment_intent.succeeded':
                    $paymentIntent = $event['data']['object'];
                    // Handle successful payment
                    $this->handleSuccessfulPayment($paymentIntent);
                    break;

                case 'payment_intent.payment_failed':
                    $paymentIntent = $event['data']['object'];
                    // Handle failed payment
                    $this->handleFailedPayment($paymentIntent);
                    break;

                default:
                    // Unexpected event type
                    \Log::info('Received unknown event type ' . $event['type']);
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function handleSuccessfulPayment($paymentIntent)
    {
        if (isset($paymentIntent['metadata']['shipment_id'])) {
            $shipment = Shipment::find($paymentIntent['metadata']['shipment_id']);

            if ($shipment && $shipment->payment_status !== 'paid') {
                // Update shipment status
                $shipment->update(['payment_status' => 'paid']);

                // Update payment history
                $paymentHistory = PaymentHistory::where('payment_intent_id', $paymentIntent['id'])->first();
                if ($paymentHistory) {
                    $paymentHistory->markAsSucceeded(
                        $paymentIntent['latest_charge'] ?? null,
                        $paymentIntent['payment_method'] ?? null
                    );
                }

                // Create notification
                $shipment->sender->notifications()->create([
                    'type' => 'success',
                    'title' => 'Payment Successful',
                    'message' => "Payment for shipment {$shipment->tracking_id} has been processed successfully.",
                    'action_url' => route('shipments.show', $shipment),
                    'action_text' => 'View Shipment',
                ]);
            }
        }
    }

    private function handleFailedPayment($paymentIntent)
    {
        if (isset($paymentIntent['metadata']['shipment_id'])) {
            $shipment = Shipment::find($paymentIntent['metadata']['shipment_id']);

            if ($shipment) {
                // Update payment history
                $paymentHistory = PaymentHistory::where('payment_intent_id', $paymentIntent['id'])->first();
                if ($paymentHistory) {
                    $paymentHistory->markAsFailed(
                        $paymentIntent['last_payment_error']['message'] ?? 'Payment failed'
                    );
                }

                // Create notification
                $shipment->sender->notifications()->create([
                    'type' => 'error',
                    'title' => 'Payment Failed',
                    'message' => "Payment for shipment {$shipment->tracking_id} failed. Please try again.",
                    'action_url' => route('payments.form', $shipment),
                    'action_text' => 'Retry Payment',
                ]);
            }
        }
    }

    public function generateInvoice(Request $request, Shipment $shipment)
    {
        // Check if user can access this shipment
        if ($shipment->sender_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access to shipment invoice.');
        }

        // Check if payment has been made
        if ($shipment->payment_status !== 'paid') {
            return back()->with('error', 'Invoice can only be generated for paid shipments.');
        }

        // Get payment history for this shipment
        $paymentHistory = PaymentHistory::where('shipment_id', $shipment->id)
            ->where('status', 'succeeded')
            ->first();

        // Load relationships
        $shipment->load(['sender', 'originLocation', 'destinationLocation']);

        $data = [
            'shipment' => $shipment,
            'payment_history' => $paymentHistory,
            'invoice_number' => 'INV-' . str_pad($shipment->id, 6, '0', STR_PAD_LEFT),
            'invoice_date' => $paymentHistory?->completed_at ?? $shipment->created_at,
            'company_name' => 'QuickShip Courier Manager',
            'company_address' => '123 Business St, City, State 12345',
            'company_phone' => '+1 (555) 123-4567',
            'company_email' => 'billing@quickship.com',
        ];

        $pdf = PDF::loadView('invoices.shipment', $data);

        $action = $request->query('action', 'download');
        
        if ($action === 'view') {
            // Display PDF inline in browser
            return $pdf->stream("invoice-{$shipment->tracking_id}.pdf");
        } else {
            // Download PDF file
            return $pdf->download("invoice-{$shipment->tracking_id}.pdf");
        }
    }

    public function markAsPaidManually(Shipment $shipment, Request $request)
    {
        // Only admins can manually mark payments as paid
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'payment_method' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($shipment->payment_status === 'paid') {
            return back()->with('error', 'This shipment is already marked as paid.');
        }

        // Create manual payment history record
        $paymentHistory = PaymentHistory::createPaymentAttempt(
            $shipment->id,
            auth()->id(),
            $shipment->price,
            null,
            'manual',
            [
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
                'admin_user' => auth()->user()->name,
            ]
        );

        $paymentHistory->markAsSucceeded(null, $request->payment_method);

        // Update shipment status
        $shipment->update(['payment_status' => 'paid']);

        // Create notification
        $shipment->sender->notifications()->create([
            'type' => 'success',
            'title' => 'Payment Confirmed',
            'message' => "Payment for shipment {$shipment->tracking_id} has been manually confirmed by admin.",
            'action_url' => route('shipments.show', $shipment),
            'action_text' => 'View Shipment',
        ]);

        return back()->with('success', 'Payment has been manually confirmed.');
    }

    public function paymentSuccess(Request $request)
    {
        $shipmentId = $request->query('shipment');
        $trackingId = $request->query('tracking');

        if ($shipmentId) {
            $shipment = Shipment::find($shipmentId);
            if ($shipment && ($shipment->sender_id === auth()->id() || auth()->user()->hasRole(['admin', 'super_admin']))) {
                return Inertia::render('Payments/Success', [
                    'shipment' => $shipment,
                ]);
            }
        }

        // Fallback if no shipment provided or user doesn't have access
        return Inertia::render('Payments/Success', [
            'trackingId' => $trackingId,
        ]);
    }

    public function paymentHistory()
    {
        // Admin view of all payment history
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        $payments = PaymentHistory::with(['shipment', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Payments/History', [
            'payments' => $payments,
        ]);
    }

    public function myPaymentHistory()
    {
        // Customer view of their own payment history
        $payments = PaymentHistory::with(['shipment'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Payments/MyHistory', [
            'payments' => $payments,
        ]);
    }

    public function invoicesList()
    {
        // Admin view of all invoices
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        $shipments = Shipment::with(['sender', 'originLocation', 'destinationLocation'])
            ->where('payment_status', 'paid')
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return Inertia::render('Invoices/Index', [
            'shipments' => $shipments,
        ]);
    }

    public function myInvoices()
    {
        // Customer view of their own invoices
        $shipments = Shipment::with(['originLocation', 'destinationLocation'])
            ->where('sender_id', auth()->id())
            ->where('payment_status', 'paid')
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return Inertia::render('Invoices/MyInvoices', [
            'shipments' => $shipments,
        ]);
    }
}
