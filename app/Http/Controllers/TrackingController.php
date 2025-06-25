<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Tracking/Index');
    }

    public function track(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string',
        ]);

        $shipment = Shipment::with([
            'originLocation',
            'destinationLocation',
            'history' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }
        ])->where('tracking_id', $request->tracking_id)->first();

        if (!$shipment) {
            return back()->withErrors([
                'tracking_id' => 'No shipment found with this tracking ID.',
            ]);
        }

        return Inertia::render('Tracking/Show', [
            'shipment' => $shipment,
        ]);
    }
}
