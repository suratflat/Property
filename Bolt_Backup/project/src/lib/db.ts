import { supabase } from './supabase';
import type { User, Property, RentPayment, ServiceRequest, UtilityBill, Agreement } from '../types';

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;
  return data as User[];
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as User | null;
}

export async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*');

  if (error) throw error;
  return data as Property[];
}

export async function getPropertiesForLandlord(landlordId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('landlordId', landlordId);

  if (error) throw error;
  return data as Property[];
}

export async function getPropertiesForTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('tenantId', tenantId);

  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Property | null;
}

export async function getRentPayments() {
  const { data, error } = await supabase
    .from('rent_payments')
    .select('*')
    .order('dueDate', { ascending: false });

  if (error) throw error;
  return data as RentPayment[];
}

export async function getRentPaymentsForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('rent_payments')
    .select('*')
    .eq('propertyId', propertyId)
    .order('dueDate', { ascending: false });

  if (error) throw error;
  return data as RentPayment[];
}

export async function getRentPaymentsForTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('rent_payments')
    .select('*')
    .eq('tenantId', tenantId)
    .order('dueDate', { ascending: false });

  if (error) throw error;
  return data as RentPayment[];
}

export async function getServiceRequests() {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as ServiceRequest[];
}

export async function getServiceRequestsForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('propertyId', propertyId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as ServiceRequest[];
}

export async function getServiceRequestsForProvider(providerId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('serviceProviderId', providerId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as ServiceRequest[];
}

export async function getUtilityBills() {
  const { data, error } = await supabase
    .from('utility_bills')
    .select('*')
    .order('dueDate', { ascending: false });

  if (error) throw error;
  return data as UtilityBill[];
}

export async function getUtilityBillsForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('utility_bills')
    .select('*')
    .eq('propertyId', propertyId)
    .order('dueDate', { ascending: false });

  if (error) throw error;
  return data as UtilityBill[];
}

export async function getAgreements() {
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Agreement[];
}

export async function getAgreementsForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('propertyId', propertyId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Agreement[];
}
