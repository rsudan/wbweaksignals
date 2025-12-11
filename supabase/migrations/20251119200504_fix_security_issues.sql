/*
  # Fix Security Issues

  1. Changes
    - Remove unused index `scans_title_idx` (not being used for queries)
    - Fix function `update_scans_updated_at` to have immutable search_path
    
  2. Security
    - Addresses function search path mutability vulnerability
    - Removes unused index to improve maintenance and performance
*/

-- Drop the unused title index
DROP INDEX IF EXISTS scans_title_idx;

-- Recreate the function with secure search_path
CREATE OR REPLACE FUNCTION update_scans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public;