/*
  # Create scans history table

  1. New Tables
    - `scans`
      - `id` (uuid, primary key) - Unique identifier for each scan
      - `title` (text) - User-editable title for the scan
      - `domain` (text) - Domain/sector that was searched
      - `geography` (text) - Geographic region
      - `timeline` (text) - Timeline scope
      - `detailed_context` (text, nullable) - Additional context provided
      - `signals` (jsonb) - Array of weak signals discovered
      - `created_at` (timestamptz) - When the scan was created
      - `updated_at` (timestamptz) - When the scan was last updated
  
  2. Security
    - Enable RLS on `scans` table
    - For now, allow public access since there's no auth yet
    - This can be restricted later when auth is added
  
  3. Indexes
    - Index on created_at for efficient sorting
    - Index on title for search functionality
*/

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  domain text NOT NULL DEFAULT '',
  geography text NOT NULL DEFAULT '',
  timeline text NOT NULL DEFAULT '',
  detailed_context text,
  signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for efficient sorting by date
CREATE INDEX IF NOT EXISTS scans_created_at_idx ON scans(created_at DESC);

-- Add index for title search
CREATE INDEX IF NOT EXISTS scans_title_idx ON scans(title);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (can be restricted when auth is added)
CREATE POLICY "Allow all access to scans"
  ON scans
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_scans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_scans_updated_at_trigger ON scans;
CREATE TRIGGER update_scans_updated_at_trigger
  BEFORE UPDATE ON scans
  FOR EACH ROW
  EXECUTE FUNCTION update_scans_updated_at();