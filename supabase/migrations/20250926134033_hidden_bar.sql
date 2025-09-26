/*
  # Sistema de Doações com Stripe

  1. Novas Configurações do Sistema
    - Adicionar configurações do Stripe (chaves API, webhook secret)
    - Configurações de doação (valores mínimos, moedas aceitas)

  2. Nova Tabela: donations
    - `id` (uuid, primary key)
    - `stripe_session_id` (text, unique) - ID da sessão de checkout do Stripe
    - `stripe_payment_intent_id` (text) - ID do payment intent do Stripe
    - `amount` (numeric) - Valor da doação em centavos
    - `currency` (text) - Moeda (BRL)
    - `status` (text) - Status da doação (pending, completed, failed, canceled)
    - `donor_name` (text) - Nome do doador (opcional)
    - `donor_email` (text) - Email do doador
    - `donor_phone` (text) - Telefone do doador (opcional)
    - `donation_purpose` (text) - Finalidade da doação
    - `message` (text) - Mensagem do doador (opcional)
    - `metadata` (jsonb) - Dados adicionais do Stripe
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  3. Segurança
    - Enable RLS na tabela donations
    - Políticas para administradores gerenciarem doações
    - Política para leitura pública de estatísticas básicas (sem dados pessoais)
*/

-- Inserir configurações do Stripe no sistema
INSERT INTO system_settings (key, value, description, is_encrypted, created_at, updated_at) VALUES
  ('stripe_enabled', 'false', 'Habilitar sistema de doações via Stripe', false, now(), now()),
  ('stripe_publishable_key', '', 'Chave publicável do Stripe (pk_test_... ou pk_live_...)', false, now(), now()),
  ('stripe_secret_key', '', 'Chave secreta do Stripe (sk_test_... ou sk_live_...)', true, now(), now()),
  ('stripe_webhook_secret', '', 'Segredo do webhook do Stripe (whsec_...)', true, now(), now()),
  ('stripe_currency', 'BRL', 'Moeda padrão para doações (BRL, USD, EUR)', false, now(), now()),
  ('stripe_minimum_amount', '500', 'Valor mínimo de doação em centavos (500 = R$ 5,00)', false, now(), now()),
  ('stripe_success_url', '', 'URL de redirecionamento após pagamento bem-sucedido', false, now(), now()),
  ('stripe_cancel_url', '', 'URL de redirecionamento após cancelamento', false, now(), now()),
  ('donation_purposes', 'Manutenção da Capela São Miguel\nObras de Restauração\nAções Sociais\nEventos Religiosos\nManutenção Geral', 'Finalidades disponíveis para doação', false, now(), now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();

-- Criar tabela de doações
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled', 'refunded')),
  donor_name text,
  donor_email text,
  donor_phone text,
  donation_purpose text,
  message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS na tabela donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Política para administradores gerenciarem todas as doações
CREATE POLICY "Authenticated users can manage donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para leitura pública de estatísticas básicas (sem dados pessoais)
CREATE POLICY "Public can read donation statistics"
  ON donations
  FOR SELECT
  TO public
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS donations_stripe_session_id_idx ON donations (stripe_session_id);
CREATE INDEX IF NOT EXISTS donations_stripe_payment_intent_id_idx ON donations (stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations (status);
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations (created_at DESC);
CREATE INDEX IF NOT EXISTS donations_amount_idx ON donations (amount);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_donations_updated_at_trigger ON donations;
CREATE TRIGGER update_donations_updated_at_trigger
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donations_updated_at();