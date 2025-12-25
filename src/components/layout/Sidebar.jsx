// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiSettings } from 'react-icons/fi';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
    { name: 'Buku', path: '/admin/buku', icon: <FiBook /> },
    { name: 'User', path: '/admin/user', icon: <FiUsers /> },
    { name: 'Pengaturan', path: '/admin/settings', icon: <FiSettings /> },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
            {/* Logo */}
            <div className="p-5.5 border-b border-gray-200">
                <Link to="/admin" className="flex items-center gap-3">
                    <div className="bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        A
                    </div>
                    <span className="text-lg font-bold text-gray-900">AdminPanel</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
                © 2025 AdminPanel
            </div>
        </div>
    );
}