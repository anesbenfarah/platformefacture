import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.visit('/');
            return;
        }

        axios
            .get('/api/admin/dashboard/stats', {
                headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
            })
            .then((res) => setStats(res.data.data))
            .catch((e) => {
                setError(e.response?.data?.message ?? "Erreur de chargement du tableau de bord.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="Admin - Tableau de bord" />
            <div className="flex min-h-screen bg-slate-100">
                <AdminSidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                            <p className="text-gray-500 mt-1">
                                Vue d&apos;ensemble de votre société et de votre équipe commerciale.
                            </p>
                        </div>

                        {loading && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-500 mt-4">Chargement...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {stats && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Utilisateurs (société)</p>
                                            <p className="text-2xl font-bold">{stats.totals.users}</p>
                                        </div>
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20h6M3 20h5v-2a3 3 0 00-5.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0zM5 7a3 3 0 116 0" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Commerciaux</p>
                                            <p className="text-2xl font-bold">{stats.totals.commerciaux}</p>
                                        </div>
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h7M9 7h.01M9 7a2 2 0 11-4 0 2 2 0 014 0zm6 0h.01M15 7a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Commerciaux actifs</p>
                                            <p className="text-2xl font-bold">{stats.totals.commerciaux_actifs}</p>
                                        </div>
                                        <div className="bg-emerald-100 p-3 rounded-full">
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7H7m6 4H7m6 4H7m5-9l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Clients</p>
                                            <p className="text-2xl font-bold">{stats.totals.clients}</p>
                                        </div>
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a3.5 3.5 0 11-3.5 3.5A3.5 3.5 0 0112 4.5zM5 20a7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-5">
                                    <h2 className="text-lg font-semibold mb-1">Société</h2>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">{stats.societe.nom}</span> — {stats.societe.email}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

