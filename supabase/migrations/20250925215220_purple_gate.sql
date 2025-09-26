/*
  # Configurações da Capela São Miguel

  1. New Settings
    - `capela_enabled` (boolean) - Se a página da capela está habilitada
    - `capela_title` (text) - Título da capela
    - `capela_subtitle` (text) - Subtítulo da capela
    - `capela_description` (text) - Descrição principal
    - `capela_history` (text) - História completa da capela
    - `capela_founded_year` (number) - Ano de fundação
    - `capela_tombamento_year` (number) - Ano do tombamento
    - `capela_tombamento_process` (text) - Processo de tombamento
    - `capela_location` (text) - Localização da capela
    - `capela_popular_name` (text) - Nome popular
    - `capela_image_url` (text) - URL da imagem principal
    - `capela_cloudinary_public_id` (text) - ID do Cloudinary para a imagem

  2. Default Values
    - Valores padrão baseados nas informações fornecidas sobre a Capela São Miguel
</*/

-- Inserir configurações padrão da Capela São Miguel
INSERT INTO system_settings (key, value, description, is_encrypted, created_at, updated_at) VALUES
('capela_enabled', 'true', 'Se a página da capela está habilitada', false, now(), now()),
('capela_title', 'Capela São Miguel', 'Título principal da capela', false, now(), now()),
('capela_subtitle', 'Igreja de São Miguel Paulista', 'Subtítulo da capela', false, now(), now()),
('capela_description', 'O templo religioso mais antigo da cidade de São Paulo, construído pelos índios guaianás catequizados pelos jesuítas em 1560.', 'Descrição principal da capela', false, now(), now()),
('capela_history', 'Igreja de São Miguel Paulista ou Capela de São Miguel Arcanjo, conhecida popularmente como Capela dos Índios, é o templo religioso mais antigo da cidade de São Paulo. Localizada na Praça Padre Aleixo Monteiro Mafra (Praça do Forró), no distrito de São Miguel Paulista, Zona Leste da capital paulista, a capela foi construída pelos índios guaianás catequizados pelos jesuítas, em 1560.

Durante escavações em seu interior foram encontrados diversos objetos antigos e ossadas, revelando a rica história arqueológica do local.

Foi tombada em 1938 a partir do processo de número 180-T, inscrição de número 109 no Livro Histórico e inscrição de número 219 no Livro Belas Artes.

São Miguel faz parte da alta hierarquia dos anjos e seus cultos pede proteção e iluminação ao caminho de Deus. A capela representa não apenas um marco histórico, mas um símbolo da fé que une passado e presente em nossa comunidade.', 'História completa da capela', false, now(), now()),
('capela_founded_year', '1560', 'Ano de fundação da capela', false, now(), now()),
('capela_tombamento_year', '1938', 'Ano do tombamento da capela', false, now(), now()),
('capela_tombamento_process', 'Processo 180-T, inscrição 109 no Livro Histórico e 219 no Livro Belas Artes', 'Detalhes do processo de tombamento', false, now(), now()),
('capela_location', 'Praça Padre Aleixo Monteiro Mafra (Praça do Forró), São Miguel Paulista, São Paulo', 'Localização da capela', false, now(), now()),
('capela_popular_name', 'Capela dos Índios', 'Nome popular da capela', false, now(), now()),
('capela_image_url', '', 'URL da imagem principal da capela', false, now(), now()),
('capela_cloudinary_public_id', '', 'ID do Cloudinary para a imagem da capela', false, now(), now())
ON CONFLICT (key) DO NOTHING;