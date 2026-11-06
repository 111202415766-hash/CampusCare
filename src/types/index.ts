/**
 * CAMPUSCARE — Type Definitions
 * Prepared for PostgreSQL / Supabase Schema
 */

export type UserRole = 'mahasiswa' | 'admin';

export type ReportStatus = 'menunggu' | 'diproses' | 'selesai';

export type PriorityLevel = 'rendah' | 'sedang' | 'tinggi';

export interface Profile {
  id: string; // UUID
  user_id: string; // Auth UUID
  email: string;
  full_name: string;
  role: UserRole;
  nim_nip: string; // NIM for students, NIP for admin
  faculty_unit: string; // e.g. "Fakultas Ilmu Komputer (FIK)" or "Biro Sarana dan Prasarana"
  study_program?: string; // e.g. "S1 Teknik Informatika"
  phone: string;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string; // UUID
  name: string; // e.g. "AC & Tata Udara", "Kelistrikan & Lampu", "Perangkat IT & Proyektor"
  code: string; // e.g. "CAT-AC", "CAT-ELEC", "CAT-IT"
  description: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface Location {
  id: string; // UUID
  building_name: string; // e.g. "Gedung D (Kampus Utama)", "Gedung H", "Gedung G"
  code: string; // e.g. "BLD-D", "BLD-H"
  floor: string; // e.g. "Lantai 1", "Lantai 2", "Lantai 3", "Lantai 4"
  description: string; // e.g. "Laboratorium Komputer & Ruang Dosen"
  is_active: boolean;
  created_at: string;
}

export interface ReportPhoto {
  id: string; // UUID
  report_id: string;
  photo_url: string;
  caption?: string;
  created_at: string;
}

export interface StatusHistory {
  id: string; // UUID
  report_id: string;
  previous_status: ReportStatus | null;
  new_status: ReportStatus;
  notes: string;
  changed_by: {
    id: string;
    name: string;
    role: UserRole;
  };
  created_at: string;
}

export interface Report {
  id: string; // UUID
  report_number: string; // e.g. "LAP-202611-001"
  user_id: string; // reporter profile ID
  reporter?: Profile; // hydrated profile
  title: string;
  category_id: string;
  category?: Category; // hydrated category
  location_id: string;
  location?: Location; // hydrated location
  specific_location: string; // e.g. "Ruang D.2.A (Lab Multimedia), Baris 3"
  description: string;
  status: ReportStatus;
  priority: PriorityLevel;
  photos: ReportPhoto[];
  status_history: StatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface ReportStatistics {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
}
