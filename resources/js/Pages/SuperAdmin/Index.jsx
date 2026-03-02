import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';

export default function SuperAdminIndex() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.visit('/');
            return;
        }

        axios
            .get('/api/super-admin/overview', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setMessage(res.data?.message ?? 'Espace Super Admin');
            })
            .catch(() => {
                setError(
                    "Vous n'avez pas l'autorisation d'accéder à l'espace Super Admin ou une erreur est survenue.",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <>
                <Head title="Super Admin" />
                <div className="flex items-center justify-center min-h-screen">
                    Chargement...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head title="Super Admin - Erreur" />
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <h2 className="text-xl font-semibold text-red-600">Accès refusé</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Super Admin" />
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Espace Super Administrateur
                            </h1>
                            <p className="mt-2 text-gray-600">{message}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                                    Gestion des sociétés
                                </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Créer, modifier et supprimer les sociétés.
                                </p>
                                <button
                                    onClick={() => router.visit('/societes')}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Accéder
                                </button>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                                    Gestion des administrateurs
                                </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Gérer les administrateurs rattachés aux sociétés.
                                </p>
                                <button
                                    onClick={() => router.visit('/administrateurs')}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Accéder
                                </button>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                                    Statistiques globales
                                </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Visualiser les indicateurs clés du système.
                                </p>
                                <button
                                    onClick={() => router.visit('/statistiques')}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Accéder
                                </button>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                                    Rôles & Permissions
                                </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Configurer les rôles et permissions des utilisateurs.
                                </p>
                                <button
                                    onClick={() => router.visit('/permissions')}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Accéder
                                </button>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                                    Paramètres généraux
                                </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Gérer les paramètres globaux du système.
                                </p>
                                <button
                                    onClick={() => router.visit('/parametres-generaux')}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Accéder
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

