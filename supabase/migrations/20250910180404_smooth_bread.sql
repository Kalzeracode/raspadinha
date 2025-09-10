/*
  # Sistema completo de raspadinhas

  1. Novas Tabelas
    - `users` - Usuários do sistema com roles e afiliação
    - `raspadinhas` - Jogos disponíveis com imagens e prêmios
    - `jogadas` - Histórico de jogadas dos usuários
    - `afiliados` - Sistema de afiliação para influencers
    - `transactions` - Histórico de transações financeiras
    - `game_results` - Resultados detalhados dos jogos

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para cada role
    - Autenticação via Supabase Auth

  3. Storage
    - Bucket para imagens das raspadinhas
    - Políticas de acesso público para leitura
*/

-- Limpar tabelas existentes se necessário
DROP TABLE IF EXISTS game_results CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS jogadas CASCADE;
DROP TABLE IF EXISTS raspadinhas CASCADE;
DROP TABLE IF EXISTS afiliados CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Tabela de usuários principal
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  senha text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'influencer')),
  afiliado_id uuid REFERENCES users(id),
  full_name text,
  phone text,
  credits integer DEFAULT 20,
  total_spent integer DEFAULT 0,
  total_won numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  criado_em timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de afiliados (influencers)
CREATE TABLE IF NOT EXISTS afiliados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  codigo text UNIQUE NOT NULL,
  total_registros integer DEFAULT 0,
  ganhos numeric DEFAULT 0,
  comissao_percentual numeric DEFAULT 10.0,
  is_active boolean DEFAULT true,
  criado_em timestamptz DEFAULT now()
);

-- Tabela de raspadinhas
CREATE TABLE IF NOT EXISTS raspadinhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  imagem_url text,
  premio text NOT NULL,
  premio_valor numeric DEFAULT 0,
  chances numeric NOT NULL CHECK (chances >= 0 AND chances <= 100),
  custo integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  criado_em timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de jogadas
CREATE TABLE IF NOT EXISTS jogadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  raspadinha_id uuid REFERENCES raspadinhas(id) ON DELETE CASCADE,
  resultado text NOT NULL,
  premio_ganho text,
  premio_valor numeric DEFAULT 0,
  custo integer NOT NULL,
  criado_em timestamptz DEFAULT now()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'game', 'prize', 'bonus', 'commission')),
  amount integer NOT NULL,
  description text NOT NULL,
  balance_after integer NOT NULL,
  related_game_id uuid REFERENCES jogadas(id),
  criado_em timestamptz DEFAULT now()
);

-- Tabela de resultados de jogos (para analytics)
CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  raspadinha_id uuid REFERENCES raspadinhas(id) ON DELETE CASCADE,
  game_name text NOT NULL,
  cost integer NOT NULL,
  prize text,
  prize_value numeric DEFAULT 0,
  won boolean DEFAULT false,
  criado_em timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE afiliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE raspadinhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para afiliados
CREATE POLICY "Influencers can view own affiliate data" ON afiliados
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage affiliates" ON afiliados
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para raspadinhas
CREATE POLICY "Everyone can view active raspadinhas" ON raspadinhas
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage raspadinhas" ON raspadinhas
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para jogadas
CREATE POLICY "Users can view own jogadas" ON jogadas
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can insert own jogadas" ON jogadas
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all jogadas" ON jogadas
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can insert transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para game_results
CREATE POLICY "Users can view own game results" ON game_results
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can insert own game results" ON game_results
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all game results" ON game_results
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Inserir dados iniciais
INSERT INTO users (email, senha, role, full_name) VALUES 
('admin@raspadinhas.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrador'),
('influencer@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'influencer', 'Influencer Teste'),
('user@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Usuário Teste');

-- Inserir afiliado para o influencer
INSERT INTO afiliados (user_id, nome, codigo) 
SELECT id, 'Influencer Teste', 'INFL001' 
FROM users WHERE email = 'influencer@test.com';

-- Inserir raspadinhas iniciais
INSERT INTO raspadinhas (nome, premio, premio_valor, chances, custo) VALUES 
('Sorte Rápida', 'R$ 1.000', 1000, 15.0, 1),
('Tesouro Dourado', 'R$ 10.000', 10000, 8.0, 5),
('Fortuna Máxima', 'R$ 50.000', 50000, 3.0, 10),
('Mega Prêmio', 'Carro 0km', 80000, 1.0, 20),
('Brilho de Diamante', 'R$ 100.000', 100000, 0.5, 20);

-- Função para atualizar créditos do usuário
CREATE OR REPLACE FUNCTION update_user_credits(
  user_id uuid,
  credit_change integer,
  transaction_type text,
  description text
) RETURNS void AS $$
DECLARE
  current_credits integer;
  new_balance integer;
BEGIN
  -- Buscar créditos atuais
  SELECT credits INTO current_credits FROM users WHERE id = user_id;
  
  -- Calcular novo saldo
  new_balance := current_credits + credit_change;
  
  -- Atualizar créditos do usuário
  UPDATE users SET 
    credits = new_balance,
    total_spent = CASE WHEN credit_change < 0 THEN total_spent + ABS(credit_change) ELSE total_spent END,
    updated_at = now()
  WHERE id = user_id;
  
  -- Inserir transação
  INSERT INTO transactions (user_id, type, amount, description, balance_after)
  VALUES (user_id, transaction_type, credit_change, description, new_balance);
END;
$$ LANGUAGE plpgsql;

-- Função para processar jogada
CREATE OR REPLACE FUNCTION process_game(
  p_user_id uuid,
  p_raspadinha_id uuid,
  p_won boolean,
  p_prize_value numeric DEFAULT 0
) RETURNS json AS $$
DECLARE
  raspadinha_data record;
  user_data record;
  result_data json;
  prize_credits integer;
BEGIN
  -- Buscar dados da raspadinha
  SELECT * INTO raspadinha_data FROM raspadinhas WHERE id = p_raspadinha_id;
  
  -- Buscar dados do usuário
  SELECT * INTO user_data FROM users WHERE id = p_user_id;
  
  -- Verificar se usuário tem créditos suficientes
  IF user_data.credits < raspadinha_data.custo THEN
    RAISE EXCEPTION 'Créditos insuficientes';
  END IF;
  
  -- Debitar custo do jogo
  PERFORM update_user_credits(
    p_user_id, 
    -raspadinha_data.custo, 
    'game', 
    'Jogo: ' || raspadinha_data.nome
  );
  
  -- Se ganhou, creditar prêmio
  IF p_won AND p_prize_value > 0 THEN
    prize_credits := p_prize_value::integer;
    PERFORM update_user_credits(
      p_user_id,
      prize_credits,
      'prize',
      'Prêmio: ' || raspadinha_data.nome
    );
  END IF;
  
  -- Registrar jogada
  INSERT INTO jogadas (user_id, raspadinha_id, resultado, premio_ganho, premio_valor, custo)
  VALUES (
    p_user_id, 
    p_raspadinha_id, 
    CASE WHEN p_won THEN 'ganhou' ELSE 'perdeu' END,
    CASE WHEN p_won THEN raspadinha_data.premio ELSE NULL END,
    CASE WHEN p_won THEN p_prize_value ELSE 0 END,
    raspadinha_data.custo
  );
  
  -- Registrar resultado para analytics
  INSERT INTO game_results (user_id, raspadinha_id, game_name, cost, prize, prize_value, won)
  VALUES (
    p_user_id,
    p_raspadinha_id,
    raspadinha_data.nome,
    raspadinha_data.custo,
    CASE WHEN p_won THEN raspadinha_data.premio ELSE NULL END,
    CASE WHEN p_won THEN p_prize_value ELSE 0 END,
    p_won
  );
  
  -- Retornar resultado
  SELECT json_build_object(
    'won', p_won,
    'prize', CASE WHEN p_won THEN raspadinha_data.premio ELSE 'Tente novamente' END,
    'prize_value', CASE WHEN p_won THEN p_prize_value ELSE 0 END,
    'credits_remaining', (SELECT credits FROM users WHERE id = p_user_id)
  ) INTO result_data;
  
  RETURN result_data;
END;
$$ LANGUAGE plpgsql;

-- Criar bucket para imagens (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('raspadinhas', 'raspadinhas', true)
ON CONFLICT (id) DO NOTHING;

-- Política para upload de imagens (apenas admins)
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'raspadinhas' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para visualizar imagens (público)
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'raspadinhas');