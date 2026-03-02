import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminParametresSociete() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
        legal_info: '',
        cgv: '',
    });

    const headers = () => ({
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.visit('/');
            return;
        }

        axios
            .get('/api/admin/societe/settings', { headers: headers() })
            .then((res) => {
                const s = res.data.data ?? {};
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
                    legal_info: s.legal_info ?? '',
                    cgv: s.cgv ?? '',
                });
            })
            .catch((e) => setError(e.response?.data?.message ?? "Erreur de chargement des paramètres."))
            .finally(() => setLoading(false));
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await axios.put('/api/admin/societe/settings', form, { headers: headers() });
            setSuccess('Paramètres enregistrés.');
        } catch (e) {
            setError(e.response?.data?.message ?? "Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Head title="Admin - Paramètres société" />
            <div className="flex min-h-screen bg-slate-100">
                <AdminSidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Paramètres de la société</h1>
                            <p className="text-gray-500 mt-1">
                                Mettez à jour le logo, les informations légales et les CGV.
                            </p>
                        </div>

                        {loading && <p>Chargement...</p>}
                        {error && (
                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {!loading && (
                            <div className="bg-white rounded-lg shadow p-5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                                        <input
                                            name="nom"
                                            value={form.nom}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                        <input
                                            name="telephone"
                                            value={form.telephone}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Logo (URL/chemin)</label>
                                        <input
                                            name="logo"
                                            value={form.logo}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                    <input
                                        name="adresse"
                                        value={form.adresse}
                                        onChange={onChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Code postal</label>
                                        <input
                                            name="code_postal"
                                            value={form.code_postal}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                                        <input
                                            name="ville"
                                            value={form.ville}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pays</label>
                                        <input
                                            name="pays"
                                            value={form.pays}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Secteur</label>
                                        <input
                                            name="secteur"
                                            value={form.secteur}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <input
                                            name="description"
                                            value={form.description}
                                            onChange={onChange}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Informations légales</label>
                                    <textarea
                                        name="legal_info"
                                        value={form.legal_info}
                                        onChange={onChange}
                                        rows={4}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CGV</label>
                                    <textarea
                                        name="cgv"
                                        value={form.cgv}
                                        onChange={onChange}
                                        rows={8}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onSave}
                                        disabled={saving}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

