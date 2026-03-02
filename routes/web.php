<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Routes Frontend (Inertia)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('SuperAdmin/Dashboard');
})->name('dashboard');

Route::get('/societes', function () {
    return Inertia::render('SuperAdmin/Societes');
})->name('societes');

Route::get('/administrateurs', function () {
    return Inertia::render('SuperAdmin/Administrateurs');
})->name('administrateurs');

Route::get('/permissions', function () {
    return Inertia::render('SuperAdmin/Permissions');
})->name('permissions');

Route::get('/statistiques', function () {
    return Inertia::render('SuperAdmin/Statistiques');
})->name('statistiques');

Route::get('/parametres-generaux', function () {
    return Inertia::render('SuperAdmin/ParametresGeneraux');
})->name('parametres.generaux');

// Routes Admin (par société)
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/statistiques', fn () => Inertia::render('Admin/Statistiques'))->name('admin.statistiques');
    Route::get('/commerciaux', fn () => Inertia::render('Admin/Commerciaux'))->name('admin.commerciaux');
    Route::get('/parametres-societe', fn () => Inertia::render('Admin/ParametresSociete'))->name('admin.parametres.societe');
});

