/*
  # Create Reconciliation Records Table

  1. New Tables
    - `reconciliation_records` - Tracks financial reconciliation
      - `id` (uuid, primary key)
      - `date` (date)
      - `type` (enum: daily, monthly, manual)
      - `status` (enum: pending, completed, discrepancy_found)
      - `totalIncoming` (numeric)
      - `totalOutgoing` (numeric)
      - `platformBalance` (numeric)
      - `discrepancies` (jsonb array, nullable)
      - `reconciledBy` (uuid, nullable)
      - `reconciledAt` (timestamp, nullable)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for financial data access
    - Only admins can view reconciliation records

  3. Indexes
    - Index on date and type for reconciliation queries
    - Index on status for discrepancy tracking

  4. Important Notes
    - Critical for financial integrity and audit trails
    - Discrepancies are tracked for investigation
    - Supports daily, monthly, and manual reconciliation
*/

CREATE TABLE IF NOT EXISTS reconciliation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  type text DEFAULT 'manual' CHECK (type IN ('daily', 'monthly', 'manual')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'discrepancy_found')),
  totalIncoming numeric NOT NULL DEFAULT 0,
  totalOutgoing numeric NOT NULL DEFAULT 0,
  platformBalance numeric NOT NULL DEFAULT 0,
  discrepancies jsonb[],
  reconciledBy uuid REFERENCES users(id),
  reconciledAt timestamptz,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_reconciliation_records_date_type ON reconciliation_records(date, type);
CREATE INDEX idx_reconciliation_records_status ON reconciliation_records(status);

ALTER TABLE reconciliation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view reconciliation records"
  ON reconciliation_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
