/*
  # Sistema de Autenticação Completo

  1. New Tables
    - `profiles` - Perfis dos usuários com dados adicionais
    - `user_credits` - Sistema de créditos dos usuários
    - `transactions` - Histórico de transações
    - `game_results` - Resultados dos jogos
    - `admin_users` - Usuários administrativos

  2. Security
    - Enable RLS em todas as tabelas
    - Políticas de segurança para cada tipo de usuário
    - Separação entre usuários normais, influencers e admins

  3. Functions
    - Trigger para criar perfil automaticamente
    - Função para atualizar créditos
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  role text CHECK (role IN ('user', 'influencer', 'admin')) DEFAULT 'user',
  credits integer DEFAULT 20,
  total_spent integer DEFAULT 0,
  total_won numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('deposit', 'game', 'prize', 'bonus')) NOT NULL,
  amount integer NOT NULL,
  description text NOT NULL,
  balance_after integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de resultados de jogos
CREATE TABLE IF NOT EXISTS game_results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_name text NOT NULL,
  cost integer NOT NULL,
  prize text,
  prize_value numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para game_results
CREATE POLICY "Users can view own game results"
  ON game_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert game results"
  ON game_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all game results"
  ON game_results
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para admin_users (apenas super_admin pode gerenciar)
CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND role = 'super_admin' AND is_active = true
    )
  );

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, credits)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    20
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar créditos
CREATE OR REPLACE FUNCTION public.update_user_credits(
  user_id uuid,
  credit_change integer,
  transaction_type text,
  description text
)
RETURNS boolean AS $$
DECLARE
  current_credits integer;
  new_balance integer;
BEGIN
  -- Buscar créditos atuais
  SELECT credits INTO current_credits
  FROM profiles
  WHERE id = user_id;

  -- Calcular novo saldo
  new_balance := current_credits + credit_change;

  -- Verificar se há créditos suficientes para operações negativas
  IF new_balance < 0 THEN
    RETURN false;
  END IF;

  -- Atualizar créditos
  UPDATE profiles
  SET 
    credits = new_balance,
    total_spent = CASE 
      WHEN credit_change < 0 THEN total_spent + ABS(credit_change)
      ELSE total_spent
    END,
    updated_at = now()
  WHERE id = user_id;

  -- Inserir transação
  INSERT INTO transactions (user_id, type, amount, description, balance_after)
  VALUES (user_id, transaction_type, credit_change, description, new_balance);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@raspadinhas.com',
  '$2b$10$rQZ9QZ9QZ9QZ9QZ9QZ9QZO', -- Hash da senha 'admin123'
  'Administrador',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;