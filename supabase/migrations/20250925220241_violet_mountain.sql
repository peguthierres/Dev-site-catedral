/*
  # Adicionar campos de contato e horários para a Capela São Miguel

  1. Novos Campos
    - `capela_phone` (text) - Telefone de contato da capela
    - `capela_email` (text) - E-mail de contato da capela
    - `capela_whatsapp` (text) - WhatsApp da capela
    - `capela_mass_schedule` (text) - Horários das missas
    - `capela_visiting_hours` (text) - Horários de visitação
    - `capela_services_info` (text) - Informações sobre atendimentos
    - `capela_contact_person` (text) - Pessoa responsável pelo contato

  2. Configurações
    - Adiciona configurações padrão para todos os novos campos
    - Mantém compatibilidade com configurações existentes
*/

-- Inserir configurações de contato da capela
INSERT INTO system_settings (key, value, description, is_encrypted, created_at, updated_at) VALUES
('capela_phone', '(11) 2032-4160', 'Telefone de contato da Capela São Miguel', false, now(), now()),
('capela_email', 'capela@catedralsaomiguel.com.br', 'E-mail de contato da Capela São Miguel', false, now(), now()),
('capela_whatsapp', '11999999999', 'WhatsApp da Capela São Miguel', false, now(), now()),
('capela_contact_person', 'Secretaria da Capela', 'Pessoa responsável pelo atendimento na capela', false, now(), now()),
('capela_mass_schedule', 'Domingo: 8h, 10h, 19h
Segunda a Sexta: 19h30
Sábado: 19h', 'Horários das missas na Capela São Miguel', false, now(), now()),
('capela_visiting_hours', 'Segunda a Sexta: 9h às 17h
Sábado: 9h às 12h
Domingo: 8h às 20h
Feriados: Consultar', 'Horários de visitação da Capela São Miguel', false, now(), now()),
('capela_services_info', 'Serviços Disponíveis:
• Missas e celebrações
• Confissões (30 min antes das missas)
• Batizados (agendar com antecedência)
• Casamentos (agendar com 6 meses de antecedência)
• Visitas guiadas para grupos (agendar)
• Bênçãos especiais
• Orientação espiritual

Documentos Necessários:
• Para batizados: certidão de nascimento
• Para casamentos: documentação completa
• Para visitas em grupo: agendamento prévio

Observações:
• Entrada gratuita para visitação
• Respeitar o silêncio durante as celebrações
• Fotografias permitidas (sem flash durante missas)', 'Informações sobre atendimentos e serviços da Capela São Miguel', false, now(), now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();