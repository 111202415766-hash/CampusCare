import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Report,
  Category,
  Location,
  ReportStatus,
  PriorityLevel,
  ReportStatistics,
  StatusHistory,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_LOCATIONS,
  INITIAL_REPORTS,
  INITIAL_PROFILES,
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface CreateReportInput {
  title: string;
  category_id: string;
  location_id: string;
  specific_location: string;
  description: string;
  priority: PriorityLevel;
  photos: { url: string; caption?: string }[];
}

interface ReportContextType {
  reports: Report[];
  categories: Category[];
  locations: Location[];
  createReport: (data: CreateReportInput) => Promise<Report>;
  updateReportStatus: (reportId: string, newStatus: ReportStatus, notes: string) => Promise<boolean>;
  getReportById: (id: string) => Report | undefined;
  getStats: (forUserId?: string) => ReportStatistics;
  // Category management
  addCategory: (cat: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ success: boolean; message?: string }>;
  // Location management
  addLocation: (loc: Omit<Location, 'id' | 'created_at'>) => Promise<void>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<{ success: boolean; message?: string }>;
  resetToDefaultData: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REPORTS: 'campuscare_reports_v2',
  CATEGORIES: 'campuscare_categories_v2',
  LOCATIONS: 'campuscare_locations_v2',
};

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // Keep localStorage synced
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed saving categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.warn('Failed saving locations to localStorage', e);
    }
  }, [locations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed saving reports to localStorage', e);
    }
  }, [reports]);

  // Hydrate report relationships with categories, locations, and reporter profile
  const hydratedReports = useMemo(() => {
    return reports.map((rep) => {
      const category = categories.find((c) => c.id === rep.category_id);
      const location = locations.find((l) => l.id === rep.location_id);
      const reporter = INITIAL_PROFILES.find((p) => p.id === rep.user_id) || {
        id: rep.user_id,
        user_id: rep.user_id,
        email: 'pelapor@dinus.ac.id',
        full_name: 'Mahasiswa Pelapor',
        role: 'mahasiswa' as const,
        nim_nip: 'A11.2024.15766',
        faculty_unit: 'Fakultas Ilmu Komputer (FIK)',
        phone: '0812-3456-7890',
        created_at: rep.created_at,
      };

      return {
        ...rep,
        category,
        location,
        reporter,
      };
    });
  }, [reports, categories, locations]);

  const createReport = async (input: CreateReportInput): Promise<Report> => {
    const reportCount = reports.length + 1;
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const paddedNum = String(reportCount).padStart(3, '0');
    const report_number = `LAP-${dateStr}-${paddedNum}`;
    const reportId = `rep-uuid-${Date.now()}`;
    const now = new Date().toISOString();

    const reporterUser = currentUser || INITIAL_PROFILES[0];

    const newReport: Report = {
      id: reportId,
      report_number,
      user_id: reporterUser.id,
      title: input.title,
      category_id: input.category_id,
      location_id: input.location_id,
      specific_location: input.specific_location,
      description: input.description,
      status: 'menunggu',
      priority: input.priority || 'sedang',
      photos: input.photos.map((p, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        report_id: reportId,
        photo_url: p.url,
        caption: p.caption || 'Foto dokumentasi fasilitas rusak',
        created_at: now,
      })),
      status_history: [
        {
          id: `hist-${Date.now()}`,
          report_id: reportId,
          previous_status: null,
          new_status: 'menunggu',
          notes: 'Laporan kerusakan fasilitas berhasil dikirimkan oleh pelapor.',
          changed_by: {
            id: reporterUser.id,
            name: reporterUser.full_name,
            role: reporterUser.role,
          },
          created_at: now,
        },
      ],
      created_at: now,
      updated_at: now,
    };

    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus,
    notes: string
  ): Promise<boolean> => {
    const target = reports.find((r) => r.id === reportId);
    if (!target) return false;

    const actor = currentUser || INITIAL_PROFILES[2]; // Admin default
    const now = new Date().toISOString();

    const newHistory: StatusHistory = {
      id: `hist-${Date.now()}`,
      report_id: reportId,
      previous_status: target.status,
      new_status: newStatus,
      notes: notes.trim() || `Status laporan diubah menjadi ${newStatus}.`,
      changed_by: {
        id: actor.id,
        name: actor.full_name,
        role: actor.role,
      },
      created_at: now,
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            updated_at: now,
            status_history: [...r.status_history, newHistory],
          };
        }
        return r;
      })
    );

    return true;
  };

  const getReportById = (id: string): Report | undefined => {
    return hydratedReports.find((r) => r.id === id || r.report_number === id);
  };

  const getStats = (forUserId?: string): ReportStatistics => {
    const filtered = forUserId
      ? reports.filter((r) => r.user_id === forUserId)
      : reports;

    return {
      total: filtered.length,
      menunggu: filtered.filter((r) => r.status === 'menunggu').length,
      diproses: filtered.filter((r) => r.status === 'diproses').length,
      selesai: filtered.filter((r) => r.status === 'selesai').length,
    };
  };

  // Category CRUD
  const addCategory = async (cat: Omit<Category, 'id' | 'created_at'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCategory = async (id: string) => {
    const inUse = reports.some((r) => r.category_id === id);
    if (inUse) {
      return {
        success: false,
        message: 'Kategori tidak dapat dihapus karena masih digunakan dalam beberapa laporan aktif.',
      };
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // Location CRUD
  const addLocation = async (loc: Omit<Location, 'id' | 'created_at'>) => {
    const newLoc: Location = {
      ...loc,
      id: `loc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setLocations((prev) => [...prev, newLoc]);
  };

  const updateLocation = async (id: string, data: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data } : l))
    );
  };

  const deleteLocation = async (id: string) => {
    const inUse = reports.some((r) => r.location_id === id);
    if (inUse) {
      return {
        success: false,
        message: 'Lokasi tidak dapat dihapus karena tercatat dalam laporan aktif.',
      };
    }
    setLocations((prev) => prev.filter((l) => l.id !== id));
    return { success: true };
  };

  const resetToDefaultData = () => {
    setCategories(INITIAL_CATEGORIES);
    setLocations(INITIAL_LOCATIONS);
    setReports(INITIAL_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
  };

  return (
    <ReportContext.Provider
      value={{
        reports: hydratedReports,
        categories,
        locations,
        createReport,
        updateReportStatus,
        getReportById,
        getStats,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        resetToDefaultData,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
