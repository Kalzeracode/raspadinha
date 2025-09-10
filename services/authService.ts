import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
}

export class AuthService {
  // Registro de usuário
  static async signUp(email: string, password: string, fullName: string, phone: string, role: 'user' | 'influencer' = 'user') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role
        }
      }
    });

    if (error) throw error;
    return data;
  }

  // Login de usuário
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Buscar perfil do usuário
    const profile = await this.getProfile(data.user.id);
    
    return {
      user: data.user,
      profile
    };
  }

  // Logout
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Buscar perfil do usuário
  static async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Atualizar perfil
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Buscar usuário atual
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const profile = await this.getProfile(user.id);
    
    return {
      user,
      profile
    };
  }

  // Atualizar créditos
  static async updateCredits(userId: string, creditChange: number, type: string, description: string) {
    const { data, error } = await supabase.rpc('update_user_credits', {
      user_id: userId,
      credit_change: creditChange,
      transaction_type: type,
      description
    });

    if (error) throw error;
    return data;
  }

  // Buscar transações do usuário
  static async getUserTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Salvar resultado do jogo
  static async saveGameResult(userId: string, gameName: string, cost: number, prize?: string, prizeValue = 0) {
    const { data, error } = await supabase
      .from('game_results')
      .insert({
        user_id: userId,
        game_name: gameName,
        cost,
        prize,
        prize_value: prizeValue
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Buscar resultados dos jogos do usuário
  static async getUserGameResults(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}