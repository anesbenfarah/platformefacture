import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';

export default function Societes() {
  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSociete, setEditSociete] = useState(null);
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '', adresse: '',
    code_postal: '', ville: '', pays: '', secteur: '',
    description: '', logo: '', admin_name: '', admin_email: '',
    admin_password: '', admin_telephone: '',
  });

  const token = localStorage.getItem('token');
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };

  const fetchSocietes = () => {
    setLoading(true);
    axios.get('/api/societes', { headers })
      .then(res => setSocietes(res.data.data ?? []))
      .catch(() => setError("Erreur de chargement des sociétés"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) { setError("Non authentifié"); setLoading(false); return; }
    fetchSocietes();
  }, []);

  const openAddModal = () => {
    setEditSociete(null);
    setForm({
      nom: '', email: '', telephone: '', adresse: '',
      code_postal: '', ville: '', pays: '', secteur: '',
      description: '', logo: '', admin_name: '', admin_email: '',
      admin_password: '', admin_telephone: '',
    });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setEditSociete(s);
    setForm({
      nom: s.nom ?? '', email: s.email ?? '', telephone: s.telephone ?? '',
      adresse: s.adresse ?? '', code_postal: s.code_postal ?? '',
      ville: s.ville ?? '', pays: s.pays ?? '', secteur: s.secteur ?? '',
      description: s.description ?? '', logo: s.logo ?? '',
      admin_name: s.admin?.name ?? '', admin_email: s.admin?.email ?? '',
      admin_password: '', admin_telephone: s.admin?.telephone ?? '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Supprimer cette société ?")) return;
    axios.delete(`/api/societes/${id}`, { headers })
      .then(() => fetchSocietes())
      .catch(() => alert("Erreur lors de la suppression"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editSociete
      ? axios.put(`/api/societes/${editSociete.id}`, form, { headers })
      : axios.post('/api/societes', form, { headers });

    request
      .then(() => { setShowModal(false); fetchSocietes(); })
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <>
      <Head title="Sociétés" />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Sociétés</h1>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              + Ajouter une société
            </button>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow p-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-3">Nom</th>
                    <th className="text-left py-2 px-3">Secteur</th>
                    <th className="text-left py-2 px-3">Ville</th>
                    <th className="text-left py-2 px-3">Admin</th>
                    <th className="text-left py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {societes.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-4 text-slate-400">Aucune société trouvée</td></tr>
                  )}
                  {societes.map(s => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium">{s.nom}</td>
                      <td className="py-2 px-3">{s.secteur ?? '—'}</td>
                      <td className="py-2 px-3">{s.ville ?? '—'}</td>
                      <td className="py-2 px-3">{s.admin ? s.admin.name : '—'}</td>
                      <td className="py-2 px-3 flex gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal Ajouter / Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-4">
              {editSociete ? 'Modifier la société' : 'Ajouter une société'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">

              <p className="text-xs font-semibold text-slate-500 uppercase">Informations société</p>
              {[
                { label: 'Nom', key: 'nom' },
                { label: 'Email', key: 'email' },
                { label: 'Téléphone', key: 'telephone' },
                { label: 'Adresse', key: 'adresse' },
                { label: 'Code postal', key: 'code_postal' },
                { label: 'Ville', key: 'ville' },
                { label: 'Pays', key: 'pays' },
                { label: 'Secteur', key: 'secteur' },
              ].map(({ label, key }) => (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              ))}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={2}
              />

              {!editSociete && (
                <>
                  <p className="text-xs font-semibold text-slate-500 uppercase pt-2">Compte Admin</p>
                  {[
                    { label: 'Nom admin', key: 'admin_name' },
                    { label: 'Email admin', key: 'admin_email' },
                    { label: 'Mot de passe', key: 'admin_password' },
                    { label: 'Téléphone admin', key: 'admin_telephone' },
                  ].map(({ label, key }) => (
                    <input
                      key={key}
                      type={key === 'admin_password' ? 'password' : 'text'}
                      placeholder={label}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  ))}
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded border hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {editSociete ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}