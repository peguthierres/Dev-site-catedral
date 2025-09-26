/*
  # Adicionar campo de horários de atendimento

  1. Modificações na Tabela
    - `parishes`
      - Adiciona coluna `business_hours` (text, nullable)
      - Para armazenar horários de atendimento editáveis

  2. Segurança
    - Mantém RLS existente
    - Não afeta políticas de segurança
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'parishes' AND column_name = 'business_hours'
  ) THEN
    ALTER TABLE parishes ADD COLUMN business_hours text;
  END IF;
END $$;