import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  Tags,
  MapPin,
  ClipboardList,
  RotateCcw,
  LogOut,
  Building2,
  Database,
  X,
  ExternalLink,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { isSupabaseConfigured, SUPABASE_CONFIG } from '../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, role, logout } = useAuth();
  const { resetToDefaultData } = useReports();
  const navigate = useNavigate();
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  interface NavLinkItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  const studentLinks: NavLinkItem[] = [
    {
      to: '/student/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/student/reports/create',
      label: 'Buat Laporan',
      icon: PlusCircle,
      highlight: true,
    },
    {
      to: '/student/reports',
      label: 'Riwayat Laporan',
      icon: FileText,
    },
    {
      to: '/student/profile',
      label: 'Profil Mahasiswa',
      icon: User,
    },
  ];

  const adminLinks: NavLinkItem[] = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard Sarpras',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/reports',
      label: 'Semua Laporan',
      icon: ClipboardList,
    },
    {
      to: '/admin/categories',
      label: 'Manajemen Kategori',
      icon: Tags,
    },
    {
      to: '/admin/locations',
      label: 'Manajemen Lokasi',
      icon: MapPin,
    },
    {
      to: '/admin/profile',
      label: 'Profil Admin',
      icon: User,
    },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  const handleReset = () => {
    if (window.confirm('Reset data simulasi ke data awal contoh?')) {
      resetToDefaultData();
      alert('Data simulasi berhasil dikembalikan ke default.');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide block leading-none">
                CampusCare
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-1 block">
                UDINUS SEMARANG
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-700 ring-2 ring-blue-500/40 shrink-0">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-xs text-white">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.full_name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === 'admin' ? 'Biro Sarpras' : currentUser?.study_program || 'Mahasiswa'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'admin' ? 'Menu Administrator Sarpras' : 'Menu Layanan Mahasiswa'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                      : link.highlight
                      ? 'bg-blue-600/15 text-blue-300 hover:bg-blue-600/25 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Database & Architecture Indicator */}
        <div className="border-t border-slate-800/80 p-3 mx-2 space-y-2">
          <button
            type="button"
            onClick={() => setShowSupabaseModal(true)}
            className="w-full flex items-center justify-between text-[11px] px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer group"
            title="Klik untuk detail koneksi Supabase"
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-slate-300">Database:</span>
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                isSupabaseConfigured
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase Terhubung' : 'Mock + Supabase Ready'}
            </span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-2 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Reset data ke nilai default"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Data</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg bg-rose-950/60 border border-rose-900/60 p-1.5 text-rose-300 hover:bg-rose-900 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Supabase Connection Details Modal */}
      {showSupabaseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          onClick={() => setShowSupabaseModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Konfigurasi Database Supabase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Status koneksi backend PostgreSQL CampusCare
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSupabaseModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-semibold">
                  URL & Kunci Akses Supabase Berhasil Dikonfigurasi di Environment!
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Project Endpoint:</span>
                  <span className="font-mono font-semibold text-slate-800 break-all text-right max-w-[280px]">
                    {SUPABASE_CONFIG.url}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Publishable / Anon Key:</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    {SUPABASE_CONFIG.keyPreview} (Tersedia)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">File Skema DDL:</span>
                  <span className="font-mono font-semibold text-blue-600">
                    /supabase/schema.sql
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Petunjuk Menjalankan Skema di Supabase:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-blue-800">
                  <li>Buka dashboard Supabase pada URL project Anda.</li>
                  <li>Masuk ke menu <strong>SQL Editor</strong>.</li>
                  <li>Salin seluruh isi file <code>supabase/schema.sql</code> dan klik <strong>Run</strong> untuk membuat tabel profiles, categories, locations, reports, photos, dan status_history.</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSupabaseModal(false)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
