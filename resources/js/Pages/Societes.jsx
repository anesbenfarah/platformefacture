import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';
import { Plus, X, Search, Edit, Trash } from 'lucide-react';

// Composant Field défini à l'extérieur pour éviter les re-rendus inutiles
const Field = ({ label, name, type = 'text', required, value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 text-center">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {children ?? (
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

export default function Societes() {
  const [societes, setSocietes] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSociete, setEditSociete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Modal de succès
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });

  // État du formulaire avec toutes les clés nécessaires
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
    if (!confirm("Voulez-vous vraiment supprimer cette société ?")) return;
    try {
      await axios.delete(`/api/societes/${id}`, { headers: getHeaders() });
      setSuccessModal({ show: true, message: "Société supprimée avec succès" });
      fetchSocietes();
    } catch {
      alert("Erreur lors de la suppression");
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
        setSuccessModal({ show: true, message: "Société modifiée avec succès" });
      } else {
        await axios.post('/api/societes', form, { headers: getHeaders() });
        setSuccessModal({ show: true, message: "Société ajoutée avec succès" });
      }
      setShowModal(false);
      fetchSocietes();
    } catch (err) {
      alert(err.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = societes.filter(s =>
    `${s.nom} ${s.secteur ?? ''} ${s.ville ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <button onClick={fetchSocietes} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head title="Sociétés" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Sociétés</h1>
              <p className="text-gray-500 mt-1">Gérez les sociétés et associez un administrateur.</p>
            </div>

            {/* Le bandeau de succès a été supprimé */}

            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Rechercher une société..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
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
              <div className="px-6 py-4 border-b">
                <h2 className="text-base font-semibold">Liste des Sociétés</h2>
                <p className="text-sm text-gray-500">{filtered.length} société(s) trouvée(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Nom', 'Secteur', 'Ville', 'Admin', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-400">Aucune société trouvée</td>
                      </tr>
                    ) : filtered.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{s.nom}</td>
                        <td className="px-6 py-4 text-gray-600">{s.secteur ?? '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{s.ville ?? '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{s.admin?.name ?? '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">

            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-gray-800">
                {editSociete ? 'Modifier la société' : 'Ajouter une société'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              <form id="societe-form" onSubmit={handleSubmit} className="space-y-4">

                <Field
                  label="Nom"
                  name="nom"
                  required
                  value={form.nom}
                  onChange={handleInputChange}
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                />

                <Field
                  label="Téléphone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleInputChange}
                />

                <Field
                  label="Adresse"
                  name="adresse"
                  value={form.adresse}
                  onChange={handleInputChange}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Code postal"
                    name="code_postal"
                    value={form.code_postal}
                    onChange={handleInputChange}
                  />
                  <Field
                    label="Ville"
                    name="ville"
                    value={form.ville}
                    onChange={handleInputChange}
                  />
                </div>

                <Field
                  label="Pays"
                  name="pays"
                  value={form.pays}
                  onChange={handleInputChange}
                />

                <Field
                  label="Secteur"
                  name="secteur"
                  value={form.secteur}
                  onChange={handleInputChange}
                />

                <Field label="Description" name="description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                {/* Sélection de l'administrateur */}
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Administrateur responsable
                  </p>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700 text-center">
                        Choisir un administrateur <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="admin_id"
                        required
                        value={form.admin_id}
                        onChange={handleInputChange}
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
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="societe-form"
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              >
                {submitting ? 'En cours...' : editSociete ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de succès (comme sur l'image) */}
      {successModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Succès</h3>
              <p className="text-gray-600 text-center mb-6">{successModal.message}</p>
              <button
                onClick={() => setSuccessModal({ show: false, message: '' })}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}