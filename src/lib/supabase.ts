import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Subject {
  id: string;
  title: string;
  credits: number;
  grade: number;
  semester: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  current_cumulative_gpa: number;
  total_credits_earned: number;
  target_gpax: number;
  created_at: string;
  updated_at: string;
}
