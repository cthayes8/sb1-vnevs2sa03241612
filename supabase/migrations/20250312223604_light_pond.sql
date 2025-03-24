/*
  # Create waitlist table and policies

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `company` (text)
      - `phone` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public to insert entries (if not exists)
    - Add policy for authenticated users to view entries (if not exists)
*/

-- Create the waitlist table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS waitlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    company text NOT NULL,
    phone text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'Anyone can join waitlist'
  ) THEN
    CREATE POLICY "Anyone can join waitlist"
      ON waitlist
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'Authenticated users can view waitlist'
  ) THEN
    CREATE POLICY "Authenticated users can view waitlist"
      ON waitlist
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;