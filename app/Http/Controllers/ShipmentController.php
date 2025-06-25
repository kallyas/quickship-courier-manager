<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;
use App\Models\Location;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $shipments = Shipment::with(['sender', 'originLocation', 'destinationLocation'])
            ->when($request->search, function ($query, $search) {
                $query->where('tracking_id', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $locations = Location::orderBy('city')->get();

        return Inertia::render('Shipments/Create', [
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShipmentRequest $request)
    {
        $shipment = Shipment::create([
            ...$request->validated(),
            'sender_id' => auth()->id(),
        ]);

        $shipment->updateStatus('pending', null, 'Shipment created', auth()->id());

        return redirect()->route('shipments.show', $shipment)
            ->with('success', 'Shipment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Shipment $shipment): Response
    {
        $shipment->load([
            'sender',
            'originLocation',
            'destinationLocation',
            'history.updatedBy',
            'messages.user',
            'files.uploadedBy'
        ]);

        return Inertia::render('Shipments/Show', [
            'shipment' => $shipment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Update shipment status (Admin only)
     */
    public function updateStatus(Request $request, Shipment $shipment)
    {
        // Check if user has admin or super_admin role
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'status' => 'required|string|in:pending,picked_up,in_transit,out_for_delivery,delivered,cancelled,returned',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Handle delivery date for delivered status
        $updateData = ['status' => $request->status];
        if ($request->status === 'delivered' && !$shipment->delivery_date) {
            $updateData['delivery_date'] = now();
        }
        
        // Update the shipment
        $shipment->update($updateData);

        // Create history entry
        $shipment->history()->create([
            'status' => $request->status,
            'location' => $request->location,
            'notes' => $request->notes,
            'updated_by' => auth()->id(),
        ]);

        // Create notification for customer
        \App\Models\Notification::createForUser(
            $shipment->sender_id,
            'info',
            'Shipment Status Updated',
            "Your shipment {$shipment->tracking_id} status has been updated to: {$shipment->getStatusLabelAttribute()}",
            null,
            route('shipments.show', $shipment),
            'View Shipment'
        );

        return back()->with('success', 'Shipment status updated successfully.');
    }

    /**
     * Bulk update shipment statuses (Admin only)
     */
    public function bulkUpdateStatus(Request $request)
    {
        // Check if user has admin or super_admin role
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'shipment_ids' => 'required|array|min:1',
            'shipment_ids.*' => 'required|integer|exists:shipments,id',
            'status' => 'required|string|in:pending,picked_up,in_transit,out_for_delivery,delivered,cancelled,returned',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $shipmentIds = $request->shipment_ids;
        $status = $request->status;
        $location = $request->location;
        $notes = $request->notes;
        $updatedCount = 0;

        foreach ($shipmentIds as $shipmentId) {
            $shipment = Shipment::find($shipmentId);
            if (!$shipment) continue;

            // Handle delivery date for delivered status
            $updateData = ['status' => $status];
            if ($status === 'delivered' && !$shipment->delivery_date) {
                $updateData['delivery_date'] = now();
            }
            
            // Update the shipment
            $shipment->update($updateData);

            // Create history entry
            $shipment->history()->create([
                'status' => $status,
                'location' => $location,
                'notes' => $notes,
                'updated_by' => auth()->id(),
            ]);

            // Create notification for customer
            \App\Models\Notification::createForUser(
                $shipment->sender_id,
                'info',
                'Shipment Status Updated',
                "Your shipment {$shipment->tracking_id} status has been updated to: {$shipment->getStatusLabelAttribute()}",
                null,
                route('shipments.show', $shipment),
                'View Shipment'
            );

            $updatedCount++;
        }

        return back()->with('success', "Successfully updated {$updatedCount} shipment(s).");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
