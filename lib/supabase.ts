import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos TypeScript
export interface User {
  id: string;
  email: string;
  senha?: string;
  role: 'admin' | 'user' | 'influencer';
  afiliado_id?: string;
  full_name?: string;
  phone?: string;
  credits: number;
  total_spent: number;
  total_won: number;
  is_active: boolean;
  criado_em: string;
  updated_at: string;
}

export interface Afiliado {
  id: string;
  user_id: string;
  nome: string;
  codigo: string;
  total_registros: number;
  ganhos: number;
  comissao_percentual: number;
  is_active: boolean;
  criado_em: string;
}

export interface Raspadinha {
  id: string;
  nome: string;
  imagem_url?: string;
  premio: string;
  premio_valor: number;
  chances: number;
  custo: number;
  is_active: boolean;
  criado_em: string;
  updated_at: string;
}

export interface Jogada {
  id: string;
  user_id: string;
  raspadinha_id: string;
  resultado: string;
  premio_ganho?: string;
  premio_valor: number;
  custo: number;
  criado_em: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'game' | 'prize' | 'bonus' | 'commission';
  amount: number;
  description: string;
  balance_after: number;
  related_game_id?: string;
  criado_em: string;
}

export interface GameResult {
  id: string;
  user_id: string;
  raspadinha_id: string;
  game_name: string;
  cost: number;
  prize?: string;
  prize_value: number;
  won: boolean;
  criado_em: string;
}