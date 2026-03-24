import { Head, Link } from '@inertiajs/react';

export default function Unauthorized() {
    return (
        <>
            <Head title="Acces non autorise" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Acces non autorise</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Vous n'avez pas la permission d'acceder a cette page.
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700"
                    >
                        Retour a la connexion
                    </Link>
                </div>
            </div>
        </>
    );
}
