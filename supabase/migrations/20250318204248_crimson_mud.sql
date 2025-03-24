/*
  # Add company and user management structure

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `carriers` (carrier_type array) - Stores which carriers the company can access
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `company_users`
      - `id` (uuid, primary key) 
      - `company_id` (uuid, references companies)
      - `user_id` (uuid, references agent_users)
      - `role` (text - admin/user)
      - `created_at` (timestamp)

  2. Changes
    - Add company_id to agent_users table
    - Add policies for company-based access control
    - Add policies for user management within companies

  3. Security
    - Enable RLS on new tables
    - Add policies for company management
    - Add policies for user management within companies
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  carriers carrier_type[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create company_users table for managing user roles within companies
CREATE TABLE IF NOT EXISTS company_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES agent_users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Enable RLS on company_users
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- Add company_id to agent_users
ALTER TABLE agent_users 
ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_users_company_id ON agent_users(company_id);

-- Create policies for companies table
CREATE POLICY "Company admins can view their company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  );

CREATE POLICY "Company admins can update their company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  );

-- Create policies for company_users table
CREATE POLICY "Company admins can manage users"
  ON company_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users admins
      WHERE admins.company_id = company_users.company_id
      AND admins.user_id = auth.uid()
      AND admins.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users admins
      WHERE admins.company_id = company_users.company_id
      AND admins.user_id = auth.uid()
      AND admins.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own company roles"
  ON company_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Update agent_users policies to respect company boundaries
CREATE POLICY "Company admins can manage users within their company"
  ON agent_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = agent_users.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = agent_users.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  );

-- Update resources policies to respect carrier access
CREATE POLICY "Users can only view resources for their company's carriers"
  ON resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_users
      JOIN companies ON companies.id = agent_users.company_id
      WHERE agent_users.id = auth.uid()
      AND resources.carrier = ANY(companies.carriers)
    )
  );

-- Update certified_devices policies to respect carrier access
CREATE POLICY "Users can only view devices for their company's carriers"
  ON certified_devices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_users
      JOIN companies ON companies.id = agent_users.company_id
      WHERE agent_users.id = auth.uid()
      AND certified_devices.carrier = ANY(companies.carriers)
    )
  );

-- Function to handle new company creation with initial admin
CREATE OR REPLACE FUNCTION create_company_with_admin(
  company_name text,
  company_carriers carrier_type[],
  admin_email text,
  admin_username text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id uuid;
  new_user_id uuid;
BEGIN
  -- Create the company
  INSERT INTO companies (name, carriers)
  VALUES (company_name, company_carriers)
  RETURNING id INTO new_company_id;

  -- Create the admin user
  INSERT INTO agent_users (
    id,
    email,
    username,
    role,
    company_id
  )
  VALUES (
    auth.uid(),
    admin_email,
    admin_username,
    'admin',
    new_company_id
  )
  RETURNING id INTO new_user_id;

  -- Create the company_users relationship
  INSERT INTO company_users (company_id, user_id, role)
  VALUES (new_company_id, new_user_id, 'admin');

  RETURN new_company_id;
END;
$$;