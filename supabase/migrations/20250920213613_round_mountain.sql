/*
  # Adicionar colunas para logos duplos e configurações de e-mail

  1. Novas Colunas na Tabela parishes
    - `logo_url_dark` (text) - Logo para fundos claros
    - `logo_url_light` (text) - Logo para fundos escuros
    - `cloudinary_public_id_dark` (text) - ID do Cloudinary para logo escuro
    - `cloudinary_public_id_light` (text) - ID do Cloudinary para logo claro

  2. Índices
    - Índices para otimizar consultas dos logos no Cloudinary

  3. Configurações de E-mail
    - Chaves para configurações SMTP na tabela system_settings
*/

-- Adicionar colunas para logos duplos
ALTER TABLE public.parishes 
ADD COLUMN IF NOT EXISTS logo_url_dark text,
ADD COLUMN IF NOT EXISTS logo_url_light text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_dark text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_light text;

-- Adicionar índices para otimização
CREATE INDEX IF NOT EXISTS parishes_logo_dark_idx ON public.parishes (cloudinary_public_id_dark);
CREATE INDEX IF NOT EXISTS parishes_logo_light_idx ON public.parishes (cloudinary_public_id_light);

-- Inserir configurações padrão de e-mail na tabela system_settings
INSERT INTO public.system_settings (key, value, description, is_encrypted, created_at, updated_at)
VALUES 
  ('smtp_host', '', 'Servidor SMTP para envio de e-mails', false, now(), now()),
  ('smtp_port', '587', 'Porta do servidor SMTP', false, now(), now()),
  ('smtp_email', '', 'E-mail remetente', false, now(), now()),
  ('smtp_password', '', 'Senha do e-mail', true, now(), now()),
  ('smtp_secure', 'true', 'Usar conexão segura (TLS)', false, now(), now()),
  ('smtp_enabled', 'false', 'Habilitar envio de e-mails', false, now(), now()),
  ('site_header_font_family', 'Inter', 'Fonte do cabeçalho do site', false, now(), now())
ON CONFLICT (key) DO NOTHING;