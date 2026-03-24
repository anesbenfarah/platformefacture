<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardApiController;
use App\Http\Controllers\SuperAdmin\SocieteController as SuperAdminSocieteApiController;
use App\Http\Controllers\SuperAdmin\SuperAdminController as SuperAdminAdminApiController;
use App\Http\Controllers\SuperAdmin\SystemSettingController as SuperAdminSystemSettingApiController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardApiController;
use App\Http\Controllers\Admin\CommercialController as AdminCommercialApiController;
use App\Http\Controllers\Admin\SocieteSettingController as AdminSocieteSettingApiController;
use App\Http\Controllers\Commercial\DashboardController as CommercialDashboardApiController;
use App\Http\Controllers\Commercial\CatalogueController as CommercialCatalogueApiController;
use App\Http\Controllers\Commercial\ClientController as CommercialClientApiController;
use App\Http\Controllers\Api\AuthController as ApiAuthController;

Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');
Route::get('/unauthorized', fn () => Inertia::render('Unauthorized'))->name('unauthorized');

// ---- Super Admin ----
Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/dashboard',           fn () => Inertia::render('SuperAdmin/Dashboard'))->name('dashboard');
    Route::get('/societes',            fn () => Inertia::render('SuperAdmin/Societes'))->name('societes');
    Route::get('/administrateurs',     fn () => Inertia::render('SuperAdmin/Administrateurs'))->name('administrateurs');
    Route::get('/permissions',         fn () => Inertia::render('SuperAdmin/Permissions'))->name('permissions');
    Route::get('/statistiques',        fn () => Inertia::render('SuperAdmin/Statistiques'))->name('statistiques');
    Route::get('/parametres-generaux', fn () => Inertia::render('SuperAdmin/ParametresGeneraux'))->name('parametres.generaux');
});

// ---- Admin ----
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard',          fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/statistiques',       fn () => Inertia::render('Admin/Statistiques'))->name('admin.statistiques');
    Route::get('/commerciaux',        fn () => Inertia::render('Admin/Commerciaux'))->name('admin.commerciaux');
    Route::get('/parametres-societe', fn () => Inertia::render('Admin/ParametresSociete'))->name('admin.parametres.societe');
});

// ---- Commercial ----
Route::middleware(['auth', 'role:commercial'])->prefix('commercial')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Commercial/Dashboard'))->name('commercial.dashboard');
    Route::get('/catalogue', fn () => Inertia::render('Commercial/Catalogue'))->name('commercial.catalogue');
    Route::get('/clients', fn () => Inertia::render('Commercial/Clients'))->name('commercial.clients');
    Route::get('/devis', fn () => Inertia::render('Commercial/Devis'))->name('commercial.devis');
});

// ---- Client ----
Route::middleware(['auth', 'role:client'])->prefix('client')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Client/Dashboard'))->name('client.dashboard');
});

// ---- API JSON via session web ----
Route::prefix('api')->middleware('auth')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/user', [ApiAuthController::class, 'user']);
        Route::post('/logout', [ApiAuthController::class, 'logout']);
    });

    Route::middleware('role:super_admin')->group(function () {
        Route::get('/dashboard/stats', [SuperAdminDashboardApiController::class, 'stats']);
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::put('/roles/{role}/permissions', [\App\Http\Controllers\RolePermissionController::class, 'sync']);
        Route::get('/super-admin/overview', [SuperAdminAdminApiController::class, 'overview']);

        Route::get('/admins', [SuperAdminAdminApiController::class, 'index']);
        Route::get('/admins/{id}', [SuperAdminAdminApiController::class, 'show']);
        Route::post('/admins', [SuperAdminAdminApiController::class, 'store']);
        Route::put('/admins/{id}', [SuperAdminAdminApiController::class, 'update']);
        Route::delete('/admins/{id}', [SuperAdminAdminApiController::class, 'destroy']);

        Route::get('/societes', [SuperAdminSocieteApiController::class, 'index']);
        Route::post('/societes', [SuperAdminSocieteApiController::class, 'store']);
        Route::get('/societes/{societe}', [SuperAdminSocieteApiController::class, 'show']);
        Route::put('/societes/{societe}', [SuperAdminSocieteApiController::class, 'update']);
        Route::delete('/societes/{societe}', [SuperAdminSocieteApiController::class, 'destroy']);

        Route::get('/settings', [SuperAdminSystemSettingApiController::class, 'index']);
        Route::put('/settings', [SuperAdminSystemSettingApiController::class, 'upsert']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [AdminDashboardApiController::class, 'stats']);
        Route::get('/commerciaux', [AdminCommercialApiController::class, 'index']);
        Route::post('/commerciaux', [AdminCommercialApiController::class, 'store']);
        Route::put('/commerciaux/{id}', [AdminCommercialApiController::class, 'update']);
        Route::patch('/commerciaux/{id}/disable', [AdminCommercialApiController::class, 'disable']);
        Route::get('/societe/settings', [AdminSocieteSettingApiController::class, 'show']);
        Route::put('/societe/settings', [AdminSocieteSettingApiController::class, 'update']);
    });

    Route::middleware('role:commercial')->prefix('commercial')->group(function () {
        Route::get('/dashboard/stats', [CommercialDashboardApiController::class, 'stats']);
        Route::get('/catalogue', [CommercialCatalogueApiController::class, 'index']);
        Route::post('/catalogue', [CommercialCatalogueApiController::class, 'store']);
        Route::put('/catalogue/{id}', [CommercialCatalogueApiController::class, 'update']);
        Route::delete('/catalogue/{id}', [CommercialCatalogueApiController::class, 'destroy']);
        Route::get('/clients', [CommercialClientApiController::class, 'index']);
    });
});

require __DIR__.'/auth.php';