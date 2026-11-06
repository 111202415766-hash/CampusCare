import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'mahasiswa' | 'admin'>('mahasiswa');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Harap masukkan alamat email atau NIM/NIP Anda.');
      return;
    }

    const ok = login(email, selectedRole);
    if (ok) {
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  const handleQuickLogin = (role: 'mahasiswa' | 'admin') => {
    loginAsRole(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Branding header */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4 ring-4 ring-blue-500/20">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            CampusCare
          </h2>
          <p className="mt-2 text-sm text-blue-200/90 font-medium">
            Sistem Pelaporan dan Monitoring Kerusakan Fasilitas Kampus
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Universitas Dian Nuswantoro (UDINUS) Semarang
          </p>
        </div>

        {/* Quick Demo Access Box */}
        <div className="mt-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 shadow-xl backdrop-blur-xs">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Akses Cepat Pengujian (1-Klik)</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Pilih akun simulasi di bawah ini untuk langsung masuk tanpa perlu mengetik kredensial:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('mahasiswa')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-left border border-slate-600/70 hover:border-blue-500 transition-all text-white group"
            >
              <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold">Mahasiswa</p>
                <p className="text-[11px] text-slate-300 truncate">Ahmad Fauzi (FIK)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-left border border-slate-600/70 hover:border-blue-500 transition-all text-white group"
            >
              <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold">Admin Sarpras</p>
                <p className="text-[11px] text-slate-300 truncate">Bambang Sudarsono, S.T.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Tab Choice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Pilih Jenis Akun
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('mahasiswa');
                    setEmail('111202415766@mhs.dinus.ac.id');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    selectedRole === 'mahasiswa'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mahasiswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setEmail('sarpras@dinus.ac.id');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Sarpras</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                {selectedRole === 'mahasiswa' ? 'Email Kampus / NIM' : 'Email / NIP Petugas'}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'mahasiswa'
                      ? 'Contoh: 111202415766@mhs.dinus.ac.id'
                      : 'Contoh: sarpras@dinus.ac.id'
                  }
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  defaultValue="udinus2026"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Gunakan kredensial akun SIA UDINUS untuk mahasiswa.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Butuh bantuan akses akun? Hubungi <span className="font-semibold text-slate-700">Helpdesk Sarpras UDINUS</span> Gedung H Lantai 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
