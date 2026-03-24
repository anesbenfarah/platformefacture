import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectByRole = (role) => {
        if (role === 'super_admin') return '/super-admin';
        if (role === 'admin') return '/admin';
        if (role === 'commercial') return '/commercial';
        if (role === 'client') return '/client';
        return '/unauthorized';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/login', {
                email,
                password,
            });

            const user = response?.data?.user;
            const token = response?.data?.token;

            if (!user || !token) {
                throw new Error('Réponse invalide');
            }

            login(user, token);
            navigate(redirectByRole(user.role), { replace: true });
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    'Email ou mot de passe incorrect.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
                <h1 className="text-center text-2xl font-bold text-gray-900">Connexion</h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Connectez-vous à votre compte
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error ? (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-500">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
}
