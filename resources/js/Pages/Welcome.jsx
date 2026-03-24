import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Welcome() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setIsSubmitting(true);
        router.post(
            '/login',
            { email, password },
            {
                onError: () => setError('Email ou mot de passe incorrect.'),
                onFinish: () => setIsSubmitting(false),
            }
        );
    }

    return (
        <>
            <Head title="Connexion" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
                    <h1 className="text-center text-2xl font-bold text-gray-900">Connexion</h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
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
                        <a href="/signup" className="text-indigo-600 font-medium hover:text-indigo-500">
                            S'inscrire
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}