<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return $this->unauthenticatedResponse($request);
        }

        $roleName = $this->resolveRoleName($user);

        $allowed = array_map(fn ($role) => $this->normalizeRole((string) $role), $roles);
        if (!in_array($roleName, $allowed, true)) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Accès non autorisé',
                ], 403);
            }

            $destination = match ($roleName) {
                Role::SUPER_ADMIN => '/statistiques',
                Role::ADMIN => '/admin/statistiques',
                Role::COMMERCIAL => '/commercial/dashboard',
                Role::CLIENT => '/client/dashboard',
                default => '/unauthorized',
            };

            return redirect($destination);
        }

        return $next($request);
    }

    private function unauthenticatedResponse(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Non authentifié',
            ], 401);
        }

        return redirect('/login');
    }

    private function resolveRoleName(object $user): string
    {
        $name = (string) optional($user->role()->first())->name;

        if ($name === '' && !empty($user->role_id)) {
            $name = (string) (Role::query()->find($user->role_id)?->name ?? '');
        }

        if ($name === '') {
            $name = (string) ($user->getAttribute('role') ?? '');
        }

        return $this->normalizeRole($name);
    }

    private function normalizeRole(string $role): string
    {
        return str_replace([' ', '-'], '_', strtolower(trim($role)));
    }
}
