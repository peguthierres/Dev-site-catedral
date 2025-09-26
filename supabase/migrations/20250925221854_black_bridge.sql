/*
  # Configurações de Doação da Capela São Miguel

  1. New Settings
    - Configurações específicas para doações da capela
    - Informações de PIX, transferência bancária e outros meios
    - Textos personalizáveis para a página de doação
    - Configurações do Stripe para cartão de crédito

  2. Security
    - Configurações não criptografadas (exceto chaves do Stripe)
    - Acessível publicamente para informações de doação
*/

-- Configurações de doação da Capela São Miguel
INSERT INTO system_settings (key, value, description, is_encrypted) VALUES
('capela_donation_enabled', 'true', 'Habilitar página de doações da capela', false),
('capela_donation_title', 'Colabore com a Capela São Miguel', 'Título da página de doações', false),
('capela_donation_subtitle', 'Ajude a preservar o templo mais antigo de São Paulo', 'Subtítulo da página de doações', false),
('capela_donation_description', 'Sua doação é fundamental para a manutenção e preservação da Capela São Miguel, um patrimônio histórico de mais de 460 anos. Cada contribuição ajuda na conservação deste templo sagrado para as futuras gerações.', 'Descrição principal da página de doações', false),

-- Informações de PIX
('capela_pix_key', '', 'Chave PIX da capela (CNPJ, e-mail, telefone ou chave aleatória)', false),
('capela_pix_name', 'Capela São Miguel Arcanjo', 'Nome do beneficiário do PIX', false),
('capela_pix_description', 'Doação para manutenção da Capela São Miguel', 'Descrição que aparece no PIX', false),

-- Informações bancárias
('capela_bank_name', '', 'Nome do banco', false),
('capela_bank_agency', '', 'Agência bancária', false),
('capela_bank_account', '', 'Número da conta', false),
('capela_bank_account_type', 'Conta Corrente', 'Tipo da conta (Corrente/Poupança)', false),
('capela_bank_cnpj', '', 'CNPJ da capela', false),

-- Outros meios de doação
('capela_donation_methods', 'PIX (instantâneo)\nTransferência Bancária\nCartão de Crédito (em breve)\nDoação Presencial na Capela', 'Métodos de doação disponíveis', false),
('capela_donation_purposes', 'Manutenção do patrimônio histórico\nRestauração de elementos arquitetônicos\nConservação dos vitrais centenários\nMelhorias na infraestrutura\nAções sociais da capela\nEventos e celebrações especiais', 'Finalidades das doações', false),

-- Configurações do Stripe (preparação)
('capela_stripe_enabled', 'false', 'Habilitar doações via cartão de crédito (Stripe)', false),
('capela_stripe_public_key', '', 'Chave pública do Stripe para a capela', true),
('capela_stripe_secret_key', '', 'Chave secreta do Stripe para a capela', true),
('capela_stripe_webhook_secret', '', 'Secret do webhook do Stripe', true),

-- Textos personalizáveis
('capela_donation_thanks_message', 'Muito obrigado pela sua generosidade! Sua doação será fundamental para a preservação da Capela São Miguel, o templo mais antigo de São Paulo.', 'Mensagem de agradecimento após doação', false),
('capela_donation_contact_info', 'Para dúvidas sobre doações, entre em contato:\nTelefone: (11) 2032-4160\nE-mail: doacoes@catedralsaomiguel.com.br\nWhatsApp: (11) 99999-9999', 'Informações de contato para dúvidas sobre doações', false),

-- Configurações de valores sugeridos
('capela_suggested_amounts', '25,50,100,200,500', 'Valores sugeridos para doação (separados por vírgula)', false),
('capela_minimum_amount', '10', 'Valor mínimo para doação via cartão', false),

-- Configurações de transparência
('capela_transparency_enabled', 'true', 'Mostrar seção de transparência', false),
('capela_transparency_text', 'Todas as doações são utilizadas exclusivamente para a manutenção e preservação da Capela São Miguel. Relatórios de prestação de contas estão disponíveis mediante solicitação.', 'Texto sobre transparência das doações', false)

ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = EXCLUDED.updated_at;