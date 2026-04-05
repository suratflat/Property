/*
  # Create Properties Table

  1. New Tables
    - `properties` - Stores rental property information
      - `id` (uuid, primary key)
      - `title` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `pincode` (text)
      - `type` (enum: apartment, house, commercial)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area` (integer) - in sq ft
      - `rent` (numeric)
      - `deposit` (numeric)
      - `landlordId` (uuid, foreign key)
      - `tenantId` (uuid, nullable foreign key)
      - `status` (enum: available, occupied, maintenance)
      - `images` (text array)
      - `amenities` (text array)
      - `dgvclConsumerNumber` (text)
      - `gujaratGasConsumerNumber` (text)
      - `googleMapsLocation` (text)
      - `landlordBrokerage` (jsonb)
      - `tenantBrokerage` (jsonb)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `properties` table
    - Landlords can view/manage their own properties
    - Tenants can view properties they're assigned to
    - Admins can manage based on permissions

  3. Indexes
    - Index on landlordId for filtering properties
    - Index on tenantId for tenant assignments
    - Index on status for availability searches
    - Index on city for location-based searches
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  type text NOT NULL CHECK (type IN ('apartment', 'house', 'commercial')),
  bedrooms integer,
  bathrooms integer,
  area integer,
  rent numeric NOT NULL,
  deposit numeric NOT NULL,
  landlordId uuid NOT NULL REFERENCES users(id),
  tenantId uuid REFERENCES users(id),
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  dgvclConsumerNumber text,
  gujaratGasConsumerNumber text,
  googleMapsLocation text,
  landlordBrokerage jsonb,
  tenantBrokerage jsonb,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

CREATE INDEX idx_properties_landlordId ON properties(landlordId);
CREATE INDEX idx_properties_tenantId ON properties(tenantId);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords can view and manage their properties"
  ON properties FOR ALL
  TO authenticated
  USING (landlordId = auth.uid())
  WITH CHECK (landlordId = auth.uid());

CREATE POLICY "Tenants can view their assigned property"
  ON properties FOR SELECT
  TO authenticated
  USING (tenantId = auth.uid());

CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );
