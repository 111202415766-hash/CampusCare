import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  Clock,
  ShieldAlert,
  FileText,
  User,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { PhotoGallery } from '../../components/reports/PhotoGallery';
import { ReportTimeline } from '../../components/reports/ReportTimeline';

export const StudentReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { getReportById } = useReports();
  const navigate = useNavigate();

  const report = id ? getReportById(id) : undefined;

  // Student permission check: student can only view their own reports
  if (report && currentUser && report.user_id !== currentUser.id) {
    return (
      <div className="max-w-2xl mx-auto my-12 rounded-2xl bg-white border border-rose-200 p-8 text-center shadow-xs">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Akses Laporan Dibatasi</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Demi privasi dan integritas data, mahasiswa hanya diizinkan melihat detail laporan kerusakan yang diajukan oleh akun sendiri.
        </p>
        <button
          onClick={() => navigate('/student/reports')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Saya</span>
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto my-12 rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-xs">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Laporan Tidak Ditemukan</h3>
        <p className="mt-1 text-sm text-slate-500">
          Laporan dengan ID tersebut tidak tersedia atau telah dihapus.
        </p>
        <button
          onClick={() => navigate('/student/reports')}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </button>
      </div>
    );
  }

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
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/student/reports')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Laporan</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {report.report_number}
          </span>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold tracking-wide font-mono border border-blue-200">
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
              <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                {report.category?.name || 'Kategori Fasilitas'}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-600 min-w-[220px]">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Lokasi Fasilitas:</span>
            </p>
            <p className="font-bold text-slate-900 text-sm">
              {report.location?.building_name || 'Gedung Kampus'}
            </p>
            <p className="text-slate-500">{report.location?.floor}</p>
            <p className="text-blue-700 font-medium mt-1">
              {report.specific_location}
            </p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="pt-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Deskripsi Masalah Kerusakan
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {report.description}
            </div>
          </div>

          {/* Photo Gallery */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Foto Dokumentasi Pendukung ({report.photos?.length || 0})
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
              <span>Linimasa Riwayat Penanganan (Status Timeline)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan progres dan tindakan petugas Biro Sarana dan Prasarana
            </p>
          </div>
        </div>

        <ReportTimeline history={report.status_history || []} />
      </div>
    </div>
  );
};
