/*
  # Create rate plans table

  1. New Tables
    - `rate_plans`
      - `id` (uuid, primary key)
      - `carrier` (carrier_type) - References existing carrier enum
      - `plan_type` (text)
      - `plan` (text)
      - `price_per_line` (numeric)
      - `premium_data` (text)
      - `hotspot` (text)
      - `video_streaming` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to view plans
    - Add policy for admins to manage plans
*/

-- Create rate plans table
CREATE TABLE IF NOT EXISTS rate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier carrier_type NOT NULL,
  plan_type text NOT NULL,
  plan text NOT NULL,
  price_per_line numeric(10,2) NOT NULL,
  premium_data text,
  hotspot text,
  video_streaming text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_rate_plans_carrier ON rate_plans(carrier);
CREATE INDEX idx_rate_plans_plan_type ON rate_plans(plan_type);

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
COMMENT ON COLUMN rate_plans.carrier IS 'The carrier offering the plan';
COMMENT ON COLUMN rate_plans.plan_type IS 'The type/category of the plan';
COMMENT ON COLUMN rate_plans.plan IS 'The name/title of the plan';
COMMENT ON COLUMN rate_plans.price_per_line IS 'The price per line for the plan';
COMMENT ON COLUMN rate_plans.premium_data IS 'Premium data allocation details';
COMMENT ON COLUMN rate_plans.hotspot IS 'Mobile hotspot allocation details';
COMMENT ON COLUMN rate_plans.video_streaming IS 'Video streaming quality/details';