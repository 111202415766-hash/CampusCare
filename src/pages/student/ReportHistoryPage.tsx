import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  FileText,
  Calendar,
  Building,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { ReportStatus } from '../../types';

export const ReportHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, categories } = useReports();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const initialStatus = (searchParams.get('status') as ReportStatus) || 'semua';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>('semua');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter only student's own reports (Strict Student Permission)
  const studentReports = useMemo(() => {
    return reports.filter((r) => r.user_id === currentUser?.id);
  }, [reports, currentUser]);

  // Apply search, filters and sort
  const filteredReports = useMemo(() => {
    return studentReports
      .filter((rep) => {
        // Search filter
        const matchSearch =
          !searchTerm ||
          rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rep.report_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rep.specific_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (rep.location?.building_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchStatus = statusFilter === 'semua' || rep.status === statusFilter;

        // Category filter
        const matchCategory =
          categoryFilter === 'semua' || rep.category_id === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [studentReports, searchTerm, statusFilter, categoryFilter, sortOrder]);

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    if (val === 'semua') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', val);
    }
    setSearchParams(searchParams);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d) + ' WIB';
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
            Riwayat Laporan Fasilitas Saya
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar seluruh laporan kerusakan kampus yang pernah Anda ajukan ke Biro Sarpras.
          </p>
        </div>

        <Link
          to="/student/reports/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor laporan, judul, atau ruangan..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
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
        </div>

        {/* Results Count & Sort */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredReports.length}</strong> dari {studentReports.length} laporan Anda
          </span>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Urutkan: {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Reports Table / Card Container */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak Ada Laporan Ditemukan"
          description={
            searchTerm || statusFilter !== 'semua' || categoryFilter !== 'semua'
              ? 'Tidak ada laporan yang sesuai dengan filter pencarian Anda. Coba ubah kata kunci atau reset filter.'
              : 'Anda belum memiliki riwayat laporan kerusakan fasilitas kampus.'
          }
          actionLabel={
            searchTerm || statusFilter !== 'semua' || categoryFilter !== 'semua'
              ? 'Reset Filter'
              : 'Buat Laporan Sekarang'
          }
          onAction={() => {
            if (searchTerm || statusFilter !== 'semua' || categoryFilter !== 'semua') {
              setSearchTerm('');
              setStatusFilter('semua');
              setCategoryFilter('semua');
            } else {
              navigate('/student/reports/create');
            }
          }}
        />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3.5">No. Laporan & Waktu</th>
                  <th scope="col" className="px-4 py-3.5">Fasilitas & Masalah</th>
                  <th scope="col" className="px-4 py-3.5">Lokasi Gedung</th>
                  <th scope="col" className="px-4 py-3.5">Prioritas</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => navigate(`/student/reports/${report.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.report_number}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-sm">
                        {report.title}
                      </div>
                      <div className="text-xs text-blue-700 font-medium mt-0.5">
                        {report.category?.name || 'Kategori Umum'}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{report.location?.building_name || 'Kampus Utama'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
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
                      <Link
                        to={`/student/reports/${report.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Detail</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
