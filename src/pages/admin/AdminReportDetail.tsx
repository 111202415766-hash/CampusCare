import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { PhotoGallery } from '../../components/reports/PhotoGallery';
import { ReportTimeline } from '../../components/reports/ReportTimeline';
import { StatusChangeModal } from '../../components/reports/StatusChangeModal';
import { ReportStatus } from '../../types';

export const AdminReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById, updateReportStatus } = useReports();
  const navigate = useNavigate();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const report = id ? getReportById(id) : undefined;

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto my-12 rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-xs">
        <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Laporan Tidak Ditemukan</h3>
        <p className="mt-1 text-sm text-slate-500">
          Laporan fasilitas kampus tidak ditemukan di sistem.
        </p>
        <button
          onClick={() => navigate('/admin/reports')}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Laporan</span>
        </button>
      </div>
    );
  }

  const handleStatusConfirm = async (newStatus: ReportStatus, notes: string) => {
    await updateReportStatus(report.id, newStatus, notes);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d) + ' WIB';
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/reports')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Semua Laporan</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Status Change CTA */}
          <button
            type="button"
            onClick={() => setIsStatusModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Perbarui Status Laporan</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold font-mono border border-blue-200">
                {report.report_number}
              </span>
              <StatusBadge status={report.status} size="md" />
              <PriorityBadge priority={report.priority} size="md" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Diajukan: {formatDateTime(report.created_at)}</span>
              </span>
              <span>&bull;</span>
              <span className="text-blue-700 font-semibold">
                Kategori: {report.category?.name || 'Umum'}
              </span>
            </div>
          </div>

          {/* Quick status card with action button */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs min-w-[240px]">
            <p className="text-slate-500 font-medium">Status Penanganan:</p>
            <div className="mt-1 flex items-center justify-between">
              <StatusBadge status={report.status} size="lg" />
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                Ubah
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Terakhir diperbarui: {formatDateTime(report.updated_at)}
            </p>
          </div>
        </div>

        {/* Reporter info & Facility Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Pelapor Profile */}
          <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Informasi Mahasiswa Pelapor</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Nama Pelapor:</span>
                <span className="font-bold text-slate-900">{report.reporter?.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">NIM:</span>
                <span className="font-mono font-semibold text-slate-800">{report.reporter?.nim_nip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Program Studi:</span>
                <span className="text-slate-700 font-medium">{report.reporter?.study_program || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Email Kampus:</span>
                <span className="text-blue-600 font-medium">{report.reporter?.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">No. Kontak / WA:</span>
                <span className="font-semibold text-slate-800">{report.reporter?.phone || '-'}</span>
              </div>
            </div>
          </div>

          {/* Lokasi Fasilitas */}
          <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Lokasi Fasilitas Kampus</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Gedung:</span>
                <span className="font-bold text-slate-900">{report.location?.building_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Lantai:</span>
                <span className="font-semibold text-slate-800">{report.location?.floor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Kode Lokasi:</span>
                <span className="font-mono text-slate-700">{report.location?.code}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Titik Spesifik:</span>
                <span className="font-semibold text-blue-700 text-right">{report.specific_location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Damage Description */}
        <div className="space-y-6 pt-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Uraian Deskripsi Kerusakan
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {report.description}
            </div>
          </div>

          {/* Photo Gallery */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Dokumentasi Foto Lapangan ({report.photos?.length || 0})
            </h3>
            <PhotoGallery photos={report.photos || []} />
          </div>
        </div>
      </div>

      {/* Status History Timeline Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Riwayat Pembaruan Status & Catatan Teknisi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh riwayat aksi penanganan dicatat secara kronologis
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsStatusModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tambah Catatan / Status</span>
          </button>
        </div>

        <ReportTimeline history={report.status_history || []} />
      </div>

      {/* Confirmation Modal for Status Change */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        report={report}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusConfirm}
      />
    </div>
  );
};
