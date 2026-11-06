import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Building,
  User,
  ArrowUpDown,
  Download,
  CheckCircle2,
  Clock,
  RefreshCw,
  Camera,
  RotateCcw,
} from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusChangeModal } from '../../components/reports/StatusChangeModal';
import { Report, ReportStatus } from '../../types';

export const AdminReportsPage: React.FC = () => {
  const { reports, categories, locations, updateReportStatus } = useReports();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters & Search
  const initialStatus = searchParams.get('status') || 'semua';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>('semua');
  const [locationFilter, setLocationFilter] = useState<string>('semua');
  const [priorityFilter, setPriorityFilter] = useState<string>('semua');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Status Change Modal State
  const [selectedReportForStatus, setSelectedReportForStatus] = useState<Report | null>(null);

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    if (val === 'semua') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', val);
    }
    setSearchParams(searchParams);
  };

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        // Search filter
        const query = searchTerm.toLowerCase();
        const matchSearch =
          !searchTerm ||
          r.title.toLowerCase().includes(query) ||
          r.report_number.toLowerCase().includes(query) ||
          r.specific_location.toLowerCase().includes(query) ||
          (r.reporter?.full_name || '').toLowerCase().includes(query) ||
          (r.reporter?.nim_nip || '').toLowerCase().includes(query) ||
          (r.location?.building_name || '').toLowerCase().includes(query);

        // Status filter
        const matchStatus = statusFilter === 'semua' || r.status === statusFilter;

        // Category filter
        const matchCategory =
          categoryFilter === 'semua' || r.category_id === categoryFilter;

        // Location filter
        const matchLocation =
          locationFilter === 'semua' || r.location_id === locationFilter;

        // Priority filter
        const matchPriority =
          priorityFilter === 'semua' || r.priority === priorityFilter;

        return (
          matchSearch &&
          matchStatus &&
          matchCategory &&
          matchLocation &&
          matchPriority
        );
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [
    reports,
    searchTerm,
    statusFilter,
    categoryFilter,
    locationFilter,
    priorityFilter,
    sortOrder,
  ]);

  const handleStatusConfirm = async (newStatus: ReportStatus, notes: string) => {
    if (!selectedReportForStatus) return;
    await updateReportStatus(selectedReportForStatus.id, newStatus, notes);
    setSelectedReportForStatus(null);
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring & Manajemen Pengaduan Sarpras
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seluruh data kerusakan fasilitas kampus yang dilaporkan oleh mahasiswa UDINUS.
          </p>
        </div>

        {/* Quick summary counters */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <span className="px-2.5 py-1">Total: {reports.length}</span>
            <span className="px-2.5 py-1 text-amber-700 bg-white rounded-lg shadow-2xs">
              Menunggu: {reports.filter((r) => r.status === 'menunggu').length}
            </span>
            <span className="px-2.5 py-1 text-blue-700">
              Proses: {reports.filter((r) => r.status === 'diproses').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor laporan, nama pelapor, NIM, atau ruangan..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              <option value="semua">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              <option value="semua">Semua Gedung</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.building_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>
              Menampilkan <strong className="text-slate-800">{filteredReports.length}</strong> laporan
            </span>

            {/* Quick reset filters */}
            {(searchTerm || statusFilter !== 'semua' || categoryFilter !== 'semua' || locationFilter !== 'semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('semua');
                  setCategoryFilter('semua');
                  setLocationFilter('semua');
                  setPriorityFilter('semua');
                  searchParams.delete('status');
                  setSearchParams(searchParams);
                }}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Urutan: {sortOrder === 'desc' ? 'Waktu Terbaru' : 'Waktu Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Tidak Ada Laporan yang Cocok"
          description="Tidak ditemukan laporan dengan filter atau kata kunci pencarian yang dipilih. Coba atur ulang filter Anda."
        />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">No. Laporan & Tanggal</th>
                  <th scope="col" className="px-4 py-3.5">Pelapor</th>
                  <th scope="col" className="px-4 py-3.5">Fasilitas Kerusakan</th>
                  <th scope="col" className="px-4 py-3.5">Lokasi Gedung</th>
                  <th scope="col" className="px-4 py-3.5">Prioritas</th>
                  <th scope="col" className="px-4 py-3.5">Status Saat Ini</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/reports/${report.id}`)}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold font-mono text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.report_number}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {report.reporter?.full_name || 'Mahasiswa'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {report.reporter?.nim_nip}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
                        {report.title}
                      </div>
                      <div className="text-xs text-blue-700 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{report.category?.name || 'Umum'}</span>
                        {report.photos && report.photos.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            <Camera className="w-2.5 h-2.5" />
                            {report.photos.length} foto
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{report.location?.building_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                        {report.specific_location}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={report.priority} size="sm" />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportForStatus(report);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Ubah Status Laporan"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Ubah Status</span>
                        </button>

                        <Link
                          to={`/admin/reports/${report.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Change Modal with Confirmation */}
      {selectedReportForStatus && (
        <StatusChangeModal
          isOpen={!!selectedReportForStatus}
          report={selectedReportForStatus}
          onClose={() => setSelectedReportForStatus(null)}
          onConfirm={handleStatusConfirm}
        />
      )}
    </div>
  );
};
