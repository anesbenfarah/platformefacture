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

// Authentification
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});
// Gestion des Administrateurs (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admins')->group(function () {
    Route::get('/',          [SuperAdminController::class, 'index']);
    Route::get('/{id}',      [SuperAdminController::class, 'show']);
    Route::post('/',         [SuperAdminController::class, 'store']);
    Route::put('/{id}',      [SuperAdminController::class, 'update']);
    Route::delete('/{id}',   [SuperAdminController::class, 'destroy']);
});

// CRUD Utilisateurs (réservé au Super Admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

// Rôles (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::get('/{role}', [RoleController::class, 'show']);
});

// Sociétés + création de l'unique administrateur (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('societes')->group(function () {
    Route::get('/', [SocieteController::class, 'index']);
    Route::post('/', [SocieteController::class, 'store']);
    Route::get('/{societe}', [SocieteController::class, 'show']);
    Route::put('/{societe}', [SocieteController::class, 'update']);
    Route::delete('/{societe}', [SocieteController::class, 'destroy']);
});

// Statistiques globales (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->get('/dashboard/stats', [DashboardController::class, 'stats']);

// Permissions (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->get('/permissions', [PermissionController::class, 'index']);

// Assigner permissions à un rôle (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->put('/roles/{role}/permissions', [RolePermissionController::class, 'sync']);

// Paramètres système globaux (réservé au super_admin)
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('settings')->group(function () {
    Route::get('/', [SystemSettingController::class, 'index']);
    Route::put('/', [SystemSettingController::class, 'upsert']);
});

// Regroupe les informations générales de l'espace Super Admin
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('super-admin')->group(function () {
    Route::get('/overview', [SuperAdminController::class, 'overview']);
});

// Espace Admin (par société)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
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