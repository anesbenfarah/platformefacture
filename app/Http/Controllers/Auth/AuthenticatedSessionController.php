<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = $request->user();
        $roleName = '';
        if (!empty($user?->role_id)) {
            $roleName = (string) (Role::query()->whereKey($user->role_id)->value('name') ?? '');
        }
        if ($roleName === '') {
            $roleName = (string) ($user?->getAttribute('role') ?? '');
        }
        $roleName = str_replace([' ', '-'], '_', strtolower(trim($roleName)));

        $target = match ($roleName) {
            Role::SUPER_ADMIN => route('statistiques', absolute: false),
            Role::ADMIN => route('admin.statistiques', absolute: false),
            Role::COMMERCIAL => route('commercial.dashboard', absolute: false),
            Role::CLIENT => route('client.dashboard', absolute: false),
            default => route('welcome', absolute: false),
        };

        // On force la destination du rôle pour éviter un ancien URL "intended"
        // (ex: /statistiques) mémorisé en session.
        return redirect()->to($target);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
