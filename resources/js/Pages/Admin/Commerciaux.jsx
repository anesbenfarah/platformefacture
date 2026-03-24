import { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminSidebar from '@/Components/AdminSidebar';
import { Plus, X, Search, Edit, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '@/lib/alerts';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

const Field = ({ label, name, type = 'text', required, value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
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

  // ✅ FIX: fetchCommerciaux avec useCallback (était déjà correct)
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
    fetchCommerciaux();
  }, [fetchCommerciaux]);

  const resetForm = () => ({
    name: '',
    email: '',
    password: '',
    telephone: '',
  });

  // ✅ FIX: openAddModal — simple, pas besoin de useCallback ici
  const openAddModal = () => {
    setEditCommercial(null);
    setForm(resetForm());
    setShowModal(true);
  };

  // ✅ FIX: openEditModal wrappé avec useCallback pour être stable
  const openEditModal = useCallback((c) => {
    setEditCommercial(c);
    setForm({
      name: c.name ?? '',
      email: c.email ?? '',
      password: '',
      telephone: c.telephone ?? '',
    });
    setShowModal(true);
  }, []); // les setters useState sont stables, aucune dep nécessaire

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIX: handleDisable wrappé avec useCallback + fetchCommerciaux dans les deps
  const handleDisable = useCallback(async (id) => {
    const confirmed = await showConfirmAlert('Confirmation', 'Désactiver ce compte commercial ?', 'Désactiver');
    if (!confirmed) return;
    try {
      await axios.patch(`/api/admin/commerciaux/${id}/disable`, {}, { headers: getHeaders() });
      await showSuccessAlert('Succès', 'Compte commercial désactivé.');
      fetchCommerciaux();
    } catch (e) {
      await showErrorAlert('Erreur', e.response?.data?.message ?? 'Erreur lors de la désactivation');
    }
  }, [fetchCommerciaux]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editCommercial) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await axios.put(`/api/admin/commerciaux/${editCommercial.id}`, payload, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Commercial mis à jour avec succès.');
      } else {
        await axios.post('/api/admin/commerciaux', form, { headers: getHeaders() });
        await showSuccessAlert('Succès', 'Commercial créé avec succès.');
      }
      setShowModal(false);
      fetchCommerciaux();
    } catch (err) {
      await showErrorAlert('Erreur', err.response?.data?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(
    () =>
      commerciaux.filter((c) =>
        `${c.name} ${c.email} ${c.telephone ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [commerciaux, searchQuery],
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, commerciaux.length]);

  // ✅ FIX: openEditModal et handleDisable ajoutés dans les deps du useMemo
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
    [openEditModal, handleDisable], // ✅ dépendances correctes
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalPages = Math.max(1, Math.ceil(table.getRowModel().rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = table
    .getRowModel()
    .rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              {/* ✅ FIX: onClick simple sur openAddModal */}
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Ajouter un commercial
              </button>
            </div>

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
                      paginatedRows.map((row) => (
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
        </main>
      </div>

      {/* ✅ Modal ajout/édition — rendu conditionnel correct */}
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

    </>
  );
}