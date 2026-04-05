/*
  # Create Recurring Payment Setups Table

  1. New Tables
    - `recurring_payment_setups` - Stores recurring payment configurations
      - `id` (uuid, primary key)
      - `propertyId` (uuid, foreign key)
      - `tenantId` (uuid, foreign key)
      - `landlordId` (uuid, foreign key)
      - `amount` (numeric)
      - `debitDate` (integer) - Day of month (1-31)
      - `status` (enum: active, paused, cancelled)
      - `mandateId` (text, nullable) - Payment mandate reference
      - `bankAccount` (text, nullable) - Masked bank account
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS for role-based access
    - Tenants can view their setups
    - Landlords can view setups for their properties

  3. Indexes
    - Index on propertyId and status for active setups lookup
    - Index on tenantId for tenant-specific queries
*/

CREATE TABLE IF NOT EXISTS recurring_payment_setups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propertyId uuid NOT NULL REFERENCES properties(id),
  tenantId uuid NOT NULL REFERENCES users(id),
  landlordId uuid NOT NULL REFERENCES users(id),
  amount numeric NOT NULL,
  debitDate integer NOT NULL CHECK (debitDate >= 1 AND debitDate <= 31),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  mandateId text,
  bankAccount text,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

CREATE INDEX idx_recurring_payments_propertyId_status ON recurring_payment_setups(propertyId, status);
CREATE INDEX idx_recurring_payments_tenantId ON recurring_payment_setups(tenantId);

ALTER TABLE recurring_payment_setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their recurring setups"
  ON recurring_payment_setups FOR SELECT
  TO authenticated
  USING (tenantId = auth.uid());

CREATE POLICY "Landlords can view recurring setups for their properties"
  ON recurring_payment_setups FOR SELECT
  TO authenticated
  USING (landlordId = auth.uid());
