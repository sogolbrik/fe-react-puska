import { useEffect, useState, useCallback } from 'react';
import api from '../../../services/api';
import BukuForm from '../components/BukuForm';
import { toast } from 'react-toastify';
import { FiBook, FiPlus } from 'react-icons/fi';

export default function BukuListPage() {
    const [buku, setBuku] = useState([]);
    const [form, setForm] = useState({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        stok: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchBuku = useCallback(async (mountedRef) => {
        try {
            const res = await api.get('/buku');
            if (mountedRef.current) {
                setBuku(Array.isArray(res.data.data) ? res.data.data : []);
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Gagal memuat buku:', err);
                toast.error('Gagal memuat data buku.');
            }
        }
    }, []);

    useEffect(() => {
        const mountedRef = { current: true };
        fetchBuku(mountedRef);
        return () => { mountedRef.current = false; };
    }, [fetchBuku]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await api.put(`/buku/${editingId}`, form);
                toast.success('Buku berhasil diperbarui!');
            } else {
                await api.post('/buku', form);
                toast.success('Buku berhasil ditambahkan!');
            }

            const mountedRef = { current: true };
            await fetchBuku(mountedRef);
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error('Error menyimpan buku:', err);
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Gagal menyimpan buku. Coba lagi.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (bukuData) => {
        setForm({
            judul: bukuData.judul,
            penulis: bukuData.penulis,
            penerbit: bukuData.penerbit,
            tahun_terbit: String(bukuData.tahun_terbit),
            stok: String(bukuData.stok),
        });
        setEditingId(bukuData.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus buku ini?')) return;

        try {
            await api.delete(`/buku/${id}`);
            toast.success('Buku berhasil dihapus!');
            const mountedRef = { current: true };
            fetchBuku(mountedRef);
        } catch (err) {
            console.error('Gagal menghapus buku:', err);
            const message = err.response?.data?.message || 'Gagal menghapus buku.';
            toast.error(message);
        }
    };

    const resetForm = () => {
        setForm({
            judul: '',
            penulis: '',
            penerbit: '',
            tahun_terbit: '',
            stok: '',
        });
        setEditingId(null);
    };

    return (
        <div className="mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiBook className="text-indigo-600" />
                        Manajemen Buku
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola koleksi buku perpustakaan Anda</p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <FiPlus />
                    {showForm ? 'Batal' : 'Tambah Buku'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Total Buku</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{buku.length}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Stok Tersedia</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                        {buku.reduce((sum, b) => sum + b.stok, 0)}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Buku Habis</p>
                    <p className="text-2xl font-bold text-rose-600 mt-1">
                        {buku.filter(b => b.stok === 0).length}
                    </p>
                </div>
            </div>

            {/* Form Toggle */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {editingId ? 'Edit Buku' : 'Tambah Buku Baru'}
                    </h2>
                    <BukuForm
                        form={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        isEditing={!!editingId}
                        onCancelEdit={() => {
                            resetForm();
                            setShowForm(false);
                        }}
                    />
                </div>
            )}

            {/* Daftar Buku - TABLE */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Daftar Buku</h2>
                        <span className="text-sm text-gray-500">{buku.length} item</span>
                    </div>
                </div>

                {buku.length === 0 ? (
                    <div className="text-center py-12">
                        <FiBook className="mx-auto text-5xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">Belum ada buku</h3>
                        <p className="text-gray-500 mt-1">Mulai tambahkan buku pertama Anda!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerbit</th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {buku.map((bukuItem) => (
                                    <tr key={bukuItem.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{bukuItem.judul}</div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bukuItem.penulis}</td> */}
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bukuItem.penerbit}</td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bukuItem.tahun_terbit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bukuItem.stok > 0
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                {bukuItem.stok}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(bukuItem)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                                                aria-label="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bukuItem.id)}
                                                className="text-rose-600 hover:text-rose-900 transition-colors"
                                                aria-label="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}