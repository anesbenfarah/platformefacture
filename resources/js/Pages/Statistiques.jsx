import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';

export default function Statistiques() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      return;
    }

    axios
      .get('/api/dashboard/stats', {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Erreur de chargement des statistiques'));
  }, []);

  const getRoleCount = (roleName) => {
    if (!stats || !stats.roles) return 0;
    const role = stats.roles.find((r) => r.name === roleName);
    return role ? role.users_count : 0;
  };

  return (
    <>
      <Head title="Statistiques" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            {/* Header avec titre et sous-titre */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Statistiques globales</h1>
              <p className="text-gray-500 mt-1">Aperçu des données clés de la plateforme.</p>
            </div>

            {/* Message d'erreur ou de chargement */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {!stats && !error && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Chargement des statistiques...</p>
              </div>
            )}

            {/* Cartes statistiques */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Admins */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Administrateurs</p>
                    <p className="text-2xl font-bold">{getRoleCount('admin')}</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 0112 15m4 0a4 4 0 014.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                  </div>
                </div>

                {/* Commerciaux */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Commerciaux</p>
                    <p className="text-2xl font-bold">{getRoleCount('commercial')}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Clients */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Clients</p>
                    <p className="text-2xl font-bold">{getRoleCount('client')}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>

                {/* Sociétés */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Sociétés</p>
                    <p className="text-2xl font-bold">{stats.total_societes}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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