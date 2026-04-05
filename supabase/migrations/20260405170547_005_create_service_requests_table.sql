/*
  # Create Service Requests Table

  1. New Tables
    - `service_requests` - Tracks maintenance and service requests
      - `id` (uuid, primary key)
      - `propertyId` (uuid, foreign key)
      - `tenantId` (uuid, foreign key)
      - `landlordId` (uuid, foreign key)
      - `serviceProviderId` (uuid, nullable foreign key)
      - `serviceProviderCategory` (text)
      - `title` (text)
      - `description` (text)
      - `priority` (enum: low, medium, high, urgent)
      - `status` (enum: pending, assigned, estimate_submitted, in_progress, completed, rejected, tenant_responsibility)
      - `estimatedCost` (numeric, nullable)
      - `actualCost` (numeric, nullable)
      - `platformFeeAmount` (numeric, nullable)
      - `netServiceProviderAmount` (numeric, nullable)
      - `landlordApprovalStatus` (enum: pending, approved, rejected, negotiating)
      - `landlordComment` (text, nullable)
      - `scheduledDate` (timestamp, nullable)
      - `completedDate` (timestamp, nullable)
      - `images` (text array)
      - `paymentResponsibility` (enum: landlord, tenant)
      - `serviceProviderPayoutAmount` (numeric, nullable)
      - `serviceProviderPayoutStatus` (enum: pending, processed, failed)
      - `serviceProviderPayoutTransactionId` (text, nullable)
      - `serviceProviderPayoutDate` (timestamp, nullable)
      - `createdAt` (timestamp)

  2. Security
    - Enable RLS for role-based access
    - Users can view service requests related to their properties
    - Service providers can view assigned requests

  3. Indexes
    - Index on propertyId and status
    - Index on serviceProviderId for provider queries
    - Index on priority for urgent request identification
*/

CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propertyId uuid NOT NULL REFERENCES properties(id),
  tenantId uuid NOT NULL REFERENCES users(id),
  landlordId uuid NOT NULL REFERENCES users(id),
  serviceProviderId uuid REFERENCES users(id),
  serviceProviderCategory text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'estimate_submitted', 'in_progress', 'completed', 'rejected', 'tenant_responsibility')),
  estimatedCost numeric,
  actualCost numeric,
  platformFeeAmount numeric,
  netServiceProviderAmount numeric,
  landlordApprovalStatus text CHECK (landlordApprovalStatus IN ('pending', 'approved', 'rejected', 'negotiating')),
  landlordComment text,
  scheduledDate timestamptz,
  completedDate timestamptz,
  images text[] DEFAULT '{}',
  paymentResponsibility text CHECK (paymentResponsibility IN ('landlord', 'tenant')),
  serviceProviderPayoutAmount numeric,
  serviceProviderPayoutStatus text CHECK (serviceProviderPayoutStatus IN ('pending', 'processed', 'failed')),
  serviceProviderPayoutTransactionId text,
  serviceProviderPayoutDate timestamptz,
  createdAt timestamptz DEFAULT now()
);

CREATE INDEX idx_service_requests_propertyId ON service_requests(propertyId);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_serviceProviderId ON service_requests(serviceProviderId);
CREATE INDEX idx_service_requests_priority ON service_requests(priority);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view requests for their property"
  ON service_requests FOR SELECT
  TO authenticated
  USING (tenantId = auth.uid() OR landlordId = auth.uid());

CREATE POLICY "Service providers can view assigned requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (serviceProviderId = auth.uid());

CREATE POLICY "Landlords can manage requests for their properties"
  ON service_requests FOR ALL
  TO authenticated
  USING (landlordId = auth.uid())
  WITH CHECK (landlordId = auth.uid());
