/*
  # Create Platform Transactions Table

  1. New Tables
    - `platform_transactions` - Tracks all platform financial transactions
      - `id` (uuid, primary key)
      - `type` (enum: commission_earned, landlord_payout, service_provider_payout, refund)
      - `referenceId` (text) - ID of related payment/service request
      - `referenceType` (enum: rent_payment, service_request, brokerage)
      - `amount` (numeric)
      - `status` (enum: pending, processed, failed)
      - `transactionId` (text, nullable)
      - `processedDate` (timestamp, nullable)
      - `description` (text)
      - `fromUserId` (uuid, nullable)
      - `toUserId` (uuid, nullable)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for financial transparency
    - Users can view transactions involving them
    - Admins can view all transactions

  3. Indexes
    - Index on type and status for transaction filtering
    - Index on referenceId for transaction linking
    - Index on fromUserId and toUserId for user queries
    - Index on processedDate for financial reporting

  4. Important Notes
    - This table is critical for platform accounting
    - All money movements must be tracked here
    - Status updates are essential for financial reconciliation
*/

CREATE TABLE IF NOT EXISTS platform_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('commission_earned', 'landlord_payout', 'service_provider_payout', 'refund')),
  referenceId text NOT NULL,
  referenceType text NOT NULL CHECK (referenceType IN ('rent_payment', 'service_request', 'brokerage')),
  amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  transactionId text,
  processedDate timestamptz,
  description text NOT NULL,
  fromUserId uuid REFERENCES users(id),
  toUserId uuid REFERENCES users(id),
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_platform_transactions_type_status ON platform_transactions(type, status);
CREATE INDEX idx_platform_transactions_referenceId ON platform_transactions(referenceId);
CREATE INDEX idx_platform_transactions_fromUserId ON platform_transactions(fromUserId);
CREATE INDEX idx_platform_transactions_toUserId ON platform_transactions(toUserId);
CREATE INDEX idx_platform_transactions_processedDate ON platform_transactions(processedDate);

ALTER TABLE platform_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transactions involving them"
  ON platform_transactions FOR SELECT
  TO authenticated
  USING (fromUserId = auth.uid() OR toUserId = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON platform_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
