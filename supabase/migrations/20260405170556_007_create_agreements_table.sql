/*
  # Create Agreements Table

  1. New Tables
    - `agreements` - Stores rental agreements
      - `id` (uuid, primary key)
      - `propertyId` (uuid, foreign key)
      - `landlordIds` (uuid array)
      - `tenantIds` (uuid array)
      - `type` (enum: leave_license)
      - `startDate` (date)
      - `endDate` (date)
      - `rentAmount` (numeric)
      - `depositAmount` (numeric)
      - `terms` (text array)
      - `status` (enum: draft, pending_signature, signed, expired)
      - `signatories` (jsonb array) - Signature tracking
      - `landlordBrokerage` (jsonb)
      - `tenantBrokerage` (jsonb)
      - `landlordLegalCharges` (numeric)
      - `tenantLegalCharges` (numeric)
      - `waiveLandlordLegalCharges` (boolean)
      - `waiveTenantLegalCharges` (boolean)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for role-based access
    - Signatories can view agreements they're part of
    - Landlords can manage agreements for their properties

  3. Indexes
    - Index on propertyId for property-specific queries
    - Index on status for filtering pending agreements
*/

CREATE TABLE IF NOT EXISTS agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propertyId uuid NOT NULL REFERENCES properties(id),
  landlordIds uuid[] NOT NULL,
  tenantIds uuid[] NOT NULL,
  type text DEFAULT 'leave_license' CHECK (type IN ('leave_license')),
  startDate date NOT NULL,
  endDate date NOT NULL,
  rentAmount numeric NOT NULL,
  depositAmount numeric NOT NULL,
  terms text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'signed', 'expired')),
  signatories jsonb[] NOT NULL,
  landlordBrokerage jsonb,
  tenantBrokerage jsonb,
  landlordLegalCharges numeric,
  tenantLegalCharges numeric,
  waiveLandlordLegalCharges boolean DEFAULT false,
  waiveTenantLegalCharges boolean DEFAULT false,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_agreements_propertyId ON agreements(propertyId);
CREATE INDEX idx_agreements_status ON agreements(status);

ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signatories can view agreements they're part of"
  ON agreements FOR SELECT
  TO authenticated
  USING (
    auth.uid() = ANY(landlordIds) OR 
    auth.uid() = ANY(tenantIds)
  );

CREATE POLICY "Admins can view all agreements"
  ON agreements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
