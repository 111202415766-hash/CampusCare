import React, { useState } from 'react';
import {
  MapPin,
  Building,
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
import { Location } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const LocationManagementPage: React.FC = () => {
  const { locations, reports, addLocation, updateLocation, deleteLocation } = useReports();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Form fields
  const [buildingName, setBuildingName] = useState('');
  const [code, setCode] = useState('');
  const [floor, setFloor] = useState('Lantai 1');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<Location | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Filter locations
  const filteredLocations = locations.filter(
    (l) =>
      l.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setModalMode('create');
    setEditingLocation(null);
    setBuildingName('');
    setCode(`BLD-${String(Date.now()).slice(-3)}`);
    setFloor('Lantai 1');
    setDescription('');
    setIsActive(true);
    setFormError(null);
  };

  const openEditModal = (loc: Location) => {
    setModalMode('edit');
    setEditingLocation(loc);
    setBuildingName(loc.building_name);
    setCode(loc.code);
    setFloor(loc.floor);
    setDescription(loc.description);
    setIsActive(loc.is_active);
    setFormError(null);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingLocation(null);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildingName.trim()) {
      setFormError('Nama gedung wajib diisi.');
      return;
    }
    if (!code.trim()) {
      setFormError('Kode lokasi gedung wajib diisi.');
      return;
    }

    if (modalMode === 'create') {
      await addLocation({
        building_name: buildingName.trim(),
        code: code.trim().toUpperCase(),
        floor: floor.trim(),
        description: description.trim() || 'Fasilitas gedung kampus UDINUS',
        is_active: isActive,
      });
    } else if (modalMode === 'edit' && editingLocation) {
      await updateLocation(editingLocation.id, {
        building_name: buildingName.trim(),
        code: code.trim().toUpperCase(),
        floor: floor.trim(),
        description: description.trim(),
        is_active: isActive,
      });
    }

    closeModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    const res = await deleteLocation(deleteCandidate.id);
    if (!res.success) {
      setDeleteErrorMessage(res.message || 'Gagal menghapus lokasi gedung.');
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
            Manajemen Lokasi Gedung & Fasilitas Kampus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar master gedung, lantai, dan zonasi ruangan di lingkungan Universitas Dian Nuswantoro.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lokasi Baru</span>
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
              placeholder="Cari gedung, kode, atau lantai..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-xs text-slate-500">
            Total Lokasi Gedung: <strong className="text-slate-800">{locations.length}</strong>
          </p>
        </div>

        {filteredLocations.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Lokasi Tidak Ditemukan"
            description="Tidak ada data lokasi yang sesuai dengan kata kunci pencarian Anda."
            actionLabel="Reset Pencarian"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Kode</th>
                  <th scope="col" className="px-4 py-3.5">Nama Gedung & Lantai</th>
                  <th scope="col" className="px-4 py-3.5">Deskripsi Peruntukan</th>
                  <th scope="col" className="px-4 py-3.5">Jumlah Laporan</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLocations.map((loc) => {
                  const reportCount = reports.filter((r) => r.location_id === loc.id).length;

                  return (
                    <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {loc.code}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{loc.building_name}</span>
                        </div>
                        <div className="text-xs text-blue-700 font-semibold mt-0.5">
                          {loc.floor}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-xs text-slate-600 max-w-sm line-clamp-2">
                          {loc.description}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{reportCount} laporan</span>
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {loc.is_active ? (
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
                            onClick={() => openEditModal(loc)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Lokasi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteCandidate(loc);
                              setDeleteErrorMessage(null);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Lokasi"
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
                  {modalMode === 'create' ? 'Tambah Lokasi Gedung Baru' : 'Edit Lokasi Gedung'}
                </h3>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
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
                    Nama Gedung <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="Contoh: Gedung D (Kampus Utama)"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Kode Lokasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: BLD-D-L2"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Lantai <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Lantai Dasar">Lantai Dasar</option>
                      <option value="Lantai 1">Lantai 1</option>
                      <option value="Lantai 2">Lantai 2</option>
                      <option value="Lantai 3">Lantai 3</option>
                      <option value="Lantai 4">Lantai 4</option>
                      <option value="Lantai 5">Lantai 5</option>
                      <option value="Lantai 6">Lantai 6</option>
                      <option value="Rooftop / Area Luar">Rooftop / Area Luar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Deskripsi Peruntukan Ruangan
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Laboratorium Jaringan Komputer & Ruang Dosen FIK..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="loc-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="loc-active" className="text-xs font-semibold text-slate-700">
                    Lokasi Aktif (Dapat dipilih mahasiswa saat mengajukan laporan)
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
                    {modalMode === 'create' ? 'Simpan Lokasi' : 'Perbarui Lokasi'}
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
          title="Hapus Lokasi Gedung"
          message={`Apakah Anda yakin ingin menghapus data lokasi "${deleteCandidate.building_name} (${deleteCandidate.floor})"?`}
          confirmLabel="Hapus Lokasi"
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
