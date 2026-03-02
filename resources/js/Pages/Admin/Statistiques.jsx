import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminStatistiques() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .catch((e) => setError(e.response?.data?.message ?? 'Erreur de chargement des statistiques'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head title="Statistiques (Admin)" />
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Statistiques de la société</h1>
              
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {loading && !error && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Chargement des statistiques...</p>
              </div>
            )}

            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Commerciaux */}
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

                {/* Clients */}
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

                {/* Produits */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Produits</p>
                    <p className="text-2xl font-bold">{stats.totals.produits ?? 0}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Services</p>
                    <p className="text-2xl font-bold">{stats.totals.services ?? 0}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m-4-4v14" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

