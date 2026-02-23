import { Link, router } from '@inertiajs/react';
import { ShieldCheck, Building2, Settings2, LogOut, BarChart3 } from 'lucide-react';

export default function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.visit('/');
    };

    return (
        <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen py-6 px-4 flex flex-col">
            <div className="mb-8 px-2">
                <div className="inline-flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold">
                        DP
                    </span>
                    <div>
                        <p className="text-sm font-semibold tracking-tight">
                            Devis Platform
                        </p>
                        <p className="text-[11px] text-slate-400">
                            Super admin
                        </p>
                    </div>
                </div>
            </div>

            <nav className="space-y-1 text-sm flex-1">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 px-3 mb-2">
                    Gestion
                </div>

                {/* Statistiques */}
                <Link
                    href="/statistiques"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <BarChart3 className="h-4 w-4" />
                    <span>Statistiques</span>
                </Link>

                {/* Sociétés */}
                <Link
                    href="/societes"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <Building2 className="h-4 w-4" />
                    <span>Sociétés</span>
                </Link>

                {/* Permissions */}
                <Link
                    href="/permissions"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Permissions</span>
                </Link>

                {/* Paramètres généraux */}
                <Link
                    href="/parametres-generaux"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <Settings2 className="h-4 w-4" />
                    <span>Paramètres généraux</span>
                </Link>
            </nav>

            {/* Footer — Déconnexion */}
            <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="text-[11px] text-slate-500 mb-3">
                    Connecté en tant que SuperAdmin
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    <LogOut className="h-3 w-3" />
                    Se déconnecter
                </button>
            </div>
        </aside>
    );
}