// src/pages/DashboardPage.jsx
import { FiBook, FiUsers, FiAlertTriangle } from 'react-icons/fi';

export default function DashboardPage() {
    const statCards = [
        {
            title: 'Total Buku',
            value: '124',
            icon: <FiBook className="text-xl" />,
            color: 'indigo'
        },
        {
            title: 'User Aktif',
            value: '38',
            icon: <FiUsers className="text-xl" />,
            color: 'emerald'
        },
        {
            title: 'Stok Habis',
            value: '5',
            icon: <FiAlertTriangle className="text-xl" />,
            color: 'rose'
        },
    ];

    const activities = [
        { action: 'Buku "React Mastery" ditambahkan', time: '2 jam lalu' },
        { action: 'Pengguna baru mendaftar', time: '5 jam lalu' },
        { action: 'Stok "Laravel Pro" diperbarui', time: '1 hari lalu' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Selamat Datang, Admin!</h1>
                <p className="text-gray-600 mt-1">Ringkasan aktivitas dan statistik sistem hari ini</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-${card.color}-100 text-${card.color}-700`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {activities.map((item, i) => (
                        <li key={i} className="px-6 py-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-2 h-2 rounded-full bg-gray-400"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 text-sm">{item.action}</p>
                                    <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}