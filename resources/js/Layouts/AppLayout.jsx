import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const user = usePage().props.auth?.user || { name: 'Invité' };
    const [showNav, setShowNav] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-bold">Mon App</Link>

                    <div className="hidden sm:flex space-x-4">
                        <Link href="/dashboard">Dashboard</Link>
                        <span>{user.name}</span>
                    </div>

                    <button
                        className="sm:hidden"
                        onClick={() => setShowNav(!showNav)}
                    >
                        Menu
                    </button>
                </div>

                {showNav && (
                    <div className="sm:hidden px-2 pb-3 space-y-1">
                        <Link href="/dashboard">Dashboard</Link>
                        <span>{user.name}</span>
                    </div>
                )}
            </nav>

            <main className="p-4">{children}</main>
        </div>
    );
}