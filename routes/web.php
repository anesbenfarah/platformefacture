<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');

// ---- Super Admin ----
Route::get('/dashboard',           fn () => Inertia::render('SuperAdmin/Dashboard'))->name('dashboard');
Route::get('/societes',            fn () => Inertia::render('SuperAdmin/Societes'))->name('societes');
Route::get('/administrateurs',     fn () => Inertia::render('SuperAdmin/Administrateurs'))->name('administrateurs');
Route::get('/permissions',         fn () => Inertia::render('SuperAdmin/Permissions'))->name('permissions');
Route::get('/statistiques',        fn () => Inertia::render('SuperAdmin/Statistiques'))->name('statistiques');
Route::get('/parametres-generaux', fn () => Inertia::render('SuperAdmin/ParametresGeneraux'))->name('parametres.generaux');

// ---- Admin ----
Route::prefix('admin')->group(function () {                                          // ← ouverture
    Route::get('/dashboard',          fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/statistiques',       fn () => Inertia::render('Admin/Statistiques'))->name('admin.statistiques');
    Route::get('/commerciaux',        fn () => Inertia::render('Admin/Commerciaux'))->name('admin.commerciaux');
    Route::get('/parametres-societe', fn () => Inertia::render('Admin/ParametresSociete'))->name('admin.parametres.societe');
});                                                                                   // ← fermeture

// ---- Commercial ----
Route::prefix('commercial')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Commercial/Dashboard'))->name('commercial.dashboard');
    Route::get('/catalogue', fn () => Inertia::render('Commercial/Catalogue'))->name('commercial.catalogue');
    Route::get('/clients', fn () => Inertia::render('Commercial/Clients'))->name('commercial.clients');
    Route::get('/devis', fn () => Inertia::render('Commercial/Devis'))->name('commercial.devis');
});