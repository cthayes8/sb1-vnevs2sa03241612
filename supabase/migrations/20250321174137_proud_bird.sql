/*
  # Fix rate plans table structure

  1. Changes
    - Drop and recreate rate plans table with correct column casing
    - Ensure column names match the frontend code
    - Maintain existing policies and indexes

  2. Security
    - Preserve RLS policies
    - Keep existing access controls
*/

-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS rate_plans;

CREATE TABLE rate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "Carrier" carrier_type NOT NULL,
  "Plan Type" text NOT NULL,
  "Plan" text NOT NULL,
  "Price Per Line" numeric(10,2) NOT NULL,
  "Premium Data" text,
  "Hotspot" text,
  "Video Streaming" text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_rate_plans_carrier ON rate_plans("Carrier");
CREATE INDEX idx_rate_plans_plan_type ON rate_plans("Plan Type");

-- Enable RLS
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_rate_plans_updated_at
  BEFORE UPDATE ON rate_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Authenticated users can view rate plans"
  ON rate_plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage rate plans"
  ON rate_plans
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

-- Add helpful comments
COMMENT ON TABLE rate_plans IS 'Stores carrier rate plan information';
COMMENT ON COLUMN rate_plans."Carrier" IS 'The carrier offering the plan';
COMMENT ON COLUMN rate_plans."Plan Type" IS 'The type/category of the plan';
COMMENT ON COLUMN rate_plans."Plan" IS 'The name/title of the plan';
COMMENT ON COLUMN rate_plans."Price Per Line" IS 'The price per line for the plan';
COMMENT ON COLUMN rate_plans."Premium Data" IS 'Premium data allocation details';
COMMENT ON COLUMN rate_plans."Hotspot" IS 'Mobile hotspot allocation details';
COMMENT ON COLUMN rate_plans."Video Streaming" IS 'Video streaming quality/details';