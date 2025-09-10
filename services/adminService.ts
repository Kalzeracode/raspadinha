import { supabase } from '../lib/supabase';
import type { Profile, Transaction, GameResult } from '../lib/supabase';

export interface DashboardStats {
  totalUsers: number;
  totalInfluencers: number;
  totalCreditsInCirculation: number;
  totalGamesPlayed: number;
  totalRevenue: number;
  todayStats: {
    newUsers: number;
    gamesPlayed: number;
    revenue: number;
  };
}

export class AdminService {
  // Login administrativo (usando tabela separada)
  static async adminSignIn(email: string, password: string) {
    // Aqui você implementaria a verificação de senha hash
    // Por simplicidade, vamos usar uma verificação básica
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Credenciais inválidas');
    }

    // Em produção, você verificaria o hash da senha aqui
    // if (!bcrypt.compareSync(password, data.password_hash)) {
    //   throw new Error('Credenciais inválidas');
    // }

    // Atualizar último login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    return data;
  }

  // Buscar estatísticas do dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().split('T')[0];

    // Total de usuários
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user');

    // Total de influencers
    const { count: totalInfluencers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'influencer');

    // Total de créditos em circulação
    const { data: creditsData } = await supabase
      .from('profiles')
      .select('credits');
    
    const totalCreditsInCirculation = creditsData?.reduce((sum, profile) => sum + profile.credits, 0) || 0;

    // Total de jogos jogados
    const { count: totalGamesPlayed } = await supabase
      .from('game_results')
      .select('*', { count: 'exact', head: true });

    // Receita total (soma dos gastos)
    const { data: revenueData } = await supabase
      .from('profiles')
      .select('total_spent');
    
    const totalRevenue = revenueData?.reduce((sum, profile) => sum + profile.total_spent, 0) || 0;

    // Estatísticas de hoje
    const { count: newUsersToday } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    const { count: gamesToday } = await supabase
      .from('game_results')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    const { data: revenueToday } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'game')
      .gte('created_at', today);

    const todayRevenue = revenueToday?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalInfluencers: totalInfluencers || 0,
      totalCreditsInCirculation,
      totalGamesPlayed: totalGamesPlayed || 0,
      totalRevenue,
      todayStats: {
        newUsers: newUsersToday || 0,
        gamesPlayed: gamesToday || 0,
        revenue: todayRevenue
      }
    };
  }

  // Buscar todos os usuários
  static async getAllUsers(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Buscar todas as transações
  static async getAllTransactions(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles!inner(full_name, email:id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      transactions: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Buscar todos os resultados de jogos
  static async getAllGameResults(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('game_results')
      .select(`
        *,
        profiles!inner(full_name, email:id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      gameResults: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Atualizar créditos de um usuário (admin)
  static async updateUserCredits(userId: string, newCredits: number, reason: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Usuário não encontrado');

    const creditChange = newCredits - profile.credits;

    const { error } = await supabase.rpc('update_user_credits', {
      user_id: userId,
      credit_change: creditChange,
      transaction_type: 'bonus',
      description: `Admin: ${reason}`
    });

    if (error) throw error;
  }

  // Alterar role de um usuário
  static async updateUserRole(userId: string, newRole: 'user' | 'influencer' | 'admin') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}