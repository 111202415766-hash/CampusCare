import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';

export const AdminProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { getStats, categories, locations } = useReports();
  const stats = getStats();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Profil Administrator Sarpras
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Informasi akun petugas Biro Sarana dan Prasarana Universitas Dian Nuswantoro.
        </p>
      </div>

      {isSaved && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Informasi kontak operasional berhasil diperbarui!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left ID Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-xs flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-100 ring-4 ring-blue-50 mx-auto">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-2xl text-blue-600">
                  {currentUser?.full_name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {currentUser?.full_name}
          </h3>
          <p className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
            NIP: {currentUser?.nim_nip}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Otoritas Sarpras</span>
          </span>

          <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-2 text-left text-xs">
            <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
              <span className="text-slate-400">Total Pengaduan:</span>
              <span className="font-bold text-slate-900">{stats.total}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
              <span className="text-slate-400">Gedung Kampus:</span>
              <span className="font-bold text-slate-900">{locations.length} Lokasi</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span className="text-slate-400">Kategori Sarana:</span>
              <span className="font-bold text-slate-900">{categories.length} Kategori</span>
            </div>
          </div>
        </div>

        {/* Right Details Form */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 mb-5">
            Data Pegawai & Otoritas Sistem
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Petugas
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.full_name || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Induk Pegawai (NIP)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.nim_nip || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Unit Kerja / Biro
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.faculty_unit || 'Biro Sarana dan Prasarana (Sarpras UDINUS)'}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Email Kedinasan
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kontak Telepon Kantor / Hotline
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="024-3517261 ext 104"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Hak Akses Petugas Sarpras:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                <li>Melihat seluruh laporan fasilitas dari mahasiswa semua fakultas.</li>
                <li>Mengubah status laporan (Menunggu ➔ Diproses ➔ Selesai) dengan catatan teknisi.</li>
                <li>Menambah, menyunting, dan menonaktifkan master data kategori kerusakan.</li>
                <li>Mengelola master zonasi gedung, nomor lantai, dan ruang kelas kampus.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Kontak Operasional</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
