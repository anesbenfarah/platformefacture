import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';
import { Plus, Search, Edit, Trash, Building2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '@/lib/alerts';

export default function SuperAdminSocietes() {
  const [societes, setSocietes] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSociete, setEditSociete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    code_postal: '',
    ville: '',
    pays: '',
    secteur: '',
    description: '',
    logo: '',
    admin_id: '',
  });

  const getHeaders = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchSocietes = useCallback(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/societes', { headers: getHeaders() })
      .then(res => setSocietes(res.data.data ?? []))
      .catch(() => setError("Erreur de chargement des sociétés"))
      .finally(() => setLoading(false));
  }, []);

  const fetchAdmins = useCallback(() => {
    axios.get('/api/admins', { headers: getHeaders() })
      .then(res => setAdminsList(res.data.data ?? []))
      .catch(err => console.error("Erreur chargement admins", err));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError("Non authentifié");
      setLoading(false);
      return;
    }
    fetchSocietes();
    fetchAdmins();
  }, [fetchSocietes, fetchAdmins]);

  const resetForm = () => ({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    code_postal: '',
    ville: '',
    pays: '',
    secteur: '',
    description: '',
    logo: '',
    admin_id: '',
  });

  const openAddModal = () => {
    setEditSociete(null);
    setForm(resetForm());
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setEditSociete(s);
    setForm({
      nom: s.nom ?? '',
      email: s.email ?? '',
      telephone: s.telephone ?? '',
      adresse: s.adresse ?? '',
      code_postal: s.code_postal ?? '',
      ville: s.ville ?? '',
      pays: s.pays ?? '',
      secteur: s.secteur ?? '',
      description: s.description ?? '',
      logo: s.logo ?? '',
      admin_id: s.admin?.id ?? '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmAlert('Confirmation', 'Voulez-vous vraiment supprimer cette société ?', 'Supprimer');
    if (!confirmed) return;
    try {
      await axios.delete(`/api/societes/${id}`, { headers: getHeaders() });
      await showSuccessAlert('Succès', 'Société supprimée avec succès');
      fetchSocietes();
    } catch {
      await showErrorAlert('Erreur', 'Erreur lors de la suppression');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editSociete) {
        await axios.put(`/api/societes/${editSociete.id}`, form, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Société modifiée avec succès');
      } else {
        await axios.post('/api/societes', form, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Société ajoutée avec succès');
      }
      setShowModal(false);
      fetchSocietes();
    } catch (err) {
      await showErrorAlert('Erreur', err.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = societes.filter(s =>
    `${s.nom} ${s.secteur ?? ''} ${s.ville ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, societes.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500 text-center">
        <h2 className="text-2xl font-bold">Erreur</h2>
        <p>{error}</p>
        <button
          onClick={fetchSocietes}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head title="Sociétés (Super Admin)" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            {/* En-tête */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sociétés</h1>
              <p className="text-gray-500 mt-1">
                {filtered.length} société(s) enregistrée(s)
              </p>
            </div>

            {/* Barre de recherche et bouton d'ajout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Ajouter une société
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Societe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400">
                          Aucune societe trouvee
                        </td>
                      </tr>
                    ) : (
                      paginated.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-semibold text-gray-900">{s.nom}</p>
                                <p className="text-xs text-gray-500">{s.secteur || '-'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="inline-flex items-center gap-1 text-gray-600">
                              <Mail className="h-4 w-4 text-slate-400" />
                              {s.email}
                            </p>
                            <p className="inline-flex items-center gap-1 text-gray-500 text-xs mt-1">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {s.telephone || '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {[s.ville, s.pays].filter(Boolean).join(', ') || '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{s.admin?.name ?? '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-800" title="Modifier">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800" title="Supprimer">
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t bg-gray-50">
                <p className="text-xs text-gray-500">Page {currentPage} / {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border bg-white disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Precedent
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border bg-white disabled:opacity-50"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout / modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {editSociete ? 'Modifier la société' : 'Ajouter une société'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nom */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Adresse */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={form.adresse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Code postal et Ville */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Code postal</label>
                  <input
                    type="text"
                    name="code_postal"
                    value={form.code_postal}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    name="ville"
                    value={form.ville}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Pays */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Pays</label>
                <input
                  type="text"
                  name="pays"
                  value={form.pays}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Secteur */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Secteur</label>
                <input
                  type="text"
                  name="secteur"
                  value={form.secteur}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Administrateur responsable */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Administrateur responsable <span className="text-red-500">*</span>
                </label>
                <select
                  name="admin_id"
                  value={form.admin_id}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un admin</option>
                  {adminsList.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {submitting ? 'En cours...' : (editSociete ? 'Enregistrer' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}