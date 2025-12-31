import { useEffect, useState, useCallback } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FiTag, FiPlus, FiEye } from 'react-icons/fi';
import { IoIosArrowRoundBack } from "react-icons/io";
import KategoriForm from '../components/KategoriForm';

export default function KategoriListPage() {
    const [kategori, setKategori] = useState([]);
    const [form, setForm] = useState({ nama: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const fetchKategori = useCallback(async (mountedRef) => {
        try {
            const res = await api.get('/kategori');
            if (mountedRef.current) {
                setKategori(Array.isArray(res.data.data) ? res.data.data : []);
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Gagal memuat kategori:', err);
                toast.error('Gagal memuat data kategori.');
            }
        }
    }, []);

    useEffect(() => {
        const mountedRef = { current: true };
        fetchKategori(mountedRef);
        return () => { mountedRef.current = false; };
    }, [fetchKategori]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await api.put(`/kategori/${editingId}`, form);
                toast.success('Kategori berhasil diperbarui!');
            } else {
                await api.post('/kategori', form);
                toast.success('Kategori berhasil ditambahkan!');
            }

            const mountedRef = { current: true };
            await fetchKategori(mountedRef);
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error('Error menyimpan kategori:', err);
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Gagal menyimpan kategori. Coba lagi.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (kategoriData) => {
        setForm({ nama: kategoriData.nama });
        setEditingId(kategoriData.id);
        setShowForm(true);
    };

    const openDeleteConfirmation = (kategoriItem) => {
        setDeleteConfirmation({ id: kategoriItem.id, nama: kategoriItem.nama });
    };

    const confirmDelete = async () => {
        const id = deleteConfirmation.id;
        setDeleteConfirmation(null);

        try {
            await api.delete(`/kategori/${id}`);
            toast.success('Kategori berhasil dihapus!');
            const mountedRef = { current: true };
            fetchKategori(mountedRef);
        } catch (err) {
            console.error('Gagal menghapus kategori:', err);
            const message = err.response?.data?.message || 'Gagal menghapus kategori.';
            toast.error(message);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const handleViewDetail = (kategoriData) => {
        setSelectedKategori(kategoriData);
    };

    const closeModal = () => {
        setSelectedKategori(null);
    };

    const resetForm = () => {
        setForm({ nama: '' });
        setEditingId(null);
    };

    return (
        <div className="mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiTag className="text-indigo-600" />
                        Manajemen Kategori
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola kategori buku perpustakaan Anda</p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {showForm ? <IoIosArrowRoundBack /> : <FiPlus />}
                    {showForm ? 'Batal' : 'Tambah Kategori'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Total Kategori</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kategori.length}</p>
                </div>
                {/* Bisa tambahkan stats lain jika perlu */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Kategori Aktif</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{kategori.length}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-500 text-sm">Digunakan di Buku</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">0</p> {/* Bisa diisi dari API */}
                </div>
            </div>

            {/* Form Toggle */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h2>
                    <KategoriForm
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

            {/* Daftar Kategori - TABLE */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
                        <span className="text-sm text-gray-500">{kategori.length} item</span>
                    </div>
                </div>

                {kategori.length === 0 ? (
                    <div className="text-center py-12">
                        <FiTag className="mx-auto text-5xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">Belum ada kategori</h3>
                        <p className="text-gray-500 mt-1">Mulai tambahkan kategori pertama Anda!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kategori.map((kategoriItem) => (
                                    <tr key={kategoriItem.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{kategoriItem.nama}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                            {/* 🔍 Detail */}
                                            <button
                                                onClick={() => handleViewDetail(kategoriItem)}
                                                className="text-gray-500 hover:text-indigo-600 transition-colors"
                                                aria-label="Lihat detail"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                            {/* Edit */}
                                            <button
                                                onClick={() => handleEdit(kategoriItem)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                aria-label="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => openDeleteConfirmation(kategoriItem)}
                                                className="text-rose-600 hover:text-rose-900 transition-colors"
                                                aria-label="Hapus kategori"
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
            {selectedKategori && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 scale-100 animate-fade-in">
                        <div className="relative">

                            <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700/30">
                                            <FiTag className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Detail Kategori</h3>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-indigo-100 hover:text-white transition-colors"
                                        aria-label="Tutup"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Nama Kategori
                                        </label>
                                        <div className="text-lg font-medium text-gray-900">{selectedKategori.nama}</div>
                                    </div>

                                    {/* Bisa tambahkan info lain di sini nanti, misal: jumlah buku */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-6" />
                                            </svg>
                                            ID: <code className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{selectedKategori.id}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6">
                                <button
                                    onClick={closeModal}
                                    className="w-full px-4 py-2.5 font-medium text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-700/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.503-1.668 1.732-2.5L13.732 4.5c-.77-1.148-2.397-1.148-3.168 0L3.434 16.5c-.771.832.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Hapus Kategori?</h3>
                                </div>
                            </div>

                            <div className="px-6 py-6">
                                <p className="text-gray-700 leading-relaxed">
                                    Anda akan menghapus kategori{' '}
                                    <span className="font-semibold text-rose-700">"{deleteConfirmation.nama}"</span>.
                                    Tindakan ini <span className="font-medium text-rose-600">tidak dapat dibatalkan</span>.
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Pastikan tidak ada data penting yang bergantung pada kategori ini.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 font-medium text-white bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
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