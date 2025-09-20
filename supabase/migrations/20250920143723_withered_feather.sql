/*
  # Fix system_settings table constraint

  1. Database Changes
    - Add unique constraint on 'key' column in system_settings table
    - This fixes the upsert operation for theme settings
  
  2. Security
    - Maintain existing RLS policies
    - No changes to permissions
*/

-- Add unique constraint to system_settings.key column
ALTER TABLE public.system_settings 
ADD CONSTRAINT IF NOT EXISTS system_settings_key_unique UNIQUE (key);

-- Ensure the table has proper defaults and constraints
DO $$
BEGIN
  -- Add primary key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'system_settings' 
    AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.system_settings ADD PRIMARY KEY (id);
  END IF;
  
  -- Ensure created_at has default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' 
    AND column_name = 'created_at' 
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE public.system_settings 
    ALTER COLUMN created_at SET DEFAULT now();
  END IF;
  
  -- Ensure updated_at has default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_settings' 
    AND column_name = 'updated_at' 
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE public.system_settings 
    ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;