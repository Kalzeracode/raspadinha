import { supabase } from '../lib/supabase';
import type { User, Raspadinha, Afiliado, Transaction, GameResult } from '../lib/supabase';

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
  // Verificar se usuário é admin
  static async verifyAdmin(userId: string): Promise<boolean> {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    return user?.role === 'admin';
  }

  // Buscar estatísticas do dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().split('T')[0];

    // Total de usuários
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user');

    // Total de influencers
    const { count: totalInfluencers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'influencer');

    // Total de créditos em circulação
    const { data: creditsData } = await supabase
      .from('users')
      .select('credits');
    
    const totalCreditsInCirculation = creditsData?.reduce((sum, user) => sum + user.credits, 0) || 0;

    // Total de jogos jogados
    const { count: totalGamesPlayed } = await supabase
      .from('game_results')
      .select('*', { count: 'exact', head: true });

    // Receita total
    const { data: revenueData } = await supabase
      .from('users')
      .select('total_spent');
    
    const totalRevenue = revenueData?.reduce((sum, user) => sum + user.total_spent, 0) || 0;

    // Estatísticas de hoje
    const { count: newUsersToday } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', today);

    const { count: gamesToday } = await supabase
      .from('game_results')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', today);

    const { data: revenueToday } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'game')
      .gte('criado_em', today);

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
      .from('users')
      .select('id, email, role, full_name, credits, total_spent, total_won, is_active, criado_em', { count: 'exact' })
      .order('criado_em', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Buscar todas as jogadas
  static async getAllJogadas(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('jogadas')
      .select(`
        *,
        users!inner(full_name, email),
        raspadinhas!inner(nome)
      `, { count: 'exact' })
      .order('criado_em', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      jogadas: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Buscar todas as raspadinhas
  static async getAllRaspadinhas(): Promise<Raspadinha[]> {
    const { data, error } = await supabase
      .from('raspadinhas')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Criar raspadinha
  static async createRaspadinha(raspadinha: Omit<Raspadinha, 'id' | 'criado_em' | 'updated_at'>): Promise<Raspadinha> {
    const { data, error } = await supabase
      .from('raspadinhas')
      .insert(raspadinha)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Atualizar raspadinha
  static async updateRaspadinha(id: string, updates: Partial<Raspadinha>): Promise<Raspadinha> {
    const { data, error } = await supabase
      .from('raspadinhas')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Deletar raspadinha
  static async deleteRaspadinha(id: string): Promise<void> {
    const { error } = await supabase
      .from('raspadinhas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Upload de imagem
  static async uploadImage(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('raspadinhas')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('raspadinhas')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  // Buscar afiliados
  static async getAllAfiliados(): Promise<Afiliado[]> {
    const { data, error } = await supabase
      .from('afiliados')
      .select(`
        *,
        users!inner(full_name, email)
      `)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Atualizar créditos de usuário
  static async updateUserCredits(userId: string, newCredits: number, reason: string) {
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!user) throw new Error('Usuário não encontrado');

    const creditChange = newCredits - user.credits;

    const { error } = await supabase.rpc('update_user_credits', {
      user_id: userId,
      credit_change: creditChange,
      transaction_type: 'bonus',
      description: `Admin: ${reason}`
    });

    if (error) throw error;
  }

  // Alterar role de usuário
  static async updateUserRole(userId: string, newRole: 'user' | 'influencer' | 'admin') {
    const { data, error } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}