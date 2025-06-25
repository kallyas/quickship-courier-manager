<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\User;
use App\Models\PaymentHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function index(): Response
    {
        // Check if user has admin or super_admin role
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        // Get summary statistics
        $stats = $this->getSummaryStats();
        
        // Get chart data
        $chartData = $this->getChartData();
        
        // Get recent activity
        $recentActivity = $this->getRecentActivity();

        return Inertia::render('Reports/Index', [
            'stats' => $stats,
            'chartData' => $chartData,
            'recentActivity' => $recentActivity,
        ]);
    }

    private function getSummaryStats(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
        // Total revenue
        $totalRevenue = PaymentHistory::where('status', 'succeeded')
            ->sum('amount');
            
        $currentMonthRevenue = PaymentHistory::where('status', 'succeeded')
            ->where('completed_at', '>=', $currentMonth)
            ->sum('amount');
            
        $lastMonthRevenue = PaymentHistory::where('status', 'succeeded')
            ->whereBetween('completed_at', [$lastMonth, $currentMonth])
            ->sum('amount');

        // Total shipments
        $totalShipments = Shipment::count();
        $currentMonthShipments = Shipment::where('created_at', '>=', $currentMonth)->count();
        $lastMonthShipments = Shipment::whereBetween('created_at', [$lastMonth, $currentMonth])->count();

        // Active users (users who created shipments in the last 30 days)
        $activeUsers = User::whereHas('sentShipments', function ($query) {
            $query->where('created_at', '>=', Carbon::now()->subDays(30));
        })->count();

        // Growth rate calculation
        $revenueGrowth = $lastMonthRevenue > 0 
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        $shipmentGrowth = $lastMonthShipments > 0 
            ? (($currentMonthShipments - $lastMonthShipments) / $lastMonthShipments) * 100 
            : 0;

        return [
            'total_revenue' => $totalRevenue,
            'revenue_growth' => round($revenueGrowth, 1),
            'total_shipments' => $totalShipments,
            'shipment_growth' => round($shipmentGrowth, 1),
            'active_users' => $activeUsers,
            'avg_order_value' => $totalShipments > 0 ? round($totalRevenue / $totalShipments, 2) : 0,
        ];
    }

    private function getChartData(): array
    {
        // Revenue data for the last 12 months
        $revenueData = [];
        $shipmentData = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();
            
            $revenue = PaymentHistory::where('status', 'succeeded')
                ->whereBetween('completed_at', [$monthStart, $monthEnd])
                ->sum('amount');
                
            $shipments = Shipment::whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();
            
            $revenueData[] = [
                'month' => $month->format('M Y'),
                'revenue' => (float) $revenue,
            ];
            
            $shipmentData[] = [
                'month' => $month->format('M Y'),
                'shipments' => $shipments,
            ];
        }

        // Shipment status distribution
        $statusData = Shipment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst(str_replace('_', ' ', $item->status)),
                    'count' => $item->count,
                ];
            });

        // Top performing locations (by shipment volume)
        $topLocations = DB::table('shipments')
            ->join('locations', 'shipments.origin_location_id', '=', 'locations.id')
            ->select('locations.city', 'locations.state', DB::raw('count(*) as shipment_count'))
            ->groupBy('locations.city', 'locations.state')
            ->orderBy('shipment_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'location' => $item->city . ', ' . $item->state,
                    'shipments' => $item->shipment_count,
                ];
            });

        return [
            'revenue' => $revenueData,
            'shipments' => $shipmentData,
            'status_distribution' => $statusData,
            'top_locations' => $topLocations,
        ];
    }

    private function getRecentActivity(): array
    {
        // Recent shipments
        $recentShipments = Shipment::with(['sender', 'originLocation', 'destinationLocation'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($shipment) {
                return [
                    'id' => $shipment->id,
                    'tracking_id' => $shipment->tracking_id,
                    'sender' => $shipment->sender->name,
                    'origin' => $shipment->originLocation->city,
                    'destination' => $shipment->destinationLocation->city,
                    'status' => $shipment->status,
                    'payment_status' => $shipment->payment_status,
                    'price' => $shipment->price,
                    'created_at' => $shipment->created_at->format('M d, Y H:i'),
                ];
            });

        // Recent payments
        $recentPayments = PaymentHistory::with(['shipment', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'user' => $payment->user->name,
                    'shipment_tracking' => $payment->shipment->tracking_id,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'type' => $payment->type,
                    'created_at' => $payment->created_at->format('M d, Y H:i'),
                ];
            });

        return [
            'shipments' => $recentShipments,
            'payments' => $recentPayments,
        ];
    }

    public function export(Request $request)
    {
        // Check if user has admin or super_admin role
        if (!auth()->user()->hasRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        $type = $request->query('type', 'shipments');
        $format = $request->query('format', 'csv');

        switch ($type) {
            case 'shipments':
                return $this->exportShipments($format);
            case 'payments':
                return $this->exportPayments($format);
            case 'users':
                return $this->exportUsers($format);
            default:
                abort(400, 'Invalid export type.');
        }
    }

    private function exportShipments($format)
    {
        $shipments = Shipment::with(['sender', 'originLocation', 'destinationLocation'])
            ->get()
            ->map(function ($shipment) {
                return [
                    'Tracking ID' => $shipment->tracking_id,
                    'Sender' => $shipment->sender->name,
                    'Sender Email' => $shipment->sender->email,
                    'Recipient' => $shipment->recipient_name,
                    'Origin' => $shipment->originLocation->city . ', ' . $shipment->originLocation->state,
                    'Destination' => $shipment->destinationLocation->city . ', ' . $shipment->destinationLocation->state,
                    'Price' => $shipment->price,
                    'Status' => $shipment->status,
                    'Payment Status' => $shipment->payment_status,
                    'Created At' => $shipment->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return $this->generateExport($shipments, 'shipments', $format);
    }

    private function exportPayments($format)
    {
        $payments = PaymentHistory::with(['shipment', 'user'])
            ->get()
            ->map(function ($payment) {
                return [
                    'Payment ID' => $payment->id,
                    'User' => $payment->user->name,
                    'User Email' => $payment->user->email,
                    'Shipment Tracking' => $payment->shipment->tracking_id,
                    'Amount' => $payment->amount,
                    'Currency' => $payment->currency,
                    'Status' => $payment->status,
                    'Type' => $payment->type,
                    'Payment Intent ID' => $payment->payment_intent_id,
                    'Attempted At' => $payment->attempted_at ? $payment->attempted_at->format('Y-m-d H:i:s') : null,
                    'Completed At' => $payment->completed_at ? $payment->completed_at->format('Y-m-d H:i:s') : null,
                ];
            });

        return $this->generateExport($payments, 'payments', $format);
    }

    private function exportUsers($format)
    {
        $users = User::withCount('sentShipments')
            ->get()
            ->map(function ($user) {
                return [
                    'ID' => $user->id,
                    'Name' => $user->name,
                    'Email' => $user->email,
                    'Role' => $user->role,
                    'Total Shipments' => $user->sent_shipments_count,
                    'Email Verified' => $user->email_verified_at ? 'Yes' : 'No',
                    'Joined At' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return $this->generateExport($users, 'users', $format);
    }

    private function generateExport($data, $filename, $format)
    {
        if ($format === 'json') {
            return response()->json($data)
                ->header('Content-Disposition', "attachment; filename=\"{$filename}.json\"");
        }

        // Default to CSV
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            
            if ($data->isNotEmpty()) {
                // Write headers
                fputcsv($file, array_keys($data->first()));
                
                // Write data
                foreach ($data as $row) {
                    fputcsv($file, array_values($row));
                }
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}