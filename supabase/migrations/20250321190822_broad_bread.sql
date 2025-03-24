/*
  # Update rate plans table structure

  1. Changes
    - Add device_type field to rate plans
    - Add plan_features field for additional details
    - Add plan_category for better organization
    - Add plan_order for custom sorting
    - Add active flag to manage plan visibility

  2. Security
    - Maintain existing RLS policies
*/

-- Drop and recreate rate plans table with updated structure
DROP TABLE IF EXISTS rate_plans;

CREATE TABLE rate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "Carrier" carrier_type NOT NULL,
  "Device Type" device_type NOT NULL,
  "Plan Category" text NOT NULL, -- e.g., 'Business Elite', 'Business Advanced', etc.
  "Plan Type" text NOT NULL, -- e.g., 'Unlimited', 'Pooled', etc.
  "Plan" text NOT NULL,
  "Price Per Line" numeric(10,2) NOT NULL,
  "Premium Data" text,
  "Hotspot" text,
  "Video Streaming" text,
  "Plan Features" text[] DEFAULT '{}', -- Additional features as an array
  "Plan Order" integer DEFAULT 0, -- For custom sorting within categories
  "Active" boolean DEFAULT true, -- To manage plan visibility
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_rate_plans_carrier ON rate_plans("Carrier");
CREATE INDEX idx_rate_plans_device_type ON rate_plans("Device Type");
CREATE INDEX idx_rate_plans_plan_category ON rate_plans("Plan Category");
CREATE INDEX idx_rate_plans_active ON rate_plans("Active");

-- Enable RLS
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_rate_plans_updated_at
  BEFORE UPDATE ON rate_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Authenticated users can view active rate plans"
  ON rate_plans
  FOR SELECT
  TO authenticated
  USING ("Active" = true);

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
COMMENT ON COLUMN rate_plans."Device Type" IS 'The type of device this plan is for';
COMMENT ON COLUMN rate_plans."Plan Category" IS 'High-level grouping of plans (e.g., Business Elite)';
COMMENT ON COLUMN rate_plans."Plan Type" IS 'The type/category of the plan';
COMMENT ON COLUMN rate_plans."Plan" IS 'The name/title of the plan';
COMMENT ON COLUMN rate_plans."Price Per Line" IS 'The price per line for the plan';
COMMENT ON COLUMN rate_plans."Premium Data" IS 'Premium data allocation details';
COMMENT ON COLUMN rate_plans."Hotspot" IS 'Mobile hotspot allocation details';
COMMENT ON COLUMN rate_plans."Video Streaming" IS 'Video streaming quality/details';
COMMENT ON COLUMN rate_plans."Plan Features" IS 'Additional plan features as an array';
COMMENT ON COLUMN rate_plans."Plan Order" IS 'Custom sort order within plan categories';
COMMENT ON COLUMN rate_plans."Active" IS 'Whether the plan is currently active/visible';

-- Insert sample data
INSERT INTO rate_plans (
  "Carrier",
  "Device Type",
  "Plan Category",
  "Plan Type",
  "Plan",
  "Price Per Line",
  "Premium Data",
  "Hotspot",
  "Video Streaming",
  "Plan Features",
  "Plan Order"
) VALUES
-- Phone Plans
('ATT', 'phones', 'Business Elite', 'Unlimited', 'Business Elite Unlimited', 85.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['FirstNet Priority', 'Advanced Mobile Security', 'ActiveArmor protection', 'International Day Pass'], 1),
('ATT', 'phones', 'Business Performance', 'Unlimited', 'Business Performance Unlimited', 75.00, '50GB Premium Data', '30GB', '1080p',
  ARRAY['Advanced Mobile Security', 'ActiveArmor protection'], 2),
('ATT', 'phones', 'Business Starter', 'Unlimited', 'Business Starter Unlimited', 65.00, '5GB Premium Data', '15GB', '480p',
  ARRAY['Basic Mobile Security'], 3),

-- Tablet Plans
('ATT', 'tablets', 'Business Elite', 'Unlimited', 'Business Elite Tablet', 20.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Microsoft 365 included', 'Advanced Device Security'], 1),
('ATT', 'tablets', 'Business Performance', 'Unlimited', 'Business Performance Tablet', 15.00, '50GB Premium Data', '30GB', '1080p',
  ARRAY['Basic Device Security'], 2),

-- Hotspot Plans
('ATT', 'hotspots', 'Business Elite', 'Pooled', 'Business Elite Hotspot 100GB', 60.00, '100GB High-Speed Data', 'N/A', 'N/A',
  ARRAY['5G+ Access', 'Data Pooling'], 1),
('ATT', 'hotspots', 'Business Performance', 'Pooled', 'Business Performance Hotspot 50GB', 40.00, '50GB High-Speed Data', 'N/A', 'N/A',
  ARRAY['5G Access', 'Data Pooling'], 2);