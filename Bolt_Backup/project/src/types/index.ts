export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'landlord' | 'tenant' | 'service_provider' | 'admin' | 'superadmin';
  avatar?: string;
  isKYCVerified: boolean;
  kycRequestStatus?: 'none' | 'requested' | 'submitted' | 'verified' | 'rejected';
  panCardNumber?: string;
  aadhaarNumber?: string;
  serviceProviderCategory?: ServiceCategory;
  adminPermissions?: AdminPermissions;
  createdAt: string;
}

export interface AdminPermissions {
  // User Management
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  
  // Property Management
  propertyManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  
  // Agreement Management
  agreementManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  
  // Financial Management
  financialManagement: {
    view: boolean;
    edit: boolean;
    reports: boolean;
    reconciliation: boolean;
  };
  
  // Payment Gateway
  paymentGateway: {
    view: boolean;
    configure: boolean;
  };
  
  // KYC Management
  kycManagement: {
    view: boolean;
    approve: boolean;
    reject: boolean;
  };
  
  // System Settings
  systemSettings: {
    view: boolean;
    edit: boolean;
  };
  
  // Reports
  reports: {
    view: boolean;
    export: boolean;
  };
  
  // Smart Banking
  smartBanking: {
    view: boolean;
    configure: boolean;
  };
  
  // Tax Management
  taxManagement: {
    view: boolean;
    configure: boolean;
  };
  
  // Service Requests
  serviceRequests: {
    view: boolean;
    assign: boolean;
    manage: boolean;
  };
}

export type ServiceCategory = 
  | 'electrician' 
  | 'carpenter' 
  | 'painter' 
  | 'welding' 
  | 'tiles_repair' 
  | 'leakage_repair' 
  | 'plumber' 
  | 'cleaner' 
  | 'general' 
  | 'other';

interface Brokerage {
  type: 'fixed' | 'percentage';
  value: number; // Amount in rupees for 'fixed', percentage for 'percentage'
  collectionType: 'upfront' | 'recurring';
  description?: string;
  waived: boolean; // Enhanced field to indicate if brokerage is waived
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: 'apartment' | 'house' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  rent: number;
  deposit: number;
  landlordId: string;
  tenantId?: string;
  status: 'available' | 'occupied' | 'maintenance';
  images: string[];
  amenities: string[];
  dgvclConsumerNumber?: string;
  gujaratGasConsumerNumber?: string;
  googleMapsLocation?: string;
  landlordBrokerage?: Brokerage; // Separate brokerage for landlord
  tenantBrokerage?: Brokerage; // Separate brokerage for tenant
  createdAt: string;
}

export interface RentPayment {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  baseRentAmount: number; // Base rent without any additions
  tenantBrokerageAmount?: number; // Brokerage charged to tenant
  tenantLegalChargesAmount?: number; // Legal charges for tenant
  tenantServiceChargesAmount?: number; // Pending service charges for tenant
  totalTenantAmount: number; // Total amount debited from tenant
  landlordBrokerageAmount?: number; // Brokerage deducted from landlord
  landlordLegalChargesAmount?: number; // Legal charges deducted from landlord
  landlordServiceChargesAmount?: number; // Service charges deducted from landlord
  netLandlordAmount: number; // Net amount paid to landlord
  platformCommissionAmount: number; // Total platform commission
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  isRecurring?: boolean;
  recurringSetupId?: string;
  payoutStatus?: 'pending' | 'processed' | 'failed';
  payoutTransactionId?: string;
  payoutDate?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  serviceProviderId?: string;
  serviceProviderCategory: ServiceCategory;
  category: ServiceCategory; // Keeping for backward compatibility
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'estimate_submitted' | 'in_progress' | 'completed' | 'rejected' | 'tenant_responsibility';
  estimatedCost?: number;
  actualCost?: number;
  platformFeeAmount?: number; // Platform fee on service payment
  netServiceProviderAmount?: number; // Net amount paid to service provider
  landlordApprovalStatus?: 'pending' | 'approved' | 'rejected' | 'negotiating';
  landlordComment?: string;
  scheduledDate?: string;
  completedDate?: string;
  images: string[];
  paymentResponsibility?: 'landlord' | 'tenant';
  serviceProviderPayoutAmount?: number;
  serviceProviderPayoutStatus?: 'pending' | 'processed' | 'failed';
  serviceProviderPayoutTransactionId?: string;
  serviceProviderPayoutDate?: string;
  createdAt: string;
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  tenantId?: string;
  type: 'electricity' | 'gas';
  provider: 'DGVCL' | 'Gujarat Gas';
  consumerNumber: string;
  billNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  billPeriod: string;
  createdAt: string;
}

export interface Agreement {
  id: string;
  propertyId: string;
  landlordIds: string[];
  tenantIds: string[];
  type: 'leave_license';
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  terms: string[];
  status: 'draft' | 'pending_signature' | 'signed' | 'expired';
  signatories: {
    userId: string;
    role: 'landlord' | 'tenant';
    signed: boolean;
    signedAt?: string;
    aadhaarNumber?: string;
  }[];
  landlordBrokerage?: Brokerage; // Separate brokerage for landlord
  tenantBrokerage?: Brokerage; // Separate brokerage for tenant
  landlordLegalCharges?: number;
  tenantLegalCharges?: number;
  waiveLandlordLegalCharges?: boolean;
  waiveTenantLegalCharges?: boolean;
  createdAt: string;
}

export interface RecurringPaymentSetup {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  debitDate: number; // Day of month (1-31)
  status: 'active' | 'paused' | 'cancelled';
  mandateId?: string;
  bankAccount?: string;
  createdAt: string;
}

export interface PlatformTransaction {
  id: string;
  type: 'commission_earned' | 'landlord_payout' | 'service_provider_payout' | 'refund';
  referenceId: string; // ID of related payment/service request
  referenceType: 'rent_payment' | 'service_request' | 'brokerage';
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  transactionId?: string;
  processedDate?: string;
  description: string;
  fromUserId?: string;
  toUserId?: string;
  createdAt: string;
}

export interface BankingTransaction {
  id: string;
  type: 'ecs_debit' | 'nach_debit' | 'upi_payment' | 'card_payment' | 'bank_transfer';
  status: 'success' | 'failed' | 'bounced' | 'pending';
  amount: number;
  transactionId: string;
  bankReference?: string;
  bounceReason?: string;
  retryCount?: number;
  maxRetries?: number;
  nextRetryDate?: string;
  relatedPaymentId: string;
  createdAt: string;
}

export interface TaxConfiguration {
  id: string;
  taxType: 'gst' | 'tds' | 'income_tax';
  rate: number; // Percentage
  applicableOn: 'commission' | 'service_payment' | 'rent';
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  description: string;
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  reportType: 'monthly_revenue' | 'commission_summary' | 'payout_summary' | 'tax_summary';
  period: string; // YYYY-MM format
  data: {
    totalRevenue?: number;
    totalCommission?: number;
    totalPayouts?: number;
    totalTax?: number;
    transactionCount?: number;
    bounceCount?: number;
    [key: string]: any;
  };
  generatedAt: string;
  generatedBy: string;
}

export interface ReconciliationRecord {
  id: string;
  date: string;
  type: 'daily' | 'monthly' | 'manual';
  status: 'pending' | 'completed' | 'discrepancy_found';
  totalIncoming: number;
  totalOutgoing: number;
  platformBalance: number;
  discrepancies?: {
    type: string;
    amount: number;
    description: string;
  }[];
  reconciledBy?: string;
  reconciledAt?: string;
  createdAt: string;
}