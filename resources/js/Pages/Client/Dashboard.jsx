import { Head, router } from '@inertiajs/react';

export default function ClientDashboard() {
    const logout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Espace Client" />
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">Bienvenue dans votre espace client</h1>
                    <p className="mt-2 text-gray-600">
                        Votre compte est authentifie. Vous pouvez acceder a votre plateforme client.
                    </p>

                    <button
                        type="button"
                        onClick={logout}
                        className="mt-6 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        Se deconnecter
                    </button>
                </div>
            </div>
        </>
    );
}
