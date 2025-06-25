<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\ShipmentHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(Request $request): Response
    {
        // Get tracking ID from URL parameter if provided
        $trackingId = $request->query('id');
        
        return Inertia::render('Tracking/Index', [
            'initialTrackingId' => $trackingId,
        ]);
    }

    public function track(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string|max:50',
        ]);

        $trackingId = strtolower(trim($request->tracking_id));

        // Use cache to improve performance for frequently tracked shipments
        $cacheKey = "shipment_tracking_{$trackingId}";

        $shipment = Cache::remember($cacheKey, 300, function () use ($trackingId) {
            return Shipment::with([
                'sender:id,name,email',
                'originLocation',
                'destinationLocation',
                'history' => function ($query) {
                    $query->with('updatedBy:id,name')
                          ->orderBy('created_at', 'desc');
                }
            ])->where('tracking_id', $trackingId)->first();
        });

        if (!$shipment) {
            return back()->withErrors([
                'tracking_id' => 'No shipment found with this tracking ID. Please check your tracking ID and try again.',
            ])->withInput();
        }

        // Calculate estimated delivery if not set
        if (!$shipment->estimated_delivery_date && $shipment->status !== 'delivered') {
            $shipment->estimated_delivery_date = $this->calculateEstimatedDelivery($shipment);
        }

        // Get additional tracking insights
        $trackingInsights = $this->getTrackingInsights($shipment);

        // Clear cache if shipment status has changed recently
        if ($shipment->updated_at > Carbon::now()->subMinutes(5)) {
            Cache::forget($cacheKey);
        }

        return Inertia::render('Tracking/Show', [
            'shipment' => $shipment,
        ]);
    }

    public function refreshStatus(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string',
        ]);

        $trackingId = strtoupper(trim($request->tracking_id));
        $cacheKey = "shipment_tracking_{$trackingId}";

        // Clear cache to force fresh data
        Cache::forget($cacheKey);

        $shipment = Shipment::with([
            'sender:id,name,email',
            'originLocation',
            'destinationLocation',
            'history' => function ($query) {
                $query->with('updatedBy:id,name')
                      ->orderBy('created_at', 'desc');
            }
        ])->where('tracking_id', $trackingId)->first();

        if (!$shipment) {
            return response()->json([
                'error' => 'Shipment not found'
            ], 404);
        }

        // Get updated tracking insights
        $trackingInsights = $this->getTrackingInsights($shipment);

        return response()->json([
            'shipment' => $shipment,
            'insights' => $trackingInsights,
            'refreshed_at' => now()->toISOString(),
        ]);
    }

    public function getMultipleTracking(Request $request)
    {
        $request->validate([
            'tracking_ids' => 'required|array|max:10',
            'tracking_ids.*' => 'required|string|max:50',
        ]);

        $trackingIds = array_map('strtoupper', array_map('trim', $request->tracking_ids));

        $shipments = Shipment::with([
            'originLocation:id,city,state',
            'destinationLocation:id,city,state',
            'history' => function ($query) {
                $query->latest()->limit(1);
            }
        ])->whereIn('tracking_id', $trackingIds)
          ->get(['id', 'tracking_id', 'status', 'payment_status', 'recipient_name', 'updated_at', 'origin_location_id', 'destination_location_id'])
          ->map(function ($shipment) {
              return [
                  'tracking_id' => $shipment->tracking_id,
                  'status' => $shipment->status,
                  'payment_status' => $shipment->payment_status,
                  'recipient_name' => $shipment->recipient_name,
                  'last_update' => $shipment->updated_at,
                  'route' => [
                      'from' => $shipment->originLocation ? "{$shipment->originLocation->city}, {$shipment->originLocation->state}" : 'Unknown',
                      'to' => $shipment->destinationLocation ? "{$shipment->destinationLocation->city}, {$shipment->destinationLocation->state}" : 'Unknown',
                  ],
                  'latest_event' => $shipment->history->first() ? $shipment->history->first()->location : 'No updates available',
              ];
          });

        $notFound = array_diff($trackingIds, $shipments->pluck('tracking_id')->toArray());

        return response()->json([
            'found' => $shipments,
            'not_found' => $notFound,
            'total_requested' => count($trackingIds),
            'total_found' => $shipments->count(),
        ]);
    }

    private function calculateEstimatedDelivery(Shipment $shipment): ?string
    {
        if ($shipment->status === 'delivered' || $shipment->delivery_date) {
            return null;
        }

        $baseDeliveryDays = 3; // Default delivery time
        $createdAt = Carbon::parse($shipment->created_at);

        // Adjust based on status
        switch ($shipment->status) {
            case 'pending':
                $estimatedDays = $baseDeliveryDays;
                break;
            case 'picked_up':
                $estimatedDays = $baseDeliveryDays - 1;
                break;
            case 'in_transit':
                $estimatedDays = 2;
                break;
            case 'out_for_delivery':
                $estimatedDays = 0; // Same day
                break;
            default:
                $estimatedDays = $baseDeliveryDays;
        }

        // Skip weekends for delivery estimation
        $estimatedDate = $createdAt->copy();
        $daysAdded = 0;
        
        while ($daysAdded < $estimatedDays) {
            $estimatedDate->addDay();
            if (!$estimatedDate->isWeekend()) {
                $daysAdded++;
            }
        }

        return $estimatedDate->toDateTimeString();
    }

    private function getTrackingInsights(Shipment $shipment): array
    {
        $insights = [];

        // Calculate days in transit
        $createdAt = Carbon::parse($shipment->created_at);
        $daysInTransit = $createdAt->diffInDays(now());

        // Get delivery performance
        $avgDeliveryTime = $this->getAverageDeliveryTime($shipment->origin_location_id, $shipment->destination_location_id);

        // Determine if shipment is on time
        $isOnTime = $daysInTransit <= $avgDeliveryTime;

        // Get similar route statistics
        $routeStats = $this->getRouteStatistics($shipment->origin_location_id, $shipment->destination_location_id);

        $insights = [
            'days_in_transit' => $daysInTransit,
            'average_delivery_time' => $avgDeliveryTime,
            'is_on_time' => $isOnTime,
            'route_statistics' => $routeStats,
            'delivery_probability' => $this->calculateDeliveryProbability($shipment),
            'next_update_expected' => $this->getNextUpdateExpected($shipment),
        ];

        // Add delay warnings if applicable
        if (!$isOnTime && $shipment->status !== 'delivered') {
            $insights['delay_warning'] = [
                'message' => 'This shipment is experiencing delays',
                'reason' => $this->getDelayReason($shipment),
                'estimated_additional_days' => max(0, $daysInTransit - $avgDeliveryTime),
            ];
        }

        return $insights;
    }

    private function getAverageDeliveryTime(int $originId, int $destinationId): float
    {
        return Cache::remember("avg_delivery_{$originId}_{$destinationId}", 3600, function () use ($originId, $destinationId) {
            $avgDays = Shipment::where('origin_location_id', $originId)
                ->where('destination_location_id', $destinationId)
                ->where('status', 'delivered')
                ->whereNotNull('delivery_date')
                ->get()
                ->map(function ($shipment) {
                    return Carbon::parse($shipment->created_at)->diffInDays(Carbon::parse($shipment->delivery_date));
                })
                ->avg();

            return $avgDays ?: 3.0; // Default to 3 days if no data
        });
    }

    private function getRouteStatistics(int $originId, int $destinationId): array
    {
        return Cache::remember("route_stats_{$originId}_{$destinationId}", 1800, function () use ($originId, $destinationId) {
            $stats = Shipment::where('origin_location_id', $originId)
                ->where('destination_location_id', $destinationId)
                ->selectRaw('
                    COUNT(*) as total_shipments,
                    SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered_count
                ')
                ->first();
                
            // Calculate average delivery days separately to avoid SQL compatibility issues
            $avgDeliveryDays = Shipment::where('origin_location_id', $originId)
                ->where('destination_location_id', $destinationId)
                ->where('status', 'delivered')
                ->whereNotNull('delivery_date')
                ->get()
                ->map(function ($shipment) {
                    return Carbon::parse($shipment->created_at)->diffInDays(Carbon::parse($shipment->delivery_date));
                })
                ->avg();

            return [
                'total_shipments' => $stats->total_shipments ?? 0,
                'success_rate' => $stats->total_shipments > 0 ? round(($stats->delivered_count / $stats->total_shipments) * 100, 1) : 0,
                'average_delivery_days' => round($avgDeliveryDays ?? 3, 1),
            ];
        });
    }

    private function calculateDeliveryProbability(Shipment $shipment): array
    {
        $daysInTransit = Carbon::parse($shipment->created_at)->diffInDays(now());
        $avgDeliveryTime = $this->getAverageDeliveryTime($shipment->origin_location_id, $shipment->destination_location_id);

        // Calculate probability based on status and time
        $baseProbability = match($shipment->status) {
            'pending' => 10,
            'picked_up' => 30,
            'in_transit' => 60,
            'out_for_delivery' => 90,
            'delivered' => 100,
            default => 5
        };

        // Adjust based on timing
        if ($daysInTransit > $avgDeliveryTime * 1.5) {
            $baseProbability = max(5, $baseProbability - 20);
        } elseif ($daysInTransit > $avgDeliveryTime) {
            $baseProbability = max(10, $baseProbability - 10);
        }

        return [
            'today' => min(100, $baseProbability),
            'within_2_days' => min(100, $baseProbability + 25),
            'within_week' => min(100, $baseProbability + 40),
        ];
    }

    private function getNextUpdateExpected(Shipment $shipment): ?string
    {
        $lastUpdate = $shipment->history->first();
        if (!$lastUpdate) {
            return Carbon::now()->addHours(4)->toISOString();
        }

        $lastUpdateTime = Carbon::parse($lastUpdate->created_at);
        $hoursSinceUpdate = $lastUpdateTime->diffInHours(now());

        // Determine next update based on status and time since last update
        $nextUpdateHours = match($shipment->status) {
            'pending' => 6,
            'picked_up' => 8,
            'in_transit' => 12,
            'out_for_delivery' => 2,
            default => 24
        };

        // If it's been longer than expected, suggest an update is due
        if ($hoursSinceUpdate >= $nextUpdateHours) {
            return 'Update overdue - check with support';
        }

        return $lastUpdateTime->addHours($nextUpdateHours)->toISOString();
    }

    private function getDelayReason(Shipment $shipment): string
    {
        $daysInTransit = Carbon::parse($shipment->created_at)->diffInDays(now());
        $avgDeliveryTime = $this->getAverageDeliveryTime($shipment->origin_location_id, $shipment->destination_location_id);

        if ($daysInTransit > $avgDeliveryTime * 2) {
            return 'Significant delay - please contact support for assistance';
        } elseif ($daysInTransit > $avgDeliveryTime * 1.5) {
            return 'Weather conditions or high shipping volume may be causing delays';
        } else {
            return 'Minor delay due to processing or routing optimization';
        }
    }
}
