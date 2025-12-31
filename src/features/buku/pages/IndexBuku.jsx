import { useEffect, useState, useCallback } from 'react';
import api from '../../../services/api';
import BukuForm from '../components/BukuForm';
import { toast } from 'react-toastify';
import { FiBook, FiPlus, FiEye } from 'react-icons/fi';
import { IoIosArrowRoundBack } from "react-icons/io";

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
    const [selectedBuku, setSelectedBuku] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

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

    const openDeleteConfirmation = (bukuItem) => {
        setDeleteConfirmation({ id: bukuItem.id, judul: bukuItem.judul });
    };

    const confirmDelete = async () => {
        const { id } = deleteConfirmation;
        setDeleteConfirmation(null);

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

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const handleViewDetail = (bukuData) => {
        setSelectedBuku(bukuData);
    };

    const closeModal = () => {
        setSelectedBuku(null);
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
                    {showForm ? <IoIosArrowRoundBack /> : <FiPlus />}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bukuItem.tahun_terbit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bukuItem.stok > 0
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                {bukuItem.stok}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewDetail(bukuItem)}
                                                className="text-gray-500 hover:text-indigo-600 transition-colors"
                                                aria-label="Lihat detail"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(bukuItem)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                aria-label="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirmation(bukuItem)}
                                                className="text-rose-600 hover:text-rose-900 transition-colors"
                                                aria-label="Hapus buku"
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

            {/* Modal Detail */}
            {selectedBuku && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 scale-100 animate-fade-in">
                        <div className="relative">

                            <div className="bg-indigo-600 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-800/30">
                                            <FiBook className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Detail Buku</h3>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-indigo-200 hover:text-white transition-colors"
                                        aria-label="Tutup"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Judul</label>
                                    <p className="text-gray-900 font-medium">{selectedBuku.judul}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Penulis</label>
                                    <p className="text-gray-900">{selectedBuku.penulis}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Penerbit</label>
                                    <p className="text-gray-900">{selectedBuku.penerbit}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tahun Terbit</label>
                                    <p className="text-gray-900">{selectedBuku.tahun_terbit}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stok</label>
                                    <p className="text-gray-900">{selectedBuku.stok}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6">
                                <button
                                    onClick={closeModal}
                                    className="w-full px-4 py-2.5 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                                >
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 scale-100 animate-fade-in">
                        <div className="relative">

                            <div className="bg-linear-to-r from-rose-500 to-rose-600 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-800/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.503-1.668 1.732-2.5L13.732 4.5c-.77-1.148-2.397-1.148-3.168 0L3.434 16.5c-.771.832.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Hapus Buku?</h3>
                                </div>
                            </div>

                            <div className="px-6 py-6">
                                <p className="text-gray-700 leading-relaxed">
                                    Anda akan menghapus buku{' '}
                                    <span className="font-semibold text-rose-700">"{deleteConfirmation.judul}"</span>.
                                    Tindakan ini <span className="font-medium text-rose-600">tidak dapat dibatalkan</span>.
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Pastikan stok dan peminjaman sudah ditangani.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 font-medium text-white bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-md hover:shadow transition-all duration-200"
                                >
                                    Hapus Selamanya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}