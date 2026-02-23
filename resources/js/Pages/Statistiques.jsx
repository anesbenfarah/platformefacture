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
      setError("Non authentifié");
      return;
    }

    axios.get('/api/dashboard/stats', {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
    .then(res => setStats(res.data.data))
    .catch(() => setError("Erreur de chargement des statistiques"));
  }, []);

  return (
    <>
      <Head title="Statistiques" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Statistiques globales</h1>

          {error && <p className="text-red-500">{error}</p>}
          {!stats && !error && <p>Chargement...</p>}

          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-slate-500">Utilisateurs</p>
                  <p className="text-2xl font-bold">{stats.total_users}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-slate-500">Sociétés</p>
                  <p className="text-2xl font-bold">{stats.total_societes}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-2">Utilisateurs par rôle</h2>
                <ul className="divide-y">
                  {stats.roles.map(r => (
                    <li key={r.name} className="flex justify-between py-2 text-sm">
                      <span>{r.display_name}</span>
                      <span className="font-semibold">{r.users_count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}