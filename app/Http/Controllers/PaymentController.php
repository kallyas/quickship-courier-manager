<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Exceptions\IncompletePayment;

class PaymentController extends Controller
{
    public function showPaymentForm(Shipment $shipment): Response
    {
        if ($shipment->payment_status === 'paid') {
            return redirect()->route('shipments.show', $shipment)
                ->with('error', 'This shipment has already been paid for.');
        }

        $intent = auth()->user()->createSetupIntent();
        $shipment->load(['originLocation', 'destinationLocation']);

        return Inertia::render('Payments/Create', [
            'shipment' => $shipment,
            'intent' => $intent,
        ]);
    }

    public function processPayment(Request $request, Shipment $shipment)
    {
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        try {
            $user = auth()->user();

            // Create payment method
            $user->addPaymentMethod($request->payment_method);

            // Charge the user
            $payment = $user->charge(
                $shipment->price * 100, // Convert to cents
                $request->payment_method,
                [
                    'description' => "Payment for shipment {$shipment->tracking_id}",
                    'metadata' => [
                        'shipment_id' => $shipment->id,
                        'tracking_id' => $shipment->tracking_id,
                    ],
                ]
            );

            // Update shipment payment status
            $shipment->update(['payment_status' => 'paid']);

            // Create notification
            $shipment->sender->notifications()->create([
                'type' => 'success',
                'title' => 'Payment Successful',
                'message' => "Payment for shipment {$shipment->tracking_id} has been processed successfully.",
                'action_url' => route('shipments.show', $shipment),
                'action_text' => 'View Shipment',
            ]);

            return redirect()->route('shipments.show', $shipment)
                ->with('success', 'Payment processed successfully!');

        } catch (IncompletePayment $exception) {
            return redirect()->route('cashier.payment', [
                $exception->payment->id,
                'redirect' => route('shipments.show', $shipment),
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Payment failed: ' . $e->getMessage());
        }
    }

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
            if ($shipment) {
                $shipment->update(['payment_status' => 'paid']);
            }
        }
    }

    private function handleFailedPayment($paymentIntent)
    {
        if (isset($paymentIntent['metadata']['shipment_id'])) {
            $shipment = Shipment::find($paymentIntent['metadata']['shipment_id']);
            if ($shipment) {
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
}
