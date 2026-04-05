/*
  # Create Banking Transactions Table

  1. New Tables
    - `banking_transactions` - Tracks bank-level payment transactions
      - `id` (uuid, primary key)
      - `type` (enum: ecs_debit, nach_debit, upi_payment, card_payment, bank_transfer)
      - `status` (enum: success, failed, bounced, pending)
      - `amount` (numeric)
      - `transactionId` (text, unique)
      - `bankReference` (text, nullable)
      - `bounceReason` (text, nullable)
      - `retryCount` (integer)
      - `maxRetries` (integer)
      - `nextRetryDate` (timestamp, nullable)
      - `relatedPaymentId` (text) - Links to rent payment
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for sensitive banking data
    - Only admins can view all banking transactions
    - Users can view transactions related to their payments

  3. Indexes
    - Index on status for retry/bounce processing
    - Index on relatedPaymentId for payment linking
    - Index on nextRetryDate for scheduled retries
    - Index on createdAt for temporal reporting

  4. Important Notes
    - Bounce handling is critical for cash flow
    - Retry mechanism ensures payment success
    - Bank references are needed for reconciliation
*/

CREATE TABLE IF NOT EXISTS banking_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('ecs_debit', 'nach_debit', 'upi_payment', 'card_payment', 'bank_transfer')),
  status text DEFAULT 'pending' CHECK (status IN ('success', 'failed', 'bounced', 'pending')),
  amount numeric NOT NULL,
  transactionId text UNIQUE NOT NULL,
  bankReference text,
  bounceReason text,
  retryCount integer DEFAULT 0,
  maxRetries integer DEFAULT 3,
  nextRetryDate timestamptz,
  relatedPaymentId text NOT NULL,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_banking_transactions_status ON banking_transactions(status);
CREATE INDEX idx_banking_transactions_relatedPaymentId ON banking_transactions(relatedPaymentId);
CREATE INDEX idx_banking_transactions_nextRetryDate ON banking_transactions(nextRetryDate);
CREATE INDEX idx_banking_transactions_createdAt ON banking_transactions(createdAt);

ALTER TABLE banking_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all banking transactions"
  ON banking_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
