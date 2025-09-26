/*
  # Adicionar configurações do Hero

  1. Novas Configurações
    - `site_hero_title` - Título principal da seção hero
    - `site_hero_description` - Descrição principal da seção hero
  
  2. Funcionalidade
    - Permite editar os textos principais da página inicial
    - Integração com o painel administrativo
    - Cache automático para performance
*/

-- Inserir configurações padrão do hero se não existirem
INSERT INTO system_settings (key, value, description, is_encrypted, created_at, updated_at)
VALUES 
  ('site_hero_title', 'Tradição e Fé', 'Título principal da seção hero da página inicial', false, now(), now()),
  ('site_hero_description', 'Uma catedral histórica no coração de São Miguel Paulista, sendo referência de fé e tradição para toda a região. Um lugar sagrado onde gerações encontram paz e esperança.', 'Descrição principal da seção hero da página inicial', false, now(), now())
ON CONFLICT (key) DO NOTHING;