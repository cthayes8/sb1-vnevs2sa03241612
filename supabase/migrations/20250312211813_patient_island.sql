/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `company` (text)
      - `phone` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public to insert entries
    - Add policy for authenticated users to view entries
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  company text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public to insert waitlist entries
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view waitlist entries
CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);