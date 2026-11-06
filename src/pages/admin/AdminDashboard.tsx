import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  TrendingUp,
  Building,
  Tags,
  MapPin,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, categories, locations, getStats } = useReports();
  const navigate = useNavigate();

  const stats = getStats(); // Admin views global system stats

  // Latest 6 reports
  const latestReports = [...reports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // Urgent pending reports
  const urgentReports = reports.filter(
    (r) => r.status === 'menunggu' && r.priority === 'tinggi'
  );

  // Category breakdown calculation
  const categoryBreakdown = categories.map((cat) => {
    const count = reports.filter((r) => r.category_id === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      code: cat.code,
      count,
      percentage: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count);

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
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-blue-400/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Kendali Biro Sarana dan Prasarana</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Pemantauan Fasilitas UDINUS
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Selamat datang, <span className="font-semibold text-white">{currentUser?.full_name}</span>. Pantau status pengaduan kerusakan fasilitas, koordinasikan teknisi lapangan, dan perbarui status perbaikan secara berkala.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Kelola Seluruh Laporan ({stats.total})</span>
            </Link>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <Tags className="w-4 h-4" />
              <span>Kategori ({categories.length})</span>
            </Link>
            <Link
              to="/admin/locations"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Lokasi Gedung ({locations.length})</span>
            </Link>
          </div>
        </div>

        {/* Ambient icon */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Building className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Urgent Warning Banner if there are high-priority pending reports */}
      {urgentReports.length > 0 && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Perhatian: Terdapat {urgentReports.length} Laporan Prioritas Tinggi Menunggu Tindakan
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Laporan ini membutuhkan penanganan teknisi segera demi keselamatan atau kelancaran perkuliahan.
              </p>
            </div>
          </div>
          <Link
            to="/admin/reports?status=menunggu"
            className="shrink-0 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
          >
            Tinjau Sekarang
          </Link>
        </div>
      )}

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Seluruh Laporan"
          value={stats.total}
          icon={ClipboardList}
          description="Total akumulasi laporan masuk"
          colorScheme="navy"
          onClick={() => navigate('/admin/reports')}
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={stats.menunggu}
          icon={Clock}
          description="Perlu ditinjau & diverifikasi"
          colorScheme="amber"
          onClick={() => navigate('/admin/reports?status=menunggu')}
        />
        <StatCard
          title="Sedang Dikerjakan"
          value={stats.diproses}
          icon={RefreshCw}
          description="Dalam proses perbaikan teknisi"
          colorScheme="blue"
          onClick={() => navigate('/admin/reports?status=diproses')}
        />
        <StatCard
          title="Selesai Diperbaiki"
          value={stats.selesai}
          icon={CheckCircle2}
          description="Perbaikan tuntas & terverifikasi"
          colorScheme="emerald"
          onClick={() => navigate('/admin/reports?status=selesai')}
        />
      </div>

      {/* Main Grid: Latest Reports + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Reports List (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaduan Kerusakan Terbaru
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pengajuan terkini dari mahasiswa UDINUS
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Semua Laporan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestReports.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={ClipboardList}
                title="Belum Ada Laporan"
                description="Belum ada pengaduan fasilitas dari mahasiswa."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-5 py-3">Laporan & Pelapor</th>
                    <th scope="col" className="px-4 py-3">Kategori & Lokasi</th>
                    <th scope="col" className="px-4 py-3">Prioritas</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {latestReports.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                          {report.title}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-slate-600">{report.report_number}</span>
                          <span>&bull;</span>
                          <span>{report.reporter?.full_name || 'Mahasiswa'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold text-slate-800 block truncate max-w-[150px]">
                          {report.category?.name || 'Umum'}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                          {report.location?.building_name}
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
                          to={`/admin/reports/${report.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Kelola</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistical Overview (Category Distribution) */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Statistik per Kategori Kerusakan</span>
              </h4>
            </div>

            <div className="space-y-3.5">
              {categoryBreakdown.map((cat) => (
                <div key={cat.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                      {cat.name}
                    </span>
                    <span className="font-mono text-slate-500">
                      <strong>{cat.count}</strong> lap ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(cat.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                to="/admin/categories"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>Kelola Master Kategori Kerusakan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Facility Locations summary */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Area Gedung Kampus Terdaftar</span>
            </h4>
            <div className="space-y-2">
              {locations.slice(0, 4).map((loc) => (
                <div
                  key={loc.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{loc.building_name}</p>
                    <p className="text-[11px] text-slate-400">{loc.floor}</p>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-semibold">
                    {loc.code}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/admin/locations"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>Lihat Seluruh Gedung & Ruang Kampus</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
