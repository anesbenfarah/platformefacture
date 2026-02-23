import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';

export default function ParametresGeneraux() {
  const [form, setForm] = useState({
    app_name: '',
    support_email: '',
    default_currency: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    axios.get('/api/settings', {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const s = res.data.data ?? {};
      setForm({
        app_name: s.app_name ?? '',
        support_email: s.support_email ?? '',
        default_currency: s.default_currency ?? '',
      });
    })
    .catch(() => setError("Erreur de chargement des paramètres"))
    .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/settings', {
        settings: {
          app_name: form.app_name,
          support_email: form.support_email,
          default_currency: form.default_currency,
        },
      }, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      setSuccess('Paramètres enregistrés.');
    } catch (e) {
      setError(e.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head title="Paramètres généraux" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6 max-w-3xl">
          <h1 className="text-2xl font-semibold mb-4">Paramètres généraux</h1>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500 mb-3">{error}</p>}
          {success && <p className="text-green-600 mb-3">{success}</p>}

          {!loading && (
          <form className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de la plateforme</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Devis Platform"
                value={form.app_name}
                onChange={(e) => setForm((f) => ({ ...f, app_name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email de support</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="support@exemple.com"
                value={form.support_email}
                onChange={(e) => setForm((f) => ({ ...f, support_email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="TND"
                value={form.default_currency}
                onChange={(e) => setForm((f) => ({ ...f, default_currency: e.target.value }))}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
          )}
        </main>
      </div>
    </>
  );
}