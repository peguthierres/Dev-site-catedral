/*
  # Add dual logo columns and email settings

  1. New Columns
    - `logo_url_dark` (text) - Logo for light backgrounds
    - `logo_url_light` (text) - Logo for dark backgrounds  
    - `cloudinary_public_id_dark` (text) - Cloudinary ID for dark logo
    - `cloudinary_public_id_light` (text) - Cloudinary ID for light logo

  2. Email Settings
    - SMTP configuration settings for contact form
    - Font family setting for header customization

  3. Indexes
    - Performance indexes for logo lookups
*/

-- Add dual logo columns to parishes table
ALTER TABLE public.parishes 
ADD COLUMN IF NOT EXISTS logo_url_dark text,
ADD COLUMN IF NOT EXISTS logo_url_light text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_dark text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_light text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS parishes_logo_dark_idx ON public.parishes (cloudinary_public_id_dark);
CREATE INDEX IF NOT EXISTS parishes_logo_light_idx ON public.parishes (cloudinary_public_id_light);

-- Insert email and theme settings
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