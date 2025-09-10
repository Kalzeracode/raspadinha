import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';
import bcrypt from 'bcryptjs';

export interface AuthResponse {
  user: User;
  token?: string;
}

export class AuthService {
  // Registro de usuário
  static async register(
    email: string, 
    password: string, 
    fullName: string, 
    phone?: string, 
    role: 'user' | 'influencer' = 'user',
    afiliadoCode?: string
  ): Promise<AuthResponse> {
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Buscar afiliado se código fornecido
      let afiliadoId = null;
      if (afiliadoCode) {
        const { data: afiliado } = await supabase
          .from('afiliados')
          .select('user_id')
          .eq('codigo', afiliadoCode)
          .eq('is_active', true)
          .single();
        
        if (afiliado) {
          afiliadoId = afiliado.user_id;
        }
      }

      // Inserir usuário
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          senha: hashedPassword,
          role,
          full_name: fullName,
          phone,
          afiliado_id: afiliadoId
        })
        .select()
        .single();

      if (error) throw error;

      // Se foi indicado por afiliado, atualizar contador
      if (afiliadoId) {
        await supabase.rpc('increment', {
          table_name: 'afiliados',
          row_id: afiliadoId,
          column_name: 'total_registros'
        });
      }

      // Criar afiliado se for influencer
      if (role === 'influencer') {
        const codigo = `INF${Date.now().toString().slice(-6)}`;
        await supabase
          .from('afiliados')
          .insert({
            user_id: user.id,
            nome: fullName,
            codigo
          });
      }

      return { user };
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar usuário');
    }
  }

  // Login de usuário
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.senha);
      if (!isValidPassword) {
        throw new Error('Credenciais inválidas');
      }

      // Remover senha do retorno
      const { senha, ...userWithoutPassword } = user;

      return { user: userWithoutPassword as User };
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  // Buscar usuário por ID
  static async getUserById(userId: string): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new Error('Usuário não encontrado');
    }

    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  // Atualizar perfil
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  // Atualizar créditos
  static async updateCredits(
    userId: string, 
    creditChange: number, 
    type: string, 
    description: string
  ) {
    const { error } = await supabase.rpc('update_user_credits', {
      user_id: userId,
      credit_change: creditChange,
      transaction_type: type,
      description
    });

    if (error) throw error;
  }

  // Buscar transações do usuário
  static async getUserTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('criado_em', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Buscar jogadas do usuário
  static async getUserJogadas(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('jogadas')
      .select(`
        *,
        raspadinhas(nome, premio)
      `)
      .eq('user_id', userId)
      .order('criado_em', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}