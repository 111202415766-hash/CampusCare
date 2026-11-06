import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { INITIAL_PROFILES } from '../data/mockData';

interface AuthContextType {
  currentUser: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campuscare_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to student user for seamless first load, or restore from localStorage
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to student Ahmad Fauzi
    return INITIAL_PROFILES[0];
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // localStorage error handling
    }
  }, [currentUser]);

  const login = (email: string, roleHint?: UserRole): boolean => {
    const trimmed = email.trim().toLowerCase();
    const found = INITIAL_PROFILES.find(
      (p) => p.email.toLowerCase() === trimmed || (roleHint && p.role === roleHint)
    );

    if (found) {
      setCurrentUser(found);
      return true;
    }

    // If not directly found by email, create a guest profile with requested role
    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      user_id: `auth-${Date.now()}`,
      email: trimmed || (roleHint === 'admin' ? 'sarpras@dinus.ac.id' : 'mahasiswa@mhs.dinus.ac.id'),
      full_name: roleHint === 'admin' ? 'Staf Biro Sarpras' : 'Mahasiswa UDINUS',
      role: roleHint || 'mahasiswa',
      nim_nip: roleHint === 'admin' ? '0686.11.2020.999' : 'A11.2024.99999',
      faculty_unit: roleHint === 'admin' ? 'Biro Sarana dan Prasarana' : 'Fakultas Ilmu Komputer (FIK)',
      study_program: roleHint === 'mahasiswa' ? 'S1 Teknik Informatika' : undefined,
      phone: '0812-0000-0000',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    return true;
  };

  const loginAsRole = (role: UserRole) => {
    const target = INITIAL_PROFILES.find((p) => p.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        loginAsRole,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
