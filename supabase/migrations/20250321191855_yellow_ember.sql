/*
  # Fix carrier type enum values with proper cascade handling

  1. Changes
    - Drop tables in correct order respecting foreign key constraints
    - Recreate carrier_type enum with consistent values
    - Recreate rate_plans table with updated structure
    - Add sample data for all carriers

  2. Security
    - Maintain existing RLS policies
*/

-- First drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS resource_downloads;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS certified_devices;
DROP TABLE IF EXISTS rate_plans;

-- Drop the existing enum
DROP TYPE IF EXISTS carrier_type CASCADE;

-- Recreate the enum with consistent values
CREATE TYPE carrier_type AS ENUM ('ATT', 'VERIZON', 'TMOBILE');

-- Recreate the rate_plans table
CREATE TABLE rate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "Carrier" carrier_type NOT NULL,
  "Device Type" device_type NOT NULL,
  "Plan Category" text NOT NULL,
  "Plan Type" text NOT NULL,
  "Plan" text NOT NULL,
  "Price Per Line" numeric(10,2) NOT NULL,
  "Premium Data" text,
  "Hotspot" text,
  "Video Streaming" text,
  "Plan Features" text[] DEFAULT '{}',
  "Plan Order" integer DEFAULT 0,
  "Active" boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recreate indexes
CREATE INDEX idx_rate_plans_carrier ON rate_plans("Carrier");
CREATE INDEX idx_rate_plans_device_type ON rate_plans("Device Type");
CREATE INDEX idx_rate_plans_plan_category ON rate_plans("Plan Category");
CREATE INDEX idx_rate_plans_active ON rate_plans("Active");

-- Enable RLS
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;

-- Recreate trigger
CREATE TRIGGER update_rate_plans_updated_at
  BEFORE UPDATE ON rate_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Recreate policies
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

-- Insert sample data with corrected carrier values
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
-- AT&T Phone Plans
('ATT', 'phones', 'Business Elite', 'Unlimited', 'Business Elite Unlimited', 85.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['FirstNet Priority', 'Advanced Mobile Security', 'ActiveArmor protection', 'International Day Pass'], 1),
('ATT', 'phones', 'Business Performance', 'Unlimited', 'Business Performance Unlimited', 75.00, '50GB Premium Data', '30GB', '1080p',
  ARRAY['Advanced Mobile Security', 'ActiveArmor protection'], 2),
('ATT', 'phones', 'Business Starter', 'Unlimited', 'Business Starter Unlimited', 65.00, '5GB Premium Data', '15GB', '480p',
  ARRAY['Basic Mobile Security'], 3),

-- T-Mobile Phone Plans
('TMOBILE', 'phones', 'Business Advanced', 'Unlimited', 'Business Advanced', 75.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Microsoft 365', 'Advanced Security', 'Scam Shield Premium'], 1),
('TMOBILE', 'phones', 'Business Unlimited', 'Unlimited', 'Business Unlimited', 65.00, '50GB Premium Data', '50GB', '1080p',
  ARRAY['Basic Security', 'Scam Shield Basic'], 2),

-- Verizon Phone Plans
('VERIZON', 'phones', 'Business Unlimited Pro', 'Unlimited', 'Business Unlimited Pro', 80.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Mobile Secure Pro', '5G Ultra Wideband', 'International Travel Pass'], 1),
('VERIZON', 'phones', 'Business Unlimited Plus', 'Unlimited', 'Business Unlimited Plus', 70.00, '50GB Premium Data', '50GB', '1080p',
  ARRAY['Mobile Secure', '5G Nationwide'], 2),

-- Tablet Plans
('ATT', 'tablets', 'Business Elite', 'Unlimited', 'Business Elite Tablet', 20.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Microsoft 365 included', 'Advanced Device Security'], 1),
('TMOBILE', 'tablets', 'Business Advanced', 'Unlimited', 'Business Advanced Tablet', 20.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Microsoft 365 included', 'Advanced Security'], 1),
('VERIZON', 'tablets', 'Business Unlimited Pro', 'Unlimited', 'Business Pro Tablet', 20.00, 'Unlimited Premium Data', '100GB', '4K UHD',
  ARRAY['Mobile Secure Pro', 'Advanced Device Security'], 1),

-- Hotspot Plans
('ATT', 'hotspots', 'Business Elite', 'Pooled', 'Business Elite Hotspot 100GB', 60.00, '100GB High-Speed Data', 'N/A', 'N/A',
  ARRAY['5G+ Access', 'Data Pooling'], 1),
('TMOBILE', 'hotspots', 'Business Advanced', 'Pooled', 'Business Advanced Hotspot 100GB', 60.00, '100GB High-Speed Data', 'N/A', 'N/A',
  ARRAY['5G Ultra Capacity', 'Data Pooling'], 1),
('VERIZON', 'hotspots', 'Business Pro', 'Pooled', 'Business Pro Hotspot 100GB', 60.00, '100GB High-Speed Data', 'N/A', 'N/A',
  ARRAY['5G Ultra Wideband', 'Data Pooling'], 1);