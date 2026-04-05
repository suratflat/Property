/*
  # Create Financial Reports Table

  1. New Tables
    - `financial_reports` - Stores generated financial reports
      - `id` (uuid, primary key)
      - `reportType` (enum: monthly_revenue, commission_summary, payout_summary, tax_summary)
      - `period` (text) - YYYY-MM format
      - `data` (jsonb) - Flexible report data structure
      - `generatedAt` (timestamp)
      - `generatedBy` (uuid, foreign key)

  2. Security
    - Enable RLS for access control
    - Only admins can view reports

  3. Indexes
    - Index on reportType and period for report retrieval
    - Index on generatedAt for temporal queries

  4. Important Notes
    - Report data is stored as JSONB for flexibility
    - Supports various report types without schema changes
*/

CREATE TABLE IF NOT EXISTS financial_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reportType text NOT NULL CHECK (reportType IN ('monthly_revenue', 'commission_summary', 'payout_summary', 'tax_summary')),
  period text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  generatedAt timestamptz NOT NULL DEFAULT now(),
  generatedBy uuid NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_financial_reports_type_period ON financial_reports(reportType, period);
CREATE INDEX idx_financial_reports_generatedAt ON financial_reports(generatedAt);

ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view financial reports"
  ON financial_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
