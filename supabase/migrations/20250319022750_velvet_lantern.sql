/*
  # Add CRM tables for deals and customers

  1. New Tables
    - `customers`
      - Basic customer information
      - Contact details
      - Company association
      - Created/updated timestamps
    
    - `deals`
      - Deal information
      - Status tracking
      - Revenue metrics
      - Customer association
      - Created/updated timestamps

  2. Security
    - Enable RLS on all tables
    - Add policies for company-based access
    - Add policies for role-based management
*/

-- Create deals status enum
CREATE TYPE deal_status AS ENUM (
  'lead',
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  name text NOT NULL,
  company_name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'USA',
  industry text,
  size text,
  notes text,
  assigned_to uuid REFERENCES agent_users(id),
  created_by uuid REFERENCES agent_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  customer_id uuid REFERENCES customers(id),
  title text NOT NULL,
  description text,
  status deal_status NOT NULL DEFAULT 'lead',
  value numeric(10,2) NOT NULL DEFAULT 0,
  close_date date,
  probability integer DEFAULT 0,
  carrier carrier_type NOT NULL,
  product_type text NOT NULL,
  contract_term integer, -- in months
  monthly_revenue numeric(10,2),
  one_time_revenue numeric(10,2),
  total_revenue numeric(10,2),
  assigned_to uuid REFERENCES agent_users(id),
  created_by uuid REFERENCES agent_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  lost_reason text
);

-- Create deal_activities table for tracking interactions
CREATE TABLE IF NOT EXISTS deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  performed_by uuid REFERENCES agent_users(id),
  performed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_activities ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_customer_id ON deals(customer_id);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deal_activities_deal_id ON deal_activities(deal_id);

-- Create policies for customers
CREATE POLICY "Users can view customers in their company"
  ON customers
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM agent_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage customers they created or are assigned to"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = customers.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  )
  WITH CHECK (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = customers.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  );

-- Create policies for deals
CREATE POLICY "Users can view deals in their company"
  ON deals
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM agent_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage deals they created or are assigned to"
  ON deals
  FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = deals.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  )
  WITH CHECK (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = deals.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'admin'
    )
  );

-- Create policies for deal activities
CREATE POLICY "Users can view activities for deals they can access"
  ON deal_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_activities.deal_id
      AND (
        deals.created_by = auth.uid() OR
        deals.assigned_to = auth.uid() OR
        deals.company_id IN (
          SELECT company_id FROM agent_users WHERE id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create activities for deals they can access"
  ON deal_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_activities.deal_id
      AND (
        deals.created_by = auth.uid() OR
        deals.assigned_to = auth.uid() OR
        deals.company_id IN (
          SELECT company_id FROM agent_users WHERE id = auth.uid()
        )
      )
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log deal status changes
CREATE OR REPLACE FUNCTION log_deal_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO deal_activities (
      deal_id,
      type,
      description,
      performed_by
    ) VALUES (
      NEW.id,
      'status_change',
      format('Deal status changed from %s to %s', OLD.status, NEW.status),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for deal status changes
CREATE TRIGGER log_deal_status_changes
  AFTER UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION log_deal_status_change();