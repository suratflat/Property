/*
  # Seed Database with Initial Data

  This migration populates the database with mock data from the application
  for development and testing purposes.
*/

DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
  user4_id uuid := gen_random_uuid();
  user5_id uuid := gen_random_uuid();
  user6_id uuid := gen_random_uuid();
  user7_id uuid := gen_random_uuid();
  user8_id uuid := gen_random_uuid();
  user9_id uuid := gen_random_uuid();
  user10_id uuid := gen_random_uuid();
  user11_id uuid := gen_random_uuid();
  user12_id uuid := gen_random_uuid();
  
  prop1_id uuid := gen_random_uuid();
  prop2_id uuid := gen_random_uuid();
  prop3_id uuid := gen_random_uuid();
  
  rent1_id uuid := gen_random_uuid();
  rent2_id uuid := gen_random_uuid();
  rent3_id uuid := gen_random_uuid();
  
  recurring1_id uuid := gen_random_uuid();
  
  service1_id uuid := gen_random_uuid();
  service2_id uuid := gen_random_uuid();
  service3_id uuid := gen_random_uuid();
  service4_id uuid := gen_random_uuid();
  service5_id uuid := gen_random_uuid();
  
  agree1_id uuid := gen_random_uuid();
  agree2_id uuid := gen_random_uuid();
BEGIN

  INSERT INTO users (id, email, name, phone, role, isKYCVerified, kycRequestStatus, panCardNumber, aadhaarNumber, createdAt) VALUES
  (user1_id, 'rajesh@example.com', 'Rajesh Patel', '+91-9876543210', 'landlord', true, 'verified', 'ABCDE1234F', '123456789012', '2024-01-15'),
  (user2_id, 'priya@example.com', 'Priya Sharma', '+91-9876543211', 'tenant', true, 'verified', 'FGHIJ5678K', '234567890123', '2024-01-16'),
  (user3_id, 'amit@example.com', 'Amit Kumar', '+91-9876543212', 'service_provider', true, 'verified', 'KLMNO9012P', '345678901234', '2024-01-17'),
  (user4_id, 'superadmin@example.com', 'Super Admin', '+91-9876543213', 'superadmin', true, 'verified', 'PQRST3456U', '456789012345', '2024-01-01'),
  (user5_id, 'admin@example.com', 'Admin User', '+91-9876543214', 'admin', true, 'verified', 'UVWXY7890Z', '567890123456', '2024-01-01'),
  (user6_id, 'neha@example.com', 'Neha Singh', '+91-9876543215', 'tenant', false, 'requested', null, '567890123456', '2024-02-01'),
  (user7_id, 'vikram@example.com', 'Vikram Mehta', '+91-9876543216', 'landlord', true, 'verified', 'VWXYZ7890A', '678901234567', '2024-02-15'),
  (user8_id, 'ravi@example.com', 'Ravi Electrician', '+91-9876543217', 'service_provider', false, 'submitted', null, '789012345678', '2024-03-01'),
  (user9_id, 'suresh@example.com', 'Suresh Carpenter', '+91-9876543218', 'service_provider', true, 'verified', 'BCDEF2345G', '890123456789', '2024-03-05'),
  (user10_id, 'kavita@example.com', 'Kavita Landlord', '+91-9876543219', 'landlord', true, 'verified', 'CDEFG3456H', '901234567890', '2024-03-10'),
  (user11_id, 'rohit@example.com', 'Rohit Tenant', '+91-9876543220', 'tenant', true, 'verified', 'DEFGH4567I', '012345678901', '2024-03-15'),
  (user12_id, 'finance@example.com', 'Finance Admin', '+91-9876543221', 'admin', true, 'verified', 'EFGHI5678J', '123456789012', '2024-02-01');

  INSERT INTO properties (id, title, address, city, state, pincode, type, bedrooms, bathrooms, area, rent, deposit, landlordId, tenantId, status, images, amenities, dgvclConsumerNumber, gujaratGasConsumerNumber, googleMapsLocation, landlordBrokerage, tenantBrokerage, createdAt) VALUES
  (prop1_id, '3BHK Premium Apartment', 'Satellite Road, Near SG Highway', 'Ahmedabad', 'Gujarat', '380015', 'apartment', 3, 2, 1200, 25000, 75000, user1_id, user2_id, 'occupied', 
   ARRAY['https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800'], 
   ARRAY['Parking', 'Security', 'Gym', 'Swimming Pool'], 
   'DG123456789', 'GG987654321', 'https://maps.google.com/?q=23.0225,72.5714',
   '{"type":"percentage","value":3,"collectionType":"recurring","description":"3% monthly commission","waived":false}',
   '{"type":"percentage","value":2,"collectionType":"recurring","description":"2% monthly commission","waived":false}',
   '2024-01-15'),
   
  (prop2_id, '2BHK Modern Flat', 'CG Road, Navrangpura', 'Ahmedabad', 'Gujarat', '380009', 'apartment', 2, 2, 950, 18000, 54000, user1_id, null, 'available',
   ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
   ARRAY['Parking', 'Security', 'Elevator'],
   'DG123456790', 'GG987654322', 'https://maps.google.com/?q=23.0395,72.5660',
   '{"type":"fixed","value":1500,"collectionType":"upfront","description":"Upfront fee","waived":false}',
   '{"type":"fixed","value":500,"collectionType":"upfront","description":"Upfront fee","waived":true}',
   '2024-01-20'),
   
  (prop3_id, '1BHK Cozy Apartment', 'Vastrapur, Near Lake', 'Ahmedabad', 'Gujarat', '380015', 'apartment', 1, 1, 650, 12000, 36000, user7_id, user6_id, 'occupied',
   ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
   ARRAY['Parking', 'Security'],
   'DG123456791', 'GG987654323', 'https://maps.google.com/?q=23.0395,72.5262',
   '{"type":"percentage","value":4,"collectionType":"recurring","description":"4% commission","waived":true}',
   '{"type":"percentage","value":1,"collectionType":"recurring","description":"1% commission","waived":false}',
   '2024-02-15');

  INSERT INTO rent_payments (id, propertyId, tenantId, landlordId, baseRentAmount, totalTenantAmount, netLandlordAmount, platformCommissionAmount, dueDate, status, createdAt) VALUES
  (rent1_id, prop1_id, user2_id, user1_id, 25000, 25000, 23750, 1250, '2024-12-05', 'pending', now()),
  (rent2_id, prop1_id, user2_id, user1_id, 25000, 25000, 23750, 1250, '2024-11-05', 'paid', '2024-10-01'),
  (rent3_id, prop3_id, user6_id, user7_id, 12000, 12000, 11880, 120, '2024-12-05', 'pending', now());

  INSERT INTO recurring_payment_setups (id, propertyId, tenantId, landlordId, amount, debitDate, status, mandateId, bankAccount, createdAt) VALUES
  (recurring1_id, prop1_id, user2_id, user1_id, 25000, 5, 'active', 'MANDATE123456', '****1234', '2024-01-15');

  INSERT INTO service_requests (id, propertyId, tenantId, landlordId, serviceProviderId, serviceProviderCategory, title, description, priority, status, estimatedCost, paymentResponsibility, createdAt) VALUES
  (service1_id, prop1_id, user2_id, user1_id, user3_id, 'plumber', 'Kitchen Sink Leakage', 'Water dripping continuously', 'high', 'assigned', 2500, 'landlord', now()),
  (service2_id, prop1_id, user2_id, user1_id, null, 'electrician', 'Bedroom Light Not Working', 'Need electrical inspection', 'medium', 'pending', null, 'landlord', now()),
  (service3_id, prop3_id, user6_id, user7_id, user9_id, 'carpenter', 'Cabinet Door Repair', 'Cabinet hinge broken', 'low', 'estimate_submitted', 1500, 'landlord', now()),
  (service4_id, prop1_id, user2_id, user1_id, user8_id, 'electrician', 'Power Socket Installation', 'Add socket in living room', 'medium', 'completed', 800, 'landlord', now()),
  (service5_id, prop3_id, user6_id, user7_id, user9_id, 'carpenter', 'Wardrobe Door Repair', 'Door not closing', 'low', 'completed', 600, 'tenant', now());

  INSERT INTO utility_bills (id, propertyId, tenantId, type, provider, consumerNumber, billNumber, amount, dueDate, status, billPeriod, createdAt) VALUES
  (gen_random_uuid(), prop1_id, user2_id, 'electricity', 'DGVCL', 'DG123456789', 'BILL2024120001', 3500, '2024-12-20', 'pending', 'Nov 2024', now()),
  (gen_random_uuid(), prop1_id, user2_id, 'gas', 'Gujarat Gas', 'GG987654321', 'GAS2024120001', 1200, '2024-12-25', 'pending', 'Nov 2024', now()),
  (gen_random_uuid(), prop3_id, user6_id, 'electricity', 'DGVCL', 'DG123456791', 'BILL2024120003', 2100, '2024-12-18', 'paid', 'Nov 2024', now()),
  (gen_random_uuid(), prop2_id, null, 'electricity', 'DGVCL', 'DG123456790', 'BILL2024120002', 1800, '2024-12-22', 'pending', 'Nov 2024', now()),
  (gen_random_uuid(), prop3_id, user6_id, 'gas', 'Gujarat Gas', 'GG987654323', 'GAS2024120002', 800, '2024-12-28', 'pending', 'Nov 2024', now());

  INSERT INTO agreements (id, propertyId, landlordIds, tenantIds, type, startDate, endDate, rentAmount, depositAmount, terms, status, signatories, landlordBrokerage, tenantBrokerage, landlordLegalCharges, tenantLegalCharges, createdAt) VALUES
  (agree1_id, prop1_id, ARRAY[user1_id], ARRAY[user2_id], 'leave_license', '2024-01-01', '2025-01-01', 25000, 75000,
   ARRAY['Rent by 5th', 'No pets', 'No smoking', 'Maintenance included', '2 months notice'],
   'signed',
   ARRAY[
     jsonb_build_object('userId', user1_id::text, 'role', 'landlord', 'signed', true, 'signedAt', '2024-01-01T10:00:00Z', 'aadhaarNumber', '123456789012'),
     jsonb_build_object('userId', user2_id::text, 'role', 'tenant', 'signed', true, 'signedAt', '2024-01-01T11:00:00Z', 'aadhaarNumber', '234567890123')
   ],
   '{"type":"percentage","value":3,"collectionType":"recurring","waived":false}',
   '{"type":"percentage","value":2,"collectionType":"recurring","waived":false}',
   2000, 1500, '2024-01-01'),
   
  (agree2_id, prop3_id, ARRAY[user7_id, user10_id], ARRAY[user6_id, user11_id], 'leave_license', '2024-02-01', '2025-02-01', 12000, 36000,
   ARRAY['Rent by 5th', 'Shared property', 'Consensus needed', 'Joint maintenance', '1 month notice'],
   'pending_signature',
   ARRAY[
     jsonb_build_object('userId', user7_id::text, 'role', 'landlord', 'signed', true, 'signedAt', '2024-02-01T10:00:00Z', 'aadhaarNumber', '678901234567'),
     jsonb_build_object('userId', user10_id::text, 'role', 'landlord', 'signed', false, 'aadhaarNumber', '901234567890'),
     jsonb_build_object('userId', user6_id::text, 'role', 'tenant', 'signed', true, 'signedAt', '2024-02-01T12:00:00Z', 'aadhaarNumber', '567890123456'),
     jsonb_build_object('userId', user11_id::text, 'role', 'tenant', 'signed', false, 'aadhaarNumber', '012345678901')
   ],
   '{"type":"percentage","value":4,"collectionType":"recurring","waived":true}',
   '{"type":"percentage","value":1,"collectionType":"recurring","waived":false}',
   0, 1000, '2024-02-01');

  INSERT INTO platform_transactions (type, referenceId, referenceType, amount, status, description, fromUserId, toUserId, createdAt) VALUES
  ('commission_earned', rent2_id::text, 'rent_payment', 1250, 'processed', 'Commission from rent payment', user2_id, user4_id, '2024-11-03'),
  ('landlord_payout', rent2_id::text, 'rent_payment', 23750, 'processed', 'Rent payout to landlord', user4_id, user1_id, '2024-11-04'),
  ('service_provider_payout', service4_id::text, 'service_request', 750, 'processed', 'Service payment', user4_id, user8_id, '2024-12-09');

  INSERT INTO banking_transactions (type, status, amount, transactionId, bankReference, relatedPaymentId, createdAt) VALUES
  ('ecs_debit', 'success', 25000, 'ECS123456789', 'HDFC001234567', rent2_id::text, '2024-11-03'),
  ('upi_payment', 'bounced', 12000, 'UPI987654321', null, rent3_id::text, '2024-12-05'),
  ('nach_debit', 'bounced', 18000, 'NACH456789123', 'ICICI987654321', 'ALT_PAYMENT', '2024-12-06');

  INSERT INTO tax_configurations (taxType, rate, applicableOn, isActive, effectiveFrom, description, createdAt) VALUES
  ('gst', 18, 'commission', true, '2024-01-01', 'GST on platform commission', '2024-01-01'),
  ('tds', 2, 'service_payment', true, '2024-01-01', 'TDS on service payments', '2024-01-01'),
  ('income_tax', 30, 'commission', true, '2024-04-01', 'Income tax on profit', '2024-04-01');

  INSERT INTO financial_reports (reportType, period, data, generatedAt, generatedBy) VALUES
  ('monthly_revenue', '2024-11', '{"totalRevenue":145000,"totalCommission":145000,"totalPayouts":1285000,"transactionCount":45}'::jsonb, '2024-12-01', user4_id);

  INSERT INTO reconciliation_records (date, type, status, totalIncoming, totalOutgoing, platformBalance, reconciledBy, reconciledAt, createdAt) VALUES
  ('2024-12-01', 'daily', 'completed', 145000, 1285000, 145000, user4_id, '2024-12-02', '2024-12-01'),
  ('2024-11-30', 'daily', 'discrepancy_found', 125000, 1150000, 125000, null, null, '2024-11-30');

END $$;
