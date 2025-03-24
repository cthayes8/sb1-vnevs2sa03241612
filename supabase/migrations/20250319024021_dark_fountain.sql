/*
  # Update certified devices table schema

  1. Changes
    - Add device sub-type field
    - Add radio technology fields
    - Add LTE technology fields
    - Add 5G technology fields
    - Update column descriptions

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to certified_devices table
DO $$ 
BEGIN
  -- Add device_sub_type if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certified_devices' AND column_name = 'device_sub_type'
  ) THEN
    ALTER TABLE certified_devices ADD COLUMN device_sub_type text;
  END IF;

  -- Update radio_technology to be an array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certified_devices' AND column_name = 'radio_technology'
  ) THEN
    ALTER TABLE certified_devices 
    ALTER COLUMN radio_technology TYPE text[] USING ARRAY[radio_technology];
  END IF;

  -- Update lte_technology to be an array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certified_devices' AND column_name = 'lte_technology'
  ) THEN
    ALTER TABLE certified_devices 
    ALTER COLUMN lte_technology TYPE text[] USING ARRAY[lte_technology];
  END IF;

  -- Update five_g_technology to be an array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certified_devices' AND column_name = 'five_g_technology'
  ) THEN
    ALTER TABLE certified_devices 
    ALTER COLUMN five_g_technology TYPE text[] USING ARRAY[five_g_technology];
  END IF;
END $$;

-- Update column comments
COMMENT ON COLUMN certified_devices.device_sub_type IS 'Specific sub-category of the device';
COMMENT ON COLUMN certified_devices.radio_technology IS 'Array of supported radio technologies';
COMMENT ON COLUMN certified_devices.lte_technology IS 'Array of supported LTE bands and technologies';
COMMENT ON COLUMN certified_devices.five_g_technology IS 'Array of supported 5G bands and technologies';

-- Create indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_certified_devices_device_sub_type 
ON certified_devices(device_sub_type);

-- Create function to validate radio technologies
CREATE OR REPLACE FUNCTION validate_radio_technologies()
RETURNS trigger AS $$
BEGIN
  -- Validate that arrays are not empty
  IF array_length(NEW.radio_technology, 1) IS NULL THEN
    RAISE EXCEPTION 'Radio technology cannot be empty';
  END IF;

  -- Additional validation could be added here

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_radio_technologies_trigger ON certified_devices;
CREATE TRIGGER validate_radio_technologies_trigger
  BEFORE INSERT OR UPDATE ON certified_devices
  FOR EACH ROW
  EXECUTE FUNCTION validate_radio_technologies();