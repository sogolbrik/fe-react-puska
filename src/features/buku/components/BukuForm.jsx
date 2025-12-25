import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { FiBook, FiUser, FiPackage, FiCalendar, FiArchive } from 'react-icons/fi';

export default function BukuForm({
    form,
    onChange,
    onSubmit,
    loading,
    isEditing,
    onCancelEdit,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {/* Judul */}
                <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiBook className="text-indigo-600" />
                        Judul Buku
                    </label>
                    <Input
                        name="judul"
                        value={form.judul}
                        onChange={onChange}
                        placeholder="Contoh: Atomic Habits"
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Penulis */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiUser className="text-indigo-600" />
                        Penulis
                    </label>
                    <Input
                        name="penulis"
                        value={form.penulis}
                        onChange={onChange}
                        placeholder="James Clear"
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Penerbit */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiPackage className="text-indigo-600" />
                        Penerbit
                    </label>
                    <Input
                        name="penerbit"
                        value={form.penerbit}
                        onChange={onChange}
                        placeholder="Gramedia"
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Tahun Terbit */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiCalendar className="text-indigo-600" />
                        Tahun Terbit
                    </label>
                    <Input
                        name="tahun_terbit"
                        type="number"
                        min="1000"
                        max={new Date().getFullYear()}
                        value={form.tahun_terbit}
                        onChange={onChange}
                        placeholder="2018"
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Stok */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiArchive className="text-indigo-600" />
                        Stok
                    </label>
                    <Input
                        name="stok"
                        type="number"
                        min="0"
                        value={form.stok}
                        onChange={onChange}
                        placeholder="25"
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
                {isEditing && (
                    <Button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors border border-transparent"
                    >
                        Batal
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Memproses...
                        </span>
                    ) : isEditing ? (
                        'Perbarui Buku'
                    ) : (
                        'Simpan Buku'
                    )}
                </Button>
            </div>
        </form>
    );
}