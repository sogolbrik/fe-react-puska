// src/components/layout/Header.jsx
import { useState } from 'react';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';

export default function Header() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">Kelola data dengan mudah</p>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <FiBell className="text-lg" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            G
                        </div>
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <FiUser className="text-gray-500" /> Profil
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                <FiLogOut className="text-rose-500" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}