import { Head, router, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function SuperAdminDashboard() {
    const { props } = usePage();
    const user = props?.auth?.user ?? null;

    async function handleLogout() {
        try {
            router.post('/logout');
        } catch (e) {
            console.error('Erreur logout:', e);
        }
    }

    return (
        <>
            <Head title="Dashboard Super Admin" />
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar onLogout={handleLogout} />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-4">
                        Dashboard Super Administrateur
                    </h1>
                    <p className="text-gray-600">
                        Bienvenue {user?.name}, gérez les statistiques, sociétés, administrateurs et
                        paramètres globaux depuis cet espace.
                    </p>
                </main>
            </div>
        </>
    );
}

