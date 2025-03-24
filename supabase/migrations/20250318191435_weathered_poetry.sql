/*
  # Create certified devices table

  1. New Tables
    - `certified_devices`
      - `id` (uuid, primary key)
      - `carrier` (carrier_type)
      - `manufacturer` (text)
      - `model_name` (text) 
      - `device_type` (device_type)
      - `radio_technology` (text)
      - `lte_technology` (text)
      - `five_g_technology` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `certified_devices` table
    - Add policy for authenticated users to read devices
    - Add policy for admin users to manage devices

  3. Changes
    - Add indexes for common query patterns
    - Add constraints for data integrity
*/

-- Create certified_devices table
CREATE TABLE IF NOT EXISTS certified_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier carrier_type NOT NULL,
  manufacturer text NOT NULL,
  model_name text NOT NULL,
  device_type device_type NOT NULL,
  radio_technology text,
  lte_technology text,
  five_g_technology text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certified_devices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view devices"
  ON certified_devices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage devices"
  ON certified_devices
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

-- Create indexes for common queries
CREATE INDEX certified_devices_carrier_idx ON certified_devices (carrier);
CREATE INDEX certified_devices_manufacturer_idx ON certified_devices (manufacturer);
CREATE INDEX certified_devices_device_type_idx ON certified_devices (device_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_certified_devices_updated_at
  BEFORE UPDATE ON certified_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful comments
COMMENT ON TABLE certified_devices IS 'Stores information about carrier-certified devices';
COMMENT ON COLUMN certified_devices.carrier IS 'The carrier that certified the device';
COMMENT ON COLUMN certified_devices.manufacturer IS 'The device manufacturer';
COMMENT ON COLUMN certified_devices.model_name IS 'The model name/number of the device';
COMMENT ON COLUMN certified_devices.device_type IS 'The type/category of device';
COMMENT ON COLUMN certified_devices.radio_technology IS 'Supported radio technologies';
COMMENT ON COLUMN certified_devices.lte_technology IS 'Supported LTE technologies/bands';
COMMENT ON COLUMN certified_devices.five_g_technology IS 'Supported 5G technologies/bands';