<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $isCustomer = $user->user_type === 'customer';
        $isStaff = in_array($user->user_type, ['receptionist', 'admin', 'super_admin']);

        if ($isCustomer) {
            return $this->customerDashboard($user);
        } else {
            return $this->staffDashboard($user);
        }
    }

    private function customerDashboard($user): Response
    {
        // Customer shipment statistics
        $totalShipments = Shipment::where('sender_id', $user->id)->count();
        $inTransit = Shipment::where('sender_id', $user->id)
            ->whereIn('status', ['picked_up', 'in_transit', 'out_for_delivery'])
            ->count();
        $pendingPickup = Shipment::where('sender_id', $user->id)
            ->where('status', 'pending')
            ->count();
        $delivered = Shipment::where('sender_id', $user->id)
            ->where('status', 'delivered')
            ->count();

        // Recent shipments
        $recentShipments = Shipment::where('sender_id', $user->id)
            ->with(['originLocation', 'destinationLocation'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Payment statistics
        $totalSpent = Shipment::where('sender_id', $user->id)
            ->where('payment_status', 'paid')
            ->sum('price');
        $pendingPayments = Shipment::where('sender_id', $user->id)
            ->where('payment_status', 'pending')
            ->count();

        // Recent notifications
        $recentNotifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_shipments' => $totalShipments,
                'in_transit' => $inTransit,
                'pending_pickup' => $pendingPickup,
                'delivered' => $delivered,
                'total_spent' => $totalSpent,
                'pending_payments' => $pendingPayments,
                'unread_notifications' => $user->unreadNotifications()->count(),
            ],
            'recent_shipments' => $recentShipments,
            'recent_notifications' => $recentNotifications,
            'user_type' => 'customer'
        ]);
    }

    private function staffDashboard($user): Response
    {
        // Overall system statistics
        $totalShipments = Shipment::count();
        $inTransit = Shipment::whereIn('status', ['picked_up', 'in_transit', 'out_for_delivery'])->count();
        $pendingPickup = Shipment::where('status', 'pending')->count();
        $delivered = Shipment::where('status', 'delivered')->count();

        // Today's statistics
        $today = Carbon::today();
        $todayShipments = Shipment::whereDate('created_at', $today)->count();
        $todayDeliveries = Shipment::whereDate('delivery_date', $today)->count();

        // Revenue statistics
        $totalRevenue = Shipment::where('payment_status', 'paid')->sum('price');
        $monthlyRevenue = Shipment::where('payment_status', 'paid')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('price');

        // Recent shipments
        $recentShipments = Shipment::where('sender_id', $user->id)
            ->with(['originLocation', 'destinationLocation'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Status breakdown
        $statusBreakdown = Shipment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        // User statistics
        $totalUsers = User::count();
        $activeCustomers = User::where('user_type', 'customer')
            ->whereHas('sentShipments', function($query) {
                $query->where('created_at', '>=', Carbon::now()->subDays(30));
            })
            ->count();

        // Recent notifications
        $recentNotifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_shipments' => $totalShipments,
                'in_transit' => $inTransit,
                'pending_pickup' => $pendingPickup,
                'delivered' => $delivered,
                'today_shipments' => $todayShipments,
                'today_deliveries' => $todayDeliveries,
                'total_revenue' => $totalRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'total_users' => $totalUsers,
                'active_customers' => $activeCustomers,
                'unread_notifications' => $user->unreadNotifications()->count(),
            ],
            'recent_shipments' => $recentShipments,
            'recent_notifications' => $recentNotifications,
            'status_breakdown' => $statusBreakdown,
            'user_type' => 'staff'
        ]);
    }
}
