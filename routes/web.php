<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {  
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Add the rooms.index and rooms.create routes
    Route::get('/rooms', function () {
        return Inertia::render('Rooms/Index');
    })->name('rooms.index');
    
    Route::get('/rooms/create', function () {
        return Inertia::render('Rooms/Create');
    })->name('rooms.create');
});

// Add the new route to render the Drink page
Route::get('/drink', function () {
    return Inertia::render('Drink');
})->name('drink');

// Add the new route to render the Staff page
Route::get('/staff', function () {
    return Inertia::render('Drink/Staff');
})->name('staff');

// Add the new route to render the Staff Bills page
Route::get('/staff-bills', function () {
    return Inertia::render('Drink/StaffBills');
})->name('staff-bills');

require __DIR__.'/auth.php';