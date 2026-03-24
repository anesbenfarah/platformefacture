import { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';
import { Plus, X, Search, Edit, Trash, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '@/lib/alerts';

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

export default function SuperAdminAdministrateurs() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    telephone: '',
  });

  const getHeaders = () => ({
    Accept: 'application/json',
  });

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get('/api/admins', { headers: getHeaders() })
      .then((res) => setAdmins(res.data.data ?? []))
      .catch(() => setError('Erreur de chargement des administrateurs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const resetForm = () => ({
    name: '',
    email: '',
    password: '',
    telephone: '',
  });

  const openAddModal = () => {
    setEditAdmin(null);
    setForm(resetForm());
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditAdmin(admin);
    setForm({
      name: admin.name ?? '',
      email: admin.email ?? '',
      password: '',
      telephone: admin.telephone ?? '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmAlert('Confirmation', 'Voulez-vous vraiment supprimer cet administrateur ?', 'Supprimer');
    if (!confirmed) return;
    try {
      await axios.delete(`/api/admins/${id}`, { headers: getHeaders() });
      await showSuccessAlert('Succès', 'Administrateur supprimé avec succès');
      fetchAdmins();
    } catch {
      await showErrorAlert('Erreur', 'Erreur lors de la suppression');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editAdmin) {
        await axios.put(`/api/admins/${editAdmin.id}`, form, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Administrateur modifié avec succès');
      } else {
        await axios.post('/api/admins', form, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Administrateur créé avec succès');
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      await showErrorAlert('Erreur', err.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = admins.filter((a) =>
    `${a.name} ${a.email} ${a.telephone ?? ''} ${a.societe?.nom ?? ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, admins.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold">Erreur</h2>
          <p>{error}</p>
          <button
            onClick={fetchAdmins}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Head title="Administrateurs (Super Admin)" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Administrateurs (Super Admin)</h1>
              <p className="text-gray-500 mt-1">Gérez les administrateurs de la plateforme.</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Rechercher un administrateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                Ajouter un administrateur
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-base font-semibold">Liste des Administrateurs</h2>
                <p className="text-sm text-gray-500">{filtered.length} administrateur(s) trouvé(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Nom', 'Email', 'Téléphone', 'Société', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-400">
                          Aucun administrateur trouvé
                        </td>
                      </tr>
                    ) : (
                      paginated.map((admin) => (
                        <tr key={admin.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                          <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                          <td className="px-6 py-4 text-gray-600">{admin.telephone ?? '—'}</td>
                          <td className="px-6 py-4 text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              {admin.societe?.nom ?? '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => openEditModal(admin)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(admin.id)}
                                className="text-red-600 hover:text-red-900"
                              >
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
                <p className="text-xs text-gray-500">
                  Page {currentPage} / {totalPages}
                </p>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-gray-800">
                {editAdmin ? "Modifier l'administrateur" : 'Ajouter un administrateur'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              <form id="superadmin-admin-form" onSubmit={handleSubmit} className="space-y-4">
                <Field
                  label="Nom"
                  name="name"
                  required
                  value={form.name}
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
                  label="Mot de passe"
                  name="password"
                  type="password"
                  required={!editAdmin}
                  value={form.password}
                  onChange={handleInputChange}
                />
                <Field
                  label="Téléphone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleInputChange}
                />
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
                form="superadmin-admin-form"
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              >
                {submitting ? 'En cours...' : editAdmin ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

