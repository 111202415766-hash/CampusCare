import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const PAGE_TITLES: Record<string, string> = {
  '/student/dashboard': 'Dashboard Mahasiswa',
  '/student/reports/create': 'Buat Laporan Kerusakan',
  '/student/reports': 'Riwayat Laporan Fasilitas',
  '/student/profile': 'Profil Mahasiswa',
  '/admin/dashboard': 'Dashboard Biro Sarpras',
  '/admin/reports': 'Monitoring & Manajemen Laporan',
  '/admin/categories': 'Manajemen Kategori Kerusakan',
  '/admin/locations': 'Manajemen Lokasi & Gedung',
  '/admin/profile': 'Profil Administrator Sarpras',
};

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const currentTitle = PAGE_TITLES[location.pathname] || 'CampusCare';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main app content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          pageTitle={currentTitle}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
