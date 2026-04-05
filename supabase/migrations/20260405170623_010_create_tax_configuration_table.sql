/*
  # Create Tax Configuration Table

  1. New Tables
    - `tax_configurations` - Stores tax rules and rates
      - `id` (uuid, primary key)
      - `taxType` (enum: gst, tds, income_tax)
      - `rate` (numeric) - Percentage
      - `applicableOn` (enum: commission, service_payment, rent)
      - `isActive` (boolean)
      - `effectiveFrom` (date)
      - `effectiveTo` (date, nullable)
      - `description` (text)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for access control
    - Only superadmins can modify tax configurations
    - Admins can view configurations

  3. Indexes
    - Index on isActive and effectiveFrom for active config lookup
    - Index on taxType for filtering by tax type
*/

CREATE TABLE IF NOT EXISTS tax_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taxType text NOT NULL CHECK (taxType IN ('gst', 'tds', 'income_tax')),
  rate numeric NOT NULL,
  applicableOn text NOT NULL CHECK (applicableOn IN ('commission', 'service_payment', 'rent')),
  isActive boolean DEFAULT true,
  effectiveFrom date NOT NULL,
  effectiveTo date,
  description text,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_tax_configurations_active ON tax_configurations(isActive, effectiveFrom);
CREATE INDEX idx_tax_configurations_taxType ON tax_configurations(taxType);

ALTER TABLE tax_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view tax configurations"
  ON tax_configurations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
