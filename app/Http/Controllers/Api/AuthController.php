<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = Str::lower(trim((string) $validated['email']));

        if (!Auth::attempt(['email' => $email, 'password' => (string) $validated['password']])) {
            return response()->json([
                'message' => 'Identifiants invalides',
                'errors' => [
                    'email' => ['Les identifiants fournis sont incorrects.'],
                ],
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $resolvedRole = optional($user->role()->first())->name
            ?? $user->getAttribute('role')
            ?? Role::CLIENT;

        if (empty($user->role)) {
            $user->role = $resolvedRole;
            $user->save();
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $resolvedRole,
            ],
            'token' => $token,
        ], 200);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        
        $role = Role::where('name', Role::CLIENT)->first();

       
        if (! $role) {
            $role = Role::create([
                'name' => Role::CLIENT,
                'display_name' => 'Client',
                'description' => 'Compte client standard',
                'is_active' => true,
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
            'societe_id' => null,
            'is_active' => true,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function registerClient(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $email = Str::lower(trim((string) $validated['email']));

        $role = Role::query()->firstOrCreate(
            ['name' => Role::CLIENT],
            [
                'display_name' => 'Client',
                'description' => 'Compte client standard',
                'is_active' => true,
            ]
        );

        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
            'role' => Role::CLIENT,
            'societe_id' => null,
            'is_active' => true,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription client réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => Role::CLIENT,
            ],
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ], 200);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        $user?->load('role');

        return response()->json([
            'user' => $user,
            'role_name' => optional($user?->role()->first())->name ?? $user?->getAttribute('role'),
        ], 200);
    }
}