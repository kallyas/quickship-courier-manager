<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public tracking routes
Route::get('/track', [TrackingController::class, 'index'])->name('tracking.index');
Route::post('/track', [TrackingController::class, 'track'])->name('tracking.track');

// Stripe webhook (must be outside auth middleware)
Route::post('/stripe/webhook', [PaymentController::class, 'webhook'])->name('cashier.webhook');

Route::middleware(['auth', 'verified'])->group(function () {
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
    
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    
    // Payment routes
    Route::get('payments/{shipment}', [PaymentController::class, 'showPaymentForm'])->name('payments.form');
    Route::post('payments/{shipment}', [PaymentController::class, 'processPayment'])->name('payments.process');
    
    // Admin routes
    Route::middleware(['role:admin|super_admin'])->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('locations', LocationController::class);
        
        // Reports route
        Route::get('reports', function () {
            return Inertia::render('Reports/Index');
        })->name('reports.index');
    });
    
    // Support route
    Route::get('support', function () {
        return Inertia::render('Support/Index');
    })->name('support.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
