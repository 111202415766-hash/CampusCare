import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { Category } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const CategoryManagementPage: React.FC = () => {
  const { categories, reports, addCategory, updateCategory, deleteCategory } = useReports();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Filter categories
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCategory(null);
    setName('');
    setCode(`CAT-${String(Date.now()).slice(-3)}`);
    setDescription('');
    setIsActive(true);
    setFormError(null);
  };

  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setEditingCategory(cat);
    setName(cat.name);
    setCode(cat.code);
    setDescription(cat.description);
    setIsActive(cat.is_active);
    setFormError(null);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCategory(null);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }
    if (!code.trim()) {
      setFormError('Kode kategori wajib diisi.');
      return;
    }

    if (modalMode === 'create') {
      await addCategory({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim() || 'Kategori sarana kampus',
        is_active: isActive,
      });
    } else if (modalMode === 'edit' && editingCategory) {
      await updateCategory(editingCategory.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        is_active: isActive,
      });
    }

    closeModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    const res = await deleteCategory(deleteCandidate.id);
    if (!res.success) {
      setDeleteErrorMessage(res.message || 'Gagal menghapus kategori.');
      return;
    }
    setDeleteCandidate(null);
    setDeleteErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Kategori Kerusakan Fasilitas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola klasifikasi jenis kerusakan fasilitas fisik dan infrastruktur kampus UDINUS.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau kode kategori..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-xs text-slate-500">
            Total Kategori: <strong className="text-slate-800">{categories.length}</strong>
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="Kategori Tidak Ditemukan"
            description="Tidak ada kategori yang cocok dengan pencarian Anda."
            actionLabel="Reset Pencarian"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Kode</th>
                  <th scope="col" className="px-4 py-3.5">Nama Kategori & Deskripsi</th>
                  <th scope="col" className="px-4 py-3.5">Jumlah Laporan</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const reportCount = reports.filter((r) => r.category_id === cat.id).length;

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {cat.code}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{cat.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-md line-clamp-2">
                          {cat.description}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{reportCount} laporan</span>
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {cat.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteCandidate(cat);
                              setDeleteErrorMessage(null);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tambah Kategori Kerusakan Baru' : 'Edit Kategori Kerusakan'}
                </h3>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                {formError && (
                  <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Kategori <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Sound System & Audio Ruangan"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Kode Kategori <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: CAT-AUDIO"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Deskripsi Kategori
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Rincian jenis fasilitas atau masalah yang tercakup dalam kategori ini..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="cat-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cat-active" className="text-xs font-semibold text-slate-700">
                    Status Kategori Aktif (Dapat dipilih oleh mahasiswa saat melapor)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
                  >
                    {modalMode === 'create' ? 'Simpan Kategori' : 'Perbarui Kategori'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <ConfirmModal
          isOpen={!!deleteCandidate}
          title="Hapus Kategori Kerusakan"
          message={`Apakah Anda yakin ingin menghapus kategori "${deleteCandidate.name}" (${deleteCandidate.code})?`}
          confirmLabel="Hapus Kategori"
          cancelLabel="Batal"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setDeleteCandidate(null);
            setDeleteErrorMessage(null);
          }}
        >
          {deleteErrorMessage && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{deleteErrorMessage}</span>
            </div>
          )}
        </ConfirmModal>
      )}
    </div>
  );
};
