import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos TypeScript
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'influencer' | 'admin';
  credits: number;
  total_spent: number;
  total_won: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'game' | 'prize' | 'bonus';
  amount: number;
  description: string;
  balance_after: number;
  created_at: string;
}

export interface GameResult {
  id: string;
  user_id: string;
  game_name: string;
  cost: number;
  prize: string | null;
  prize_value: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}