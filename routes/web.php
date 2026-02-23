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
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/societes', function () {
    return Inertia::render('Societes');
})->name('societes');

Route::get('/permissions', function () {
    return Inertia::render('Permissions');
})->name('permissions');

Route::get('/statistiques', function () {
    return Inertia::render('Statistiques');
})->name('statistiques');

Route::get('/parametres-generaux', function () {
    return Inertia::render('ParametresGeneraux');
})->name('parametres.generaux');

