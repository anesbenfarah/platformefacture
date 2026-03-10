import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bars3Icon,
    XMarkIcon,
    BuildingOffice2Icon,
    ShieldCheckIcon,
    ChartBarSquareIcon,
    Cog8ToothIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
    { label: 'Statistiques', href: '/statistiques', icon: ChartBarSquareIcon },
    { label: 'Societes', href: '/societes', icon: BuildingOffice2Icon },
    { label: 'Administrateurs', href: '/administrateurs', icon: ShieldCheckIcon },
    { label: 'Permissions', href: '/permissions', icon: ShieldCheckIcon },
    { label: 'Parametres generaux', href: '/parametres-generaux', icon: Cog8ToothIcon },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const current = typeof window !== 'undefined' ? window.location.pathname : '';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.visit('/');
    };

    const sidebarContent = (
        <div className="h-full flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
            <div className="px-5 py-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-300/30 flex items-center justify-center">
                        <ShieldCheckIcon className="h-5 w-5 text-indigo-200" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-wide">Quote Maker</p>
                        <p className="text-xs text-indigo-200/80">Super Admin</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map(({ label, href, icon: Icon }) => {
                    const active = current === href || current.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                    ? 'bg-white/15 text-white shadow-lg shadow-indigo-900/40'
                                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className={`h-5 w-5 ${active ? 'text-indigo-200' : 'text-slate-300 group-hover:text-white'}`} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-500/20 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    Deconnexion
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="hidden lg:block w-72 shrink-0" />
            <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72">
                {sidebarContent}
            </aside>

            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur border-b border-white/10">
                <div className="h-16 px-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Super Admin</p>
                    <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-slate-200 hover:bg-white/10">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-72">{sidebarContent}</aside>
                    <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
            )}
        </>
    );
}