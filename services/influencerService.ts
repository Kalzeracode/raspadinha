import { supabase } from '../lib/supabase';
import type { Afiliado } from '../lib/supabase';

export interface InfluencerStats {
  totalReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  monthlyReferrals: number;
  monthlyEarnings: number;
}

export class InfluencerService {
  // Buscar dados do afiliado
  static async getAfiliadoByUserId(userId: string): Promise<Afiliado> {
    const { data, error } = await supabase
      .from('afiliados')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Dados de afiliado não encontrados');
    }

    return data;
  }

  // Buscar estatísticas do influencer
  static async getInfluencerStats(userId: string): Promise<InfluencerStats> {
    const afiliado = await this.getAfiliadoByUserId(userId);
    
    // Buscar usuários referenciados
    const { data: referrals } = await supabase
      .from('users')
      .select('criado_em, total_spent')
      .eq('afiliado_id', userId);

    const totalReferrals = referrals?.length || 0;
    
    // Calcular ganhos (comissão sobre gastos dos referenciados)
    const totalSpentByReferrals = referrals?.reduce((sum, user) => sum + user.total_spent, 0) || 0;
    const totalEarnings = (totalSpentByReferrals * afiliado.comissao_percentual) / 100;

    // Estatísticas do mês atual
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyReferrals = referrals?.filter(r => 
      r.criado_em.startsWith(currentMonth)
    ).length || 0;

    const monthlySpent = referrals?.filter(r => 
      r.criado_em.startsWith(currentMonth)
    ).reduce((sum, user) => sum + user.total_spent, 0) || 0;

    const monthlyEarnings = (monthlySpent * afiliado.comissao_percentual) / 100;

    return {
      totalReferrals,
      totalEarnings,
      conversionRate: totalReferrals > 0 ? (totalReferrals / 100) * 100 : 0, // Simplificado
      monthlyReferrals,
      monthlyEarnings
    };
  }

  // Buscar usuários referenciados
  static async getReferredUsers(userId: string, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('users')
      .select('id, email, full_name, total_spent, criado_em', { count: 'exact' })
      .eq('afiliado_id', userId)
      .order('criado_em', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Gerar link de afiliado
  static generateAffiliateLink(codigo: string, baseUrl: string = window.location.origin): string {
    return `${baseUrl}/register?ref=${codigo}`;
  }

  // Atualizar dados do afiliado
  static async updateAfiliado(userId: string, updates: Partial<Afiliado>): Promise<Afiliado> {
    const { data, error } = await supabase
      .from('afiliados')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}