<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SocieteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\AdminController;

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
    Route::get('/',          [AdminController::class, 'index']);
    Route::get('/{id}',      [AdminController::class, 'show']);
    Route::post('/',         [AdminController::class, 'store']);
    Route::put('/{id}',      [AdminController::class, 'update']);
    Route::delete('/{id}',   [AdminController::class, 'destroy']);
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