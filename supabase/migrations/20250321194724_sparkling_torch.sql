/*
  # Fix certified devices table structure

  1. Changes
    - Handle existing device_enum type
    - Update table structure with correct column names
    - Convert existing data to new format
    - Add indexes and constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing device_enum type if it exists
DO $$ BEGIN
  DROP TYPE IF EXISTS device_enum_new CASCADE;
  
  CREATE TYPE device_enum_new AS ENUM (
    'Alarm', 'Camera', 'Computer', 'ConnectedButton', 'Drone', 'EVCharger',
    'EmergencyPhone', 'FWA', 'FixedBroadbandRouter', 'GPSSmartAntenna', 'Gateway',
    'HVAC', 'HandheldTerminal', 'Hotspot', 'IOT', 'Intercom', 'Laptop', 'Lighting',
    'MedicalTelematics', 'Meter', 'MobileHotspotRouter', 'Modem', 'Module', 'OBDII',
    'Other', 'POTSLineReplacement', 'PTTRadio', 'Phone', 'PointOfSale',
    'RemoteControlDevice', 'RemoteMonitoringDevice', 'Robot', 'Router',
    'RuggedHandheld', 'Sensor', 'SmartHome', 'SocketModem', 'TCU', 'Tablet',
    'TabletLaptop', 'TelematicsDevice', 'Tracking', 'VehicleMountedHandset',
    'VendingTelemetry', 'VoiceDataModem', 'Wearable', 'WirelessHomePhone',
    'eBookReader', 'mPERS'
  );
END $$;

-- Create temporary table to hold existing data if exists
DO $$ BEGIN
  CREATE TEMP TABLE IF NOT EXISTS temp_certified_devices AS 
  SELECT * FROM certified_devices;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Drop existing table if exists
DROP TABLE IF EXISTS certified_devices CASCADE;

-- Recreate table with correct structure
CREATE TABLE certified_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "Carrier" carrier_type NOT NULL,
  "Manufacturer" text NOT NULL,
  "Model" text NOT NULL,
  "Radio Technology" text[],
  "LTE Technology" text[],
  "5G Technology" text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  "Device Sub" text,
  "Device" text
);

-- Create indexes
CREATE INDEX certified_devices_carrier_idx ON certified_devices("Carrier");
CREATE INDEX certified_devices_manufacturer_idx ON certified_devices("Manufacturer");
CREATE INDEX idx_certified_devices_device_sub_type ON certified_devices("Device Sub");

-- Enable RLS
ALTER TABLE certified_devices ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certified_devices_updated_at
  BEFORE UPDATE ON certified_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Copy data back if exists
DO $$ BEGIN
  INSERT INTO certified_devices (
    id, "Carrier", "Manufacturer", "Model", 
    "Radio Technology", "LTE Technology", "5G Technology",
    created_at, updated_at, "Device Sub", "Device"
  )
  SELECT 
    id,
    "Carrier"::carrier_type,
    "Manufacturer",
    "Model",
    CASE 
      WHEN "Radio Technology" IS NULL THEN '{}'::text[]
      WHEN "Radio Technology"::text = '' THEN '{}'::text[]
      ELSE string_to_array("Radio Technology"::text, ',')
    END,
    CASE 
      WHEN "LTE Technology" IS NULL THEN '{}'::text[]
      WHEN "LTE Technology"::text = '' THEN '{}'::text[]
      ELSE string_to_array("LTE Technology"::text, ',')
    END,
    CASE 
      WHEN "5G Technology" IS NULL THEN '{}'::text[]
      WHEN "5G Technology"::text = '' THEN '{}'::text[]
      ELSE string_to_array("5G Technology"::text, ',')
    END,
    created_at,
    updated_at,
    "Device Sub",
    "Device"
  FROM temp_certified_devices;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Drop temporary table if exists
DROP TABLE IF EXISTS temp_certified_devices;

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

-- Insert some sample data
INSERT INTO certified_devices (
  "Carrier",
  "Manufacturer",
  "Model",
  "Radio Technology",
  "LTE Technology",
  "5G Technology",
  "Device",
  "Device Sub"
) VALUES
('ATT', 'Apple', 'iPhone 15 Pro', 
  ARRAY['5G', 'LTE', 'UMTS', 'GSM'],
  ARRAY['Cat 18', 'Carrier Aggregation'],
  ARRAY['mmWave', 'Sub-6'],
  'Phone',
  'Smartphone'
),
('VERIZON', 'Samsung', 'Galaxy S24 Ultra',
  ARRAY['5G', 'LTE', 'UMTS'],
  ARRAY['Cat 20', 'Carrier Aggregation'],
  ARRAY['mmWave', 'Sub-6', 'C-Band'],
  'Phone',
  'Smartphone'
),
('TMOBILE', 'Cradlepoint', 'E3000',
  ARRAY['5G', 'LTE'],
  ARRAY['Cat 18', 'CBRS'],
  ARRAY['Sub-6', 'C-Band'],
  'Router',
  'Fixed Router'
);