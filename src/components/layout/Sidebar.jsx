import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiSettings, FiChevronDown, FiChevronRight, FiTag } from 'react-icons/fi';

// Struktur navigasi dengan grup
const navGroups = [
    {
        label: 'MENU',
        items: [
            { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
        ],
    },
    {
        label: 'MASTER DATA',
        isDropdown: true,
        items: [
            { name: 'Buku', path: '/admin/buku', icon: <FiBook /> },
            { name: 'Kategori', path: '/admin/kategori', icon: <FiTag /> },
        ],
    },
    // {
    //     label: 'LAINNYA',
    //     items: [], // hanya label
    // },
    {
        label: 'MANAJEMEN',
        items: [
            { name: 'User', path: '/admin/user', icon: <FiUsers /> },
            { name: 'Pengaturan', path: '/admin/settings', icon: <FiSettings /> },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();
    const [openDropdowns, setOpenDropdowns] = useState({
        'MASTER DATA': false,
    });

    const toggleDropdown = (label) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-gray-200">
                <Link to="/admin" className="flex items-center gap-3">
                    <div className="bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        <FiHome />
                    </div>
                    <span className="text-lg font-bold text-gray-900">AdminPanel</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        {/* Label Grup */}
                        <div className="px-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {group.label}
                            </span>
                        </div>

                        {/* Dropdown atau Item Langsung */}
                        {group.isDropdown ? (
                            <div className="mt-2">
                                <button
                                    onClick={() => toggleDropdown(group.label)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 font-medium"
                                >
                                    <span>Master Data</span>
                                    {openDropdowns[group.label] ? (
                                        <FiChevronDown className="text-gray-500" />
                                    ) : (
                                        <FiChevronRight className="text-gray-500" />
                                    )}
                                </button>

                                {/* Dropdown Items */}
                                {openDropdowns[group.label] && (
                                    <div className="mt-1 ml-3 space-y-1">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span className="text-base">{item.icon}</span>
                                                <span>{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : group.items.length > 0 ? (
                            /* Item biasa (non-dropdown) */
                            <div className="mt-2 space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 text-xs text-gray-500 border-t border-gray-200">
                © 2025 AdminPanel
            </div>
        </div>
    );
}