/*
  # Add account fields to agent_users table

  1. Changes
    - Add company field
    - Add phone field
    - Add notifications_enabled field
    - Add two_factor_enabled field

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to agent_users table
DO $$ 
BEGIN
  -- Add company field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_users' AND column_name = 'company'
  ) THEN
    ALTER TABLE agent_users ADD COLUMN company text;
  END IF;

  -- Add phone field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE agent_users ADD COLUMN phone text;
  END IF;

  -- Add notifications_enabled field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_users' AND column_name = 'notifications_enabled'
  ) THEN
    ALTER TABLE agent_users ADD COLUMN notifications_enabled boolean DEFAULT false;
  END IF;

  -- Add two_factor_enabled field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_users' AND column_name = 'two_factor_enabled'
  ) THEN
    ALTER TABLE agent_users ADD COLUMN two_factor_enabled boolean DEFAULT false;
  END IF;
END $$;