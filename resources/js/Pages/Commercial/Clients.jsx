import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import CommercialSidebar from '@/Components/CommercialSidebar';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = () => ({
    Accept: 'application/json',
  });

  useEffect(() => {
    axios
      .get('/api/commercial/clients', { headers: headers() })
      .then((res) => setClients(res.data.data ?? []))
      .catch((e) => setError(e.response?.data?.message ?? 'Erreur de chargement des clients.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head title="Commercial - Clients" />
      <div className="flex min-h-screen bg-slate-100">
        <CommercialSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Liste des clients</h1>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Nom</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Telephone</th>
                    <th className="text-left p-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-t">
                      <td className="p-3">{client.name}</td>
                      <td className="p-3">{client.email}</td>
                      <td className="p-3">{client.telephone ?? '-'}</td>
                      <td className="p-3">{client.is_active ? 'Actif' : 'Inactif'}</td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td className="p-4 text-gray-500" colSpan={4}>Aucun client trouve pour votre societe.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
