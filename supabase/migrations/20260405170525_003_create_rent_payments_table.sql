/*
  # Create Rent Payments Table

  1. New Tables
    - `rent_payments` - Tracks all rent payment transactions
      - `id` (uuid, primary key)
      - `propertyId` (uuid, foreign key)
      - `tenantId` (uuid, foreign key)
      - `landlordId` (uuid, foreign key)
      - `baseRentAmount` (numeric)
      - `tenantBrokerageAmount` (numeric, nullable)
      - `tenantLegalChargesAmount` (numeric, nullable)
      - `tenantServiceChargesAmount` (numeric, nullable)
      - `totalTenantAmount` (numeric)
      - `landlordBrokerageAmount` (numeric, nullable)
      - `landlordLegalChargesAmount` (numeric, nullable)
      - `landlordServiceChargesAmount` (numeric, nullable)
      - `netLandlordAmount` (numeric)
      - `platformCommissionAmount` (numeric)
      - `dueDate` (date)
      - `paidDate` (timestamp, nullable)
      - `status` (enum: pending, paid, overdue)
      - `paymentMethod` (text, nullable)
      - `transactionId` (text, nullable)
      - `isRecurring` (boolean)
      - `recurringSetupId` (text, nullable)
      - `payoutStatus` (enum: pending, processed, failed)
      - `payoutTransactionId` (text, nullable)
      - `payoutDate` (timestamp, nullable)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS on `rent_payments` table
    - Tenants can view their payment records
    - Landlords can view payments for their properties
    - Admins can view all payment records

  3. Indexes
    - Index on propertyId for property-specific queries
    - Index on tenantId and landlordId for user-specific queries
    - Index on status for filtering pending/overdue payments
    - Index on dueDate for reporting

  4. Important Notes
    - All amount fields are critical for financial tracking
    - Platform commission must always be calculated
    - Payout status tracks landlord payment processing
*/

CREATE TABLE IF NOT EXISTS rent_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propertyId uuid NOT NULL REFERENCES properties(id),
  tenantId uuid NOT NULL REFERENCES users(id),
  landlordId uuid NOT NULL REFERENCES users(id),
  baseRentAmount numeric NOT NULL,
  tenantBrokerageAmount numeric,
  tenantLegalChargesAmount numeric,
  tenantServiceChargesAmount numeric,
  totalTenantAmount numeric NOT NULL,
  landlordBrokerageAmount numeric,
  landlordLegalChargesAmount numeric,
  landlordServiceChargesAmount numeric,
  netLandlordAmount numeric NOT NULL,
  platformCommissionAmount numeric NOT NULL DEFAULT 0,
  dueDate date NOT NULL,
  paidDate timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paymentMethod text,
  transactionId text,
  isRecurring boolean DEFAULT false,
  recurringSetupId text,
  payoutStatus text CHECK (payoutStatus IN ('pending', 'processed', 'failed')),
  payoutTransactionId text,
  payoutDate timestamptz,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_rent_payments_propertyId ON rent_payments(propertyId);
CREATE INDEX idx_rent_payments_tenantId ON rent_payments(tenantId);
CREATE INDEX idx_rent_payments_landlordId ON rent_payments(landlordId);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_rent_payments_dueDate ON rent_payments(dueDate);

ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their payments"
  ON rent_payments FOR SELECT
  TO authenticated
  USING (tenantId = auth.uid());

CREATE POLICY "Landlords can view payments for their properties"
  ON rent_payments FOR SELECT
  TO authenticated
  USING (landlordId = auth.uid());

CREATE POLICY "Admins can view all payments"
  ON rent_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
