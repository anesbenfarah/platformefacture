import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

import axios from 'axios';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    axios.get('/api/permissions', {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
    .then(res => setPermissions(res.data.data ?? []))
    .catch(() => setError("Erreur de chargement des permissions"))
    .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head title="Permissions" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Permissions du Super Admin</h1>
          <div className="bg-white rounded-lg shadow p-4 space-y-2">
            {loading && <p>Chargement...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && permissions.map(p => (
              <div key={p.name} className="flex justify-between items-center border-b last:border-0 py-2">
                <span className="font-medium">{p.display_name ?? p.name}</span>
                <span className="text-xs text-slate-500">{p.name}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}