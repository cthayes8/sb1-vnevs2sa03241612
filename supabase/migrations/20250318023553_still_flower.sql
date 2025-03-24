/*
  # Create agent users table and authentication setup

  1. New Tables
    - `agent_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `username` (text, unique)
      - `role` (text)
      - `created_at` (timestamp)
      - `last_login` (timestamp)

  2. Security
    - Enable RLS on `agent_users` table
    - Add policy for authenticated users to read their own data
    - Add policy for admin to manage all users
*/

-- Create agent_users table
CREATE TABLE IF NOT EXISTS agent_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'agent',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agent_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON agent_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage all users"
  ON agent_users
  FOR ALL
  TO authenticated
  USING (role = 'admin')
  WITH CHECK (role = 'admin');

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.agent_users (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    CASE 
      WHEN NEW.email = 'demo@tlco.ai' THEN 'demo'
      ELSE 'agent'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert demo user if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'demo@tlco.ai'
  ) THEN
    -- Note: The password will be set through the Supabase dashboard or API
    -- This just creates the base user record
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'demo@tlco.ai',
      crypt('PLACEHOLDER', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;
END $$;