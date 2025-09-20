/*
  # Add dual logo columns to parishes table

  1. New Columns
    - `logo_url_dark` (text, nullable) - Logo for light backgrounds
    - `logo_url_light` (text, nullable) - Logo for dark backgrounds
    - `cloudinary_public_id_dark` (text, nullable) - Cloudinary ID for dark logo
    - `cloudinary_public_id_light` (text, nullable) - Cloudinary ID for light logo

  2. Purpose
    - Allows different logos for different background contexts
    - Ensures optimal visibility in all scenarios
    - Maintains backward compatibility with existing logo_url
*/

-- Add new logo columns to parishes table
ALTER TABLE public.parishes 
ADD COLUMN IF NOT EXISTS logo_url_dark text,
ADD COLUMN IF NOT EXISTS logo_url_light text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_dark text,
ADD COLUMN IF NOT EXISTS cloudinary_public_id_light text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS parishes_logo_dark_idx ON public.parishes (cloudinary_public_id_dark);
CREATE INDEX IF NOT EXISTS parishes_logo_light_idx ON public.parishes (cloudinary_public_id_light);