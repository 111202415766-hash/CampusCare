import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ArrowLeftRight,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, pageTitle }) => {
  const { currentUser, role, logout, loginAsRole } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (newRole: 'mahasiswa' | 'admin') => {
    loginAsRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            {pageTitle || 'CampusCare'}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">
            Universitas Dian Nuswantoro
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Switcher Pill (Great for demonstration & evaluation) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            title="Klik untuk beralih mode peran"
          >
            {role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Peran:</span>
                <span className="text-blue-700">Admin Sarpras</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Peran:</span>
                <span className="text-indigo-700">Mahasiswa</span>
              </>
            )}
            <ArrowLeftRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {showRoleMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-50"
              onClick={() => setShowRoleMenu(false)}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Ganti Peran Pengguna
              </div>
              <button
                type="button"
                onClick={() => handleSwitchRole('mahasiswa')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  role === 'mahasiswa'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <div>
                  <p>Mode Mahasiswa</p>
                  <p className="text-[10px] text-slate-400">Ahmad Fauzi (FIK)</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  role === 'admin'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <p>Mode Admin Sarpras</p>
                  <p className="text-[10px] text-slate-400">Bambang Sudarsono, S.T.</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="hidden md:block text-left mr-1">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                {currentUser?.full_name || 'Pengguna'}
              </p>
              <p className="text-[10px] text-slate-400">
                {currentUser?.nim_nip || 'UDINUS'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-50"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser?.full_name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email}
                </p>
              </div>

              <Link
                to={role === 'admin' ? '/admin/profile' : '/student/profile'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Lihat Profil</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
