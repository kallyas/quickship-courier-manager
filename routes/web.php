<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Stripe webhook (must be outside auth middleware)
Route::post('/stripe/webhook', [PaymentController::class, 'webhook'])->name('cashier.webhook');

Route::middleware(['auth', 'verified'])->group(function () {
    // Tracking routes
    Route::get('/track', [TrackingController::class, 'index'])->name('tracking.index');
    Route::post('/track', [TrackingController::class, 'track'])->name('tracking.track');
    Route::post('/track/refresh', [TrackingController::class, 'refreshStatus'])->name('tracking.refresh');
    Route::post('/track/multiple', [TrackingController::class, 'getMultipleTracking'])->name('tracking.multiple');
    
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Test route to create sample notifications (for development)
    Route::get('test/notifications', function () {
        $user = auth()->user();
        
        \App\Models\Notification::createForUser(
            $user->id,
            'info',
            'Welcome to QuickShip',
            'Thank you for joining our courier service platform.',
            null,
            route('dashboard'),
            'View Dashboard'
        );
        
        \App\Models\Notification::createForUser(
            $user->id,
            'success',
            'Profile Updated',
            'Your profile information has been successfully updated.',
            null,
            route('profile.edit'),
            'View Profile'
        );
        
        \App\Models\Notification::createForUser(
            $user->id,
            'warning',
            'Payment Reminder',
            'You have pending payments that require attention.',
            null,
            route('shipments.index'),
            'View Shipments'
        );
        
        return redirect()->route('notifications.index')->with('success', 'Test notifications created!');
    })->name('test.notifications');
    
    // Shipment management routes
    Route::resource('shipments', ShipmentController::class);
    Route::patch('shipments/{shipment}/status', [ShipmentController::class, 'updateStatus'])->name('shipments.update-status');
    Route::patch('shipments/bulk-status', [ShipmentController::class, 'bulkUpdateStatus'])->name('shipments.bulk-update-status');
    
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    
    // Payment routes - specific routes must come before parameterized routes
    Route::get('payments', function () {
        // Redirect based on user role
        if (auth()->user()->hasRole(['admin', 'super_admin'])) {
            return redirect()->route('payments.history');
        } else {
            return redirect()->route('payments.my-history');
        }
    })->name('payments.index');
    Route::get('payments/my-history', [PaymentController::class, 'myPaymentHistory'])->name('payments.my-history');
    Route::get('payments/history', [PaymentController::class, 'paymentHistory'])->name('payments.history');
    Route::get('payments/success', [PaymentController::class, 'paymentSuccess'])->name('payments.success');
    Route::get('payments/{shipment}', [PaymentController::class, 'showPaymentForm'])->name('payments.form');
    Route::post('payments/{shipment}/intent', [PaymentController::class, 'createPaymentIntent'])->name('payments.intent');
    Route::get('payments/{shipment}/status', [PaymentController::class, 'checkPaymentStatus'])->name('payments.status');
    Route::post('payments/{shipment}/manual', [PaymentController::class, 'markAsPaidManually'])->name('payments.manual');
    
    // Invoice routes - specific routes must come before parameterized routes
    Route::get('invoices/my-invoices', [PaymentController::class, 'myInvoices'])->name('invoices.my-invoices');
    Route::get('invoices/admin', [PaymentController::class, 'invoicesList'])->name('invoices.admin');
    Route::get('invoices', function () {
        // Redirect based on user role
        if (auth()->user()->hasRole(['admin', 'super_admin'])) {
            return redirect()->route('invoices.admin');
        } else {
            return redirect()->route('invoices.my-invoices');
        }
    })->name('invoices.index');
    Route::get('invoices/{shipment}', [PaymentController::class, 'generateInvoice'])->name('invoices.generate');
    
    // Admin routes - authorization handled in controllers
    Route::resource('users', UserController::class);
    Route::resource('locations', LocationController::class);
    
    // Reports routes
    Route::get('reports', [ReportsController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportsController::class, 'export'])->name('reports.export');
    
    // Support route
    Route::get('support', function () {
        return Inertia::render('Support/Index');
    })->name('support.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
