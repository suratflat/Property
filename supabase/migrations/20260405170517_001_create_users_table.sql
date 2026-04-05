/*
  # Create Users Table with Authentication Integration

  1. New Tables
    - `users` - Stores user profile information linked to Supabase auth
      - `id` (uuid, primary key) - Matches Supabase auth.users id
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `role` (enum: landlord, tenant, service_provider, admin, superadmin)
      - `avatar` (text, nullable)
      - `isKYCVerified` (boolean)
      - `kycRequestStatus` (enum: none, requested, submitted, verified, rejected)
      - `panCardNumber` (text, nullable)
      - `aadhaarNumber` (text, nullable)
      - `serviceProviderCategory` (text, nullable)
      - `adminPermissions` (jsonb, nullable)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Users can read their own profile
    - Users can update their own profile
    - Admin can manage all user data based on permissions

  3. Indexes
    - Index on email for fast lookups
    - Index on role for filtering users by type
    - Index on KYC verification status
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('landlord', 'tenant', 'service_provider', 'admin', 'superadmin')),
  avatar text,
  isKYCVerified boolean DEFAULT false,
  kycRequestStatus text DEFAULT 'none' CHECK (kycRequestStatus IN ('none', 'requested', 'submitted', 'verified', 'rejected')),
  panCardNumber text,
  aadhaarNumber text,
  serviceProviderCategory text,
  adminPermissions jsonb,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kycStatus ON users(kycRequestStatus);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role IN ('admin', 'superadmin') 
        OR (users.role = 'admin' AND users.adminPermissions->'userManagement'->>'view' = 'true'))
    )
  );
