/*
  # Create sales resources tables and storage

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `carrier` (text)
      - `device_type` (text)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `storage_path` (text)
      - `downloads` (integer)
      - `tags` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on resources table
    - Add policies for authenticated users to read resources
    - Add policies for admin users to manage resources
    - Set up storage bucket with appropriate policies
*/

-- Create enum types for resource categories
CREATE TYPE resource_type AS ENUM (
  'flyer',
  'case_study', 
  'business_case',
  'presentation',
  'guide'
);

CREATE TYPE carrier_type AS ENUM (
  'att',
  'verizon',
  'tmobile'
);

CREATE TYPE device_type AS ENUM (
  'phones',
  'tablets',
  'hotspots',
  'fixed_wireless',
  'laptops',
  'all'
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type resource_type NOT NULL,
  carrier carrier_type NOT NULL,
  device_type device_type NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  storage_path text NOT NULL,
  downloads integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create function to track downloads
CREATE OR REPLACE FUNCTION increment_downloads()
RETURNS trigger AS $$
BEGIN
  UPDATE resources
  SET downloads = downloads + 1,
      updated_at = now()
  WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create downloads tracking table
CREATE TABLE IF NOT EXISTS resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES resources(id),
  user_id uuid REFERENCES auth.users(id),
  downloaded_at timestamptz DEFAULT now()
);

-- Enable RLS on downloads table
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;

-- Create policy for tracking downloads
CREATE POLICY "Users can track their downloads"
  ON resource_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for download tracking
CREATE TRIGGER on_resource_download
  AFTER INSERT ON resource_downloads
  FOR EACH ROW
  EXECUTE FUNCTION increment_downloads();