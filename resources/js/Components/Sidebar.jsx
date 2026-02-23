import { Link } from '@inertiajs/react';
import { ShieldCheck, Building2, Settings2, LayoutDashboard, LogOut, Users } from 'lucide-react';

export default function Sidebar({ onLogout }) {
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
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 text-slate-50 font-medium shadow-sm"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Statistiques</span>
                </Link>

                <div className="mt-4 text-[11px] uppercase tracking-wide text-slate-500 px-3">
                    Gestion
                </div>

                <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <Building2 className="h-4 w-4" />
                    <span>Sociétés</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <Users className="h-4 w-4" />
                    <span>Administrateurs</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Permissions</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:bg-slate-800/60 transition-colors"
                >
                    <Settings2 className="h-4 w-4" />
                    <span>Paramètres globaux</span>
                </button>
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between gap-2">
                <span>Connecté en tant que SuperAdmin</span>
                <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                    <LogOut className="h-3 w-3" />
                    Se déconnecter
                </button>
            </div>
        </aside>
    );
}