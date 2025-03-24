/*
  # Create demo user with hardcoded credentials

  1. Changes
    - Create demo user with email demo@tlco.ai
    - Set password to $4R-ln4u47[?
    - Assign demo role
    - Ensure user exists in agent_users table

  2. Security
    - Password is hashed using bcrypt
    - User has appropriate role and permissions
*/

-- Create demo user if it doesn't exist
DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Check if demo user exists
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@tlco.ai';

  -- If demo user doesn't exist, create it
  IF demo_user_id IS NULL THEN
    -- Insert demo user with password
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_token,
      confirmed_at,
      recovery_token,
      recovery_sent_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'demo@tlco.ai',
      crypt('$4R-ln4u47[?', gen_salt('bf')), -- Using the same password as Agent page
      now(),
      '',
      now(),
      '',
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}'
    )
    RETURNING id INTO demo_user_id;

    -- Ensure agent_users record exists
    INSERT INTO public.agent_users (id, email, username, role)
    VALUES (
      demo_user_id,
      'demo@tlco.ai',
      'demo',
      'demo'
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;