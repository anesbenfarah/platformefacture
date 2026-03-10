import { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import CommercialSidebar from '@/Components/CommercialSidebar';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '@/lib/alerts';

const emptyForm = {
  type: 'product',
  name: '',
  prixHT: '',
  tva: '',
  remise: '',
  description: '',
  is_active: true,
};

export default function CataloguePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const headers = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/commercial/catalogue', { headers: headers() });
      setItems(res.data.data ?? []);
    } catch (e) {
      setError(e.response?.data?.message ?? 'Erreur de chargement du catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.visit('/');
      return;
    }
    loadItems();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...form,
      prixHT: Number(form.prixHT || 0),
      tva: Number(form.tva || 0),
      remise: Number(form.remise || 0),
    };

    try {
      if (editingId) {
        const res = await axios.put(`/api/commercial/catalogue/${editingId}`, payload, { headers: headers() });
        const updated = res.data?.data;
        if (updated) {
          setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }
        setSuccess('Catalogue modifie avec succes.');
      } else {
        const res = await axios.post('/api/commercial/catalogue', payload, { headers: headers() });
        const created = res.data?.data;
        if (created) {
          setItems((prev) => [created, ...prev]);
        } else {
          await loadItems();
        }
        setSuccess('Element ajoute au catalogue avec succes.');
        await showSuccessAlert('Succès', 'Produit/Service ajouté avec succès');
      }
      setForm(emptyForm);
      setEditingId(null);
      setOpen(false);
      setSearch('');
    } catch (e2) {
      const apiMessage = e2.response?.data?.message ?? '';
      if (String(apiMessage).toLowerCase().includes('syntax error')) {
        setError('Erreur serveur: impossible de traiter la requete pour le moment.');
        await showErrorAlert('Erreur', 'Erreur serveur: impossible de traiter la requete pour le moment.');
      } else {
        setError(apiMessage || 'Operation impossible.');
        await showErrorAlert('Erreur', apiMessage || 'Operation impossible.');
      }
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      type: item.type ?? 'product',
      name: item.name ?? '',
      prixHT: item.prixHT ?? item.price ?? 0,
      tva: item.tva ?? 0,
      remise: item.remise ?? 0,
      description: item.description ?? '',
      is_active: Boolean(item.is_active),
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    const confirmed = await showConfirmAlert('Confirmation', 'Supprimer cet element du catalogue ?', 'Supprimer');
    if (!confirmed) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/api/commercial/catalogue/${id}`, { headers: headers() });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSuccess('Element supprime du catalogue avec succes.');
      await showSuccessAlert('Succès', 'Element supprime du catalogue avec succes.');
    } catch (e) {
      const apiMessage = e.response?.data?.message ?? '';
      if (String(apiMessage).toLowerCase().includes('syntax error')) {
        setError('Erreur serveur: suppression impossible pour le moment.');
        await showErrorAlert('Erreur', 'Erreur serveur: suppression impossible pour le moment.');
      } else {
        setError(apiMessage || 'Suppression impossible.');
        await showErrorAlert('Erreur', apiMessage || 'Suppression impossible.');
      }
    }
  };

  const filtered = useMemo(() => {
    return items.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  return (
    <>
      <Head title="Commercial - Catalogue" />
      <div className="flex min-h-screen bg-slate-100">
        <CommercialSidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catalogue Produits / Services</h1>
              <p className="text-gray-500 mt-1">{items.length} produits/services</p>
            </div>
            <button onClick={openCreateModal} className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </button>
          </div>

          <div className="mt-6 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</div>}

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden mt-6">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-gray-50 text-gray-500 font-medium">Produit / Service</th>
                    <th className="text-right p-3 bg-gray-50 text-gray-500 font-medium">Prix HT</th>
                    <th className="text-right p-3 bg-gray-50 text-gray-500 font-medium">TVA</th>
                    <th className="text-right p-3 bg-gray-50 text-gray-500 font-medium">Remise</th>
                    <th className="text-right p-3 bg-gray-50 text-gray-500 font-medium">Prix TTC</th>
                    <th className="p-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const priceHT = Number(item.prixHT ?? item.price ?? 0);
                    const tva = Number(item.tva ?? 0);
                    const remise = Number(item.remise ?? 0);
                    const discounted = priceHT * (1 - remise / 100);
                    const ttc = discounted * (1 + tva / 100);

                    return (
                      <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium text-gray-900">{item.name}</td>
                        <td className="p-3 text-right text-gray-900">{priceHT.toFixed(2)} DTN</td>
                        <td className="p-3 text-right text-gray-500">{tva}%</td>
                        <td className="p-3 text-right text-gray-500">{remise > 0 ? `${remise}%` : '—'}</td>
                        <td className="p-3 text-right font-medium text-gray-900">{ttc.toFixed(2)} DTN</td>
                        <td className="p-3">
                          <div className="flex gap-1 justify-end">
                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100" onClick={() => onEdit(item)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-red-600 hover:bg-red-50" onClick={() => onDelete(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="p-4 text-gray-500" colSpan={6}>Aucun element dans le catalogue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {open && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingId ? 'Modifier produit/service' : 'Nouveau produit/service'}
                  </h2>
                  <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                      <option value="product">Produit</option>
                      <option value="service">Service</option>
                    </select>
                    <input className="border rounded px-3 py-2" placeholder="Nom" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="border rounded px-3 py-2" type="number" step="0.01" min="0" placeholder="Prix HT (DTN)" value={form.prixHT} onChange={(e) => setForm((prev) => ({ ...prev, prixHT: e.target.value }))} required />
                    <input className="border rounded px-3 py-2" type="number" step="0.01" min="0" max="100" placeholder="TVA (%)" value={form.tva} onChange={(e) => setForm((prev) => ({ ...prev, tva: e.target.value }))} />
                    <input className="border rounded px-3 py-2" type="number" step="0.01" min="0" max="100" placeholder="Remise (%)" value={form.remise} onChange={(e) => setForm((prev) => ({ ...prev, remise: e.target.value }))} />
                  </div>
                  <textarea className="border rounded px-3 py-2 w-full" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
                    Actif
                  </label>
                  <button disabled={saving} className="w-full inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-50">
                    {saving ? 'En cours...' : editingId ? 'Enregistrer' : 'Creer'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}