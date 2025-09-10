import { supabase } from '../lib/supabase';
import type { Raspadinha, GameResult } from '../lib/supabase';

export interface GamePlayResult {
  won: boolean;
  prize: string;
  prize_value: number;
  credits_remaining: number;
}

export class GameService {
  // Buscar todas as raspadinhas ativas
  static async getRaspadinhas(): Promise<Raspadinha[]> {
    const { data, error } = await supabase
      .from('raspadinhas')
      .select('*')
      .eq('is_active', true)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Buscar raspadinha por ID
  static async getRaspadinhaById(id: string): Promise<Raspadinha> {
    const { data, error } = await supabase
      .from('raspadinhas')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Raspadinha não encontrada');
    }

    return data;
  }

  // Jogar raspadinha
  static async playGame(userId: string, raspadinhaId: string): Promise<GamePlayResult> {
    try {
      // Buscar dados da raspadinha
      const raspadinha = await this.getRaspadinhaById(raspadinhaId);
      
      // Verificar se usuário tem créditos suficientes
      const { data: user } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (!user || user.credits < raspadinha.custo) {
        throw new Error('Créditos insuficientes');
      }

      // Determinar se ganhou baseado nas chances
      const random = Math.random() * 100;
      const won = random <= raspadinha.chances;
      
      // Determinar valor do prêmio se ganhou
      let prizeValue = 0;
      if (won) {
        // Para prêmios em dinheiro, usar o valor configurado
        // Para prêmios físicos, pode ser 0 ou um valor simbólico
        prizeValue = raspadinha.premio_valor;
      }

      // Processar o jogo usando a função do banco
      const { data: result, error } = await supabase.rpc('process_game', {
        p_user_id: userId,
        p_raspadinha_id: raspadinhaId,
        p_won: won,
        p_prize_value: prizeValue
      });

      if (error) throw error;

      return result as GamePlayResult;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao processar jogo');
    }
  }

  // Buscar estatísticas do usuário
  static async getUserStats(userId: string) {
    const { data: stats, error } = await supabase
      .from('game_results')
      .select('won, prize_value')
      .eq('user_id', userId);

    if (error) throw error;

    const totalGames = stats?.length || 0;
    const totalWins = stats?.filter(s => s.won).length || 0;
    const totalWinnings = stats?.reduce((sum, s) => sum + (s.prize_value || 0), 0) || 0;

    return {
      totalGames,
      totalWins,
      totalWinnings,
      winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0
    };
  }
}