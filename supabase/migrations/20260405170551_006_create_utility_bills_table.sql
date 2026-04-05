/*
  # Create Utility Bills Table

  1. New Tables
    - `utility_bills` - Tracks electricity and gas bills
      - `id` (uuid, primary key)
      - `propertyId` (uuid, foreign key)
      - `tenantId` (uuid, nullable foreign key)
      - `type` (enum: electricity, gas)
      - `provider` (text)
      - `consumerNumber` (text)
      - `billNumber` (text)
      - `amount` (numeric)
      - `dueDate` (date)
      - `paidDate` (date, nullable)
      - `status` (enum: pending, paid, overdue)
      - `billPeriod` (text)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for user-based access
    - Tenants can view bills for their property
    - Landlords can view bills for their properties
    - Admins can view all bills

  3. Indexes
    - Index on propertyId for property-specific queries
    - Index on status for pending/overdue tracking
    - Index on type for utility-specific reporting
*/

CREATE TABLE IF NOT EXISTS utility_bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propertyId uuid NOT NULL REFERENCES properties(id),
  tenantId uuid REFERENCES users(id),
  type text NOT NULL CHECK (type IN ('electricity', 'gas')),
  provider text NOT NULL,
  consumerNumber text NOT NULL,
  billNumber text NOT NULL,
  amount numeric NOT NULL,
  dueDate date NOT NULL,
  paidDate date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  billPeriod text NOT NULL,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_utility_bills_propertyId ON utility_bills(propertyId);
CREATE INDEX idx_utility_bills_status ON utility_bills(status);
CREATE INDEX idx_utility_bills_type ON utility_bills(type);

ALTER TABLE utility_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view bills for their property"
  ON utility_bills FOR SELECT
  TO authenticated
  USING (tenantId = auth.uid());

CREATE POLICY "Landlords can view bills for their properties"
  ON utility_bills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = utility_bills.propertyId
      AND properties.landlordId = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bills"
  ON utility_bills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
