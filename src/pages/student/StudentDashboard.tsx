import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Eye,
  AlertCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, getStats } = useReports();
  const navigate = useNavigate();

  // Student permissions: only see own reports
  const studentReports = reports.filter((r) => r.user_id === currentUser?.id);
  const stats = getStats(currentUser?.id);

  // Recent 5 reports
  const recentReports = [...studentReports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Layanan Mahasiswa UDINUS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser?.full_name || 'Mahasiswa'}!
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Laporkan setiap kerusakan fasilitas ruang kelas, laboratorium, sanitasi, atau infrastruktur kampus demi kelancaran kegiatan belajar mengajar di Universitas Dian Nuswantoro.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/reports/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Laporan Baru</span>
            </Link>
            <Link
              to="/student/reports"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Semua Riwayat Laporan</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner graphic */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <PlusCircle className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Laporan Saya"
          value={stats.total}
          icon={FileText}
          description="Semua laporan yang telah diajukan"
          colorScheme="navy"
          onClick={() => navigate('/student/reports')}
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={stats.menunggu}
          icon={Clock}
          description="Menunggu tindak lanjut Sarpras"
          colorScheme="amber"
          onClick={() => navigate('/student/reports?status=menunggu')}
        />
        <StatCard
          title="Sedang Diproses"
          value={stats.diproses}
          icon={RefreshCw}
          description="Dalam penanganan teknisi"
          colorScheme="blue"
          onClick={() => navigate('/student/reports?status=diproses')}
        />
        <StatCard
          title="Selesai Diperbaiki"
          value={stats.selesai}
          icon={CheckCircle2}
          description="Fasilitas siap digunakan"
          colorScheme="emerald"
          onClick={() => navigate('/student/reports?status=selesai')}
        />
      </div>

      {/* Recent Reports Section & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports Table Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Laporan Kerusakan Terbaru
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                5 laporan terakhir yang Anda kirimkan
              </p>
            </div>
            <Link
              to="/student/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Semua Riwayat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="Belum Ada Laporan"
                description="Anda belum pernah membuat laporan kerusakan fasilitas. Klik tombol di bawah untuk mengajukan laporan pertama."
                actionLabel="Laporkan Kerusakan Sekarang"
                onAction={() => navigate('/student/reports/create')}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-5 py-3">Laporan & Lokasi</th>
                    <th scope="col" className="px-4 py-3">Kategori</th>
                    <th scope="col" className="px-4 py-3">Prioritas</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/student/reports/${report.id}`)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {report.title}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{report.report_number}</span>
                          <span>&bull;</span>
                          <span>{report.location?.building_name || 'Kampus UDINUS'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-slate-700 block truncate max-w-[140px]">
                          {report.category?.name || 'Umum'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(report.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={report.priority} size="sm" />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={report.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/student/reports/${report.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Information & Emergency Contacts Card */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span>Petunjuk Pelaporan Efektif</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 text-[11px]">
                  1
                </span>
                <span>Tentukan gedung, nomor lantai, dan nomor ruang/meja secara detail.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 text-[11px]">
                  2
                </span>
                <span>Unggah foto kondisi kerusakan dengan pencahayaan yang jelas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 text-[11px]">
                  3
                </span>
                <span>Pantau pembaruan status dan catatan teknisi pada timeline laporan.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-xs">
            <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Kontak Darurat Sarpras</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Untuk bahaya kelistrikan, kebocoran pipa utama, atau lift macet darurat:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Kantor Sarpras:</span>
                <span className="font-semibold">024-3517261 ext 104</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Security / Pos Jaga:</span>
                <span className="font-semibold">Gedung D Lantai 1</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Email Sarpras:</span>
                <span className="font-semibold text-blue-400">sarpras@dinus.ac.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
