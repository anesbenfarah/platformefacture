import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '@/Components/Sidebar';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
            router.visit('/');
            return;
        }

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setLoading(false);
                return;
            } catch (e) {
                console.error('Erreur parsing user:', e);
            }
        }

        try {
            const response = await axios.get('/api/auth/user', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error('Erreur auth:', err);
            setError("Session expirée. Veuillez vous reconnecter.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTimeout(() => {
                router.visit('/');
            }, 2000);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        const token = localStorage.getItem('token');
        try {
            if (token) {
                await axios.post(
                    '/api/auth/logout',
                    {},
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            }
        } catch (e) {
            console.error('Erreur logout:', e);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.visit('/');
        }
    }

    if (loading) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex items-center justify-center min-h-screen">
                    Chargement...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head title="Erreur" />
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <span>⚠️</span>
                    <h2>Erreur d'authentification</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => router.visit('/')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </>
        );
    }

    const isSuperAdmin = true;

    return (
        <>
            <Head title="Dashboard" />

            {/* Layout avec sidebar (sans navbar, logout dans la sidebar) */}
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar onLogout={handleLogout} />
                <main className="flex-1 p-6" />
            </div>
        </>
    );
}