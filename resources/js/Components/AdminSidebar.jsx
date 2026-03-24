import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
    { label: 'Statistiques', href: '/admin/statistiques', icon: ChartBarIcon },
    { label: 'Commerciaux', href: '/admin/commerciaux', icon: UsersIcon },
    { label: 'Parametres societe', href: '/admin/parametres-societe', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const current = typeof window !== 'undefined' ? window.location.pathname : '';

    const handleLogout = () => {
        router.post('/logout', {}, {
            onFinish: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.visit('/');
            },
        });
    };

    const sidebarContent = (
        <div className="h-full flex flex-col bg-gradient-to-b from-cyan-950 via-sky-900 to-blue-900 text-cyan-50">
            <div className="px-5 py-6 border-b border-white/15">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-300/20 border border-cyan-200/40 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-cyan-100" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-wide">Quote Maker</p>
                        <p className="text-xs text-cyan-100/80">Admin Societe</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5">
                {menuItems.map(({ label, href, icon: Icon }) => {
                    const active = current === href || current.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                    ? 'bg-cyan-200/20 text-white ring-1 ring-cyan-200/30'
                                    : 'text-cyan-100 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className={`h-5 w-5 ${active ? 'text-cyan-100' : 'text-cyan-200 group-hover:text-white'}`} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/15">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-cyan-50 hover:bg-red-500/30 transition-colors"
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

            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-cyan-950/95 backdrop-blur border-b border-white/10">
                <div className="h-16 px-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Admin</p>
                    <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-cyan-100 hover:bg-white/10">
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

