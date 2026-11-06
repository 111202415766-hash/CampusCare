import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>
          <span className="font-semibold text-slate-700">CampusCare</span> — Sistem Pelaporan & Monitoring Kerusakan Fasilitas Kampus
        </p>
        <p className="text-slate-400">
          Proyek Rekayasa Perangkat Lunak &bull; Universitas Dian Nuswantoro (UDINUS) Semarang
        </p>
      </div>
    </footer>
  );
};
