import { useState } from 'react';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';

export default function Welcome() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                '/api/auth/login',
                { email, password },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            const { user, token, message: apiMessage } = response.data;

            // Sauvegarder les données de connexion
            if (token) {
                localStorage.setItem('token', token);
            }
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            setMessage(apiMessage ?? 'Connexion réussie ! Redirection...');

            // Redirection après 500ms
            setTimeout(() => {
                router.visit('/dashboard');
            }, 500);

        } catch (err) {
            console.error('Erreur de connexion:', err);
            
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 422) {
                    const errorMsg = err.response.data?.message || 'Email ou mot de passe incorrect.';
                    setError(errorMsg);
                } else {
                    setError("Une erreur s'est produite. Réessayez.");
                }
            } else {
                setError("Impossible de se connecter au serveur.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Head title="Connexion" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Connectez-vous à votre compte
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={isSubmitting}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                disabled={isSubmitting}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
                                ❌ {error}
                            </div>
                        )}

                        {message && (
                            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                                ✅ {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <a href="/register" className="text-indigo-600 font-medium hover:text-indigo-500">
                            S'inscrire
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}