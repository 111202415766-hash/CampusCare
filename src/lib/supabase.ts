import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://abdnfxppeapzewgjtdiu.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'https://abdnfxppeapzewgjtdiu.supabase.co/auth/v1/.well-known/jwks.json';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Defensive Supabase client instance.
 * Handles client creation safely and supports both VITE_SUPABASE_PUBLISHABLE_KEY
 * and VITE_SUPABASE_ANON_KEY naming conventions.
 */
function initSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.warn('Inisialisasi klien Supabase mengalami kendala:', error);
    return null;
  }
}

export const supabase = initSupabaseClient();

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  hasKey: Boolean(supabaseKey),
  keyPreview: supabaseKey ? `${supabaseKey.substring(0, 18)}...` : '',
};

export const SUPABASE_TABLES = {
  PROFILES: 'profiles',
  CATEGORIES: 'categories',
  LOCATIONS: 'locations',
  REPORTS: 'reports',
  REPORT_PHOTOS: 'report_photos',
  STATUS_HISTORY: 'status_history',
} as const;
