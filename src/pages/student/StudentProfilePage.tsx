import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  FileText,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { getStats } = useReports();
  const stats = getStats(currentUser?.id);

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
          Profil Mahasiswa
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Informasi identitas akun pelapor civitas akademika Universitas Dian Nuswantoro.
        </p>
      </div>

      {isSaved && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Informasi kontak berhasil diperbarui!</span>
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
                  {currentUser?.full_name?.charAt(0) || 'M'}
                </div>
              )}
            </div>
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {currentUser?.full_name}
          </h3>
          <p className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
            NIM: {currentUser?.nim_nip}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
            <GraduationCap className="w-3 h-3" />
            <span>Mahasiswa Aktif</span>
          </span>

          {/* Quick stats mini widget */}
          <div className="w-full mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
              <span className="text-base font-bold text-slate-800">{stats.total}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50">
              <span className="text-[10px] text-amber-600 uppercase font-semibold block">Proses</span>
              <span className="text-base font-bold text-amber-700">{stats.diproses}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50">
              <span className="text-[10px] text-emerald-600 uppercase font-semibold block">Selesai</span>
              <span className="text-base font-bold text-emerald-700">{stats.selesai}</span>
            </div>
          </div>
        </div>

        {/* Right Details Form */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 mb-5">
            Informasi Data Akademik
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.full_name || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.nim_nip || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Fakultas
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.faculty_unit || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Program Studi
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.study_program || '-'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Alamat Email Mahasiswa (SSO UDINUS)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Email SSO otomatis disinkronkan dari database Biro Administrasi Akademik (BIAK).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Kontak WhatsApp / HP (Dapat Diubah)
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Nomor ini digunakan staf Sarpras jika teknisi memerlukan konfirmasi lokasi darurat.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kontak</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
