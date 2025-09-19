/*
  # Adicionar configurações de tema personalizável

  1. Novas Configurações
    - Cores primárias (início e fim do gradiente)
    - Cores secundárias (início e fim do gradiente)
    - Cores de texto (claro e escuro)
    - Cores de fundo (claro e escuro)
    - Cores de destaque/accent
    - Opções para usar gradientes ou cores sólidas

  2. Sistema
    - Permite personalização completa das cores do site
    - Suporte a gradientes e cores sólidas
    - Configurações salvas na tabela system_settings
*/

-- Inserir configurações padrão de tema
INSERT INTO system_settings (key, value, description, is_encrypted, created_at, updated_at) VALUES
('site_primary_color_from', '#7F1D1D', 'Cor primária inicial (gradiente)', false, now(), now()),
('site_primary_color_to', '#991B1B', 'Cor primária final (gradiente)', false, now(), now()),
('site_use_primary_gradient', 'true', 'Usar gradiente para cor primária', false, now(), now()),
('site_secondary_color_from', '#1E40AF', 'Cor secundária inicial (gradiente)', false, now(), now()),
('site_secondary_color_to', '#1E3A8A', 'Cor secundária final (gradiente)', false, now(), now()),
('site_use_secondary_gradient', 'true', 'Usar gradiente para cor secundária', false, now(), now()),
('site_text_color_dark', '#374151', 'Cor do texto escuro', false, now(), now()),
('site_text_color_light', '#FFFFFF', 'Cor do texto claro', false, now(), now()),
('site_background_color_light', '#F9FAFB', 'Cor de fundo claro', false, now(), now()),
('site_background_color_dark', '#002C53', 'Cor de fundo escuro', false, now(), now()),
('site_accent_color_1', '#D97706', 'Cor de destaque 1', false, now(), now()),
('site_accent_color_2', '#FCD34D', 'Cor de destaque 2', false, now(), now()),
('site_button_text_color', '#FFFFFF', 'Cor do texto dos botões', false, now(), now()),
('site_header_text_color', '#FFFFFF', 'Cor do texto do cabeçalho', false, now(), now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = EXCLUDED.updated_at;