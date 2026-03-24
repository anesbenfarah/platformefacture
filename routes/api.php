<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SuperAdmin\SocieteController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SuperAdmin\SystemSettingController;
use App\Http\Controllers\SuperAdmin\SuperAdminController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CommercialController as AdminCommercialController;
use App\Http\Controllers\Admin\SocieteSettingController as AdminSocieteSettingController;
use App\Http\Controllers\Commercial\DashboardController as CommercialDashboardController;
use App\Http\Controllers\Commercial\CatalogueController as CommercialCatalogueController;
use App\Http\Controllers\Commercial\ClientController as CommercialClientController;

// Authentification
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});

// Routes publiques demandées
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/client', [AuthController::class, 'registerClient']);
// Gestion des Administrateurs (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->prefix('admins')->group(function () {
    Route::get('/',          [SuperAdminController::class, 'index']);
    Route::get('/{id}',      [SuperAdminController::class, 'show']);
    Route::post('/',         [SuperAdminController::class, 'store']);
    Route::put('/{id}',      [SuperAdminController::class, 'update']);
    Route::delete('/{id}',   [SuperAdminController::class, 'destroy']);
});

// CRUD Utilisateurs (réservé au Super Admin)
Route::middleware(['auth', 'role:super_admin'])->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

// Rôles (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::get('/{role}', [RoleController::class, 'show']);
});

// Sociétés + création de l'unique administrateur (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->prefix('societes')->group(function () {
    Route::get('/', [SocieteController::class, 'index']);
    Route::post('/', [SocieteController::class, 'store']);
    Route::get('/{societe}', [SocieteController::class, 'show']);
    Route::put('/{societe}', [SocieteController::class, 'update']);
    Route::delete('/{societe}', [SocieteController::class, 'destroy']);
});

// Statistiques globales (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->get('/dashboard/stats', [DashboardController::class, 'stats']);

// Permissions (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->get('/permissions', [PermissionController::class, 'index']);

// Assigner permissions à un rôle (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->put('/roles/{role}/permissions', [RolePermissionController::class, 'sync']);

// Paramètres système globaux (réservé au super_admin)
Route::middleware(['auth', 'role:super_admin'])->prefix('settings')->group(function () {
    Route::get('/', [SystemSettingController::class, 'index']);
    Route::put('/', [SystemSettingController::class, 'upsert']);
});

// Regroupe les informations générales de l'espace Super Admin
Route::middleware(['auth', 'role:super_admin'])->prefix('super-admin')->group(function () {
    Route::get('/overview', [SuperAdminController::class, 'overview']);
});

// Espace Admin (par société)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard & statistiques (société)
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);

    // Gestion des commerciaux de la société
    Route::get('/commerciaux', [AdminCommercialController::class, 'index']);
    Route::post('/commerciaux', [AdminCommercialController::class, 'store']);
    Route::put('/commerciaux/{id}', [AdminCommercialController::class, 'update']);
    Route::patch('/commerciaux/{id}/disable', [AdminCommercialController::class, 'disable']);

    // Paramètres de la société (logo, légal, CGV, etc.)
    Route::get('/societe/settings', [AdminSocieteSettingController::class, 'show']);
    Route::put('/societe/settings', [AdminSocieteSettingController::class, 'update']);
});

// Espace Commercial
Route::middleware(['auth', 'role:commercial'])->prefix('commercial')->group(function () {
    Route::get('/dashboard/stats', [CommercialDashboardController::class, 'stats']);

    Route::get('/catalogue', [CommercialCatalogueController::class, 'index']);
    Route::post('/catalogue', [CommercialCatalogueController::class, 'store']);
    Route::put('/catalogue/{id}', [CommercialCatalogueController::class, 'update']);
    Route::delete('/catalogue/{id}', [CommercialCatalogueController::class, 'destroy']);

    Route::get('/clients', [CommercialClientController::class, 'index']);
});

// Espace Client
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/me', [AuthController::class, 'user']);
});