import { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminSidebar from '@/Components/AdminSidebar';
import { Plus, X, Search, Edit, UserX } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

// Composant Field (inchangé)
const Field = ({ label, name, type = 'text', required, value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 text-center">
      {label}
      {required && <span className="text-red-500">*</span>}
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

export default function AdminCommerciaux() {
  const [commerciaux, setCommerciaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCommercial, setEditCommercial] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    telephone: '',
  });

  // Headers pour axios (inchangé)
  const getHeaders = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  // Chargement des données (inchangé)
  const fetchCommerciaux = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get('/api/admin/commerciaux', { headers: getHeaders() })
      .then((res) => setCommerciaux(res.data.data ?? []))
      .catch((e) => setError(e.response?.data?.message ?? 'Erreur de chargement des commerciaux'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.visit('/');
      return;
    }
    fetchCommerciaux();
  }, [fetchCommerciaux]);

  // Gestion du formulaire (inchangé)
  const resetForm = () => ({
    name: '',
    email: '',
    password: '',
    telephone: '',
  });

  const openAddModal = () => {
    setEditCommercial(null);
    setForm(resetForm());
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditCommercial(c);
    setForm({
      name: c.name ?? '',
      email: c.email ?? '',
      password: '',
      telephone: c.telephone ?? '',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDisable = async (id) => {
    if (!confirm('Désactiver ce compte commercial ?')) return;
    try {
      await axios.patch(`/api/admin/commerciaux/${id}/disable`, {}, { headers: getHeaders() });
      setSuccessModal({ show: true, message: 'Compte commercial désactivé.' });
      fetchCommerciaux();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la désactivation');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editCommercial) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await axios.put(`/api/admin/commerciaux/${editCommercial.id}`, payload, { headers: getHeaders() });
        setSuccessModal({ show: true, message: 'Commercial mis à jour avec succès.' });
      } else {
        await axios.post('/api/admin/commerciaux', form, { headers: getHeaders() });
        setSuccessModal({ show: true, message: 'Commercial créé avec succès.' });
      }
      setShowModal(false);
      fetchCommerciaux();
    } catch (err) {
      alert(err.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrage local (inchangé, mais peut être remplacé par le filtrage de TanStack si souhaité)
  const filtered = commerciaux.filter((c) =>
    `${c.name} ${c.email} ${c.telephone ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ----- Définition des colonnes pour TanStack Table -----
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nom',
        cell: ({ getValue }) => <span className="font-medium text-gray-900">{getValue()}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        accessorKey: 'telephone',
        header: 'Téléphone',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue() || '—'}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-3">
            <button
              onClick={() => openEditModal(row.original)}
              className="text-blue-600 hover:text-blue-900"
              title="Modifier"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDisable(row.original.id)}
              className="text-red-600 hover:text-red-900"
              title="Désactiver"
            >
              <UserX className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    [], // les dépendances sont stables (openEditModal et handleDisable sont stables grâce à useCallback ? mais ici elles sont définies dans le composant, donc si on les met dans les dépendances, cela recréerait les colonnes à chaque render. On peut les laisser vides car les fonctions sont stables si on les wrappe avec useCallback, mais ce n'est pas indispensable car les colonnes sont recréées à chaque render de toute façon. Pour optimiser, on pourrait utiliser useCallback sur openEditModal et handleDisable, mais ce n'est pas critique.)
  );

  // Instance de la table
  const table = useReactTable({
    data: filtered, // on utilise les données déjà filtrées
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // active le tri
    getFilteredRowModel: getFilteredRowModel(),
    // Optionnel : tri initial
    // initialState: { sorting: [{ id: 'name', desc: false }] },
  });

  // États de chargement/erreur (inchangés)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold">Erreur</h2>
          <p>{error}</p>
          <button
            onClick={fetchCommerciaux}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Admin - Commerciaux" />
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Commerciaux</h1>
              <p className="text-gray-500 mt-1">
                Créez, modifiez et désactivez les comptes commerciaux de votre société.
              </p>
            </div>

            {/* Barre de recherche et bouton d'ajout */}
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Rechercher un commercial..."
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
                Ajouter un commercial
              </button>
            </div>

            {/* Tableau avec TanStack Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-base font-semibold">Liste des commerciaux</h2>
                <p className="text-sm text-gray-500">{filtered.length} commercial(aux)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center gap-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() && (
                                <span>{header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽'}</span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                          Aucun commercial
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modale d'ajout/édition (inchangée) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-gray-800">
                {editCommercial ? 'Modifier le commercial' : 'Ajouter un commercial'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              <form id="commercial-form" onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nom" name="name" required value={form.name} onChange={handleInputChange} />
                <Field label="Email" name="email" type="email" required value={form.email} onChange={handleInputChange} />
                <Field
                  label="Mot de passe"
                  name="password"
                  type="password"
                  required={!editCommercial}
                  value={form.password}
                  onChange={handleInputChange}
                />
                <Field label="Téléphone" name="telephone" value={form.telephone} onChange={handleInputChange} />
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
                form="commercial-form"
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              >
                {submitting ? 'En cours...' : editCommercial ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de succès (inchangée) */}
      {successModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
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