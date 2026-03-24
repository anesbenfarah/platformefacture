<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Signup');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $clientRole = Role::query()->firstOrCreate(
            ['name' => Role::CLIENT],
            [
                'display_name' => 'Client',
                'description' => 'Compte client standard',
                'is_active' => true,
            ]
        );

        $payload = [
            'name' => $request->name,
            'email' => strtolower((string) $request->email),
            'password' => Hash::make($request->password),
            'role_id' => $clientRole->id,
            'societe_id' => null,
            'is_active' => true,
        ];
        if (Schema::hasColumn('users', 'role')) {
            $payload['role'] = Role::CLIENT;
        }

        $user = User::create($payload);

        event(new Registered($user));

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect()->to('/client/dashboard');
    }
}
