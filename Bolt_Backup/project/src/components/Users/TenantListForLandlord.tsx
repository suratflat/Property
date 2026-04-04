import React, { useState } from 'react';
import { Users, Mail, Phone, Home, Calendar, CreditCard, Shield, Eye, X } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockUsers, mockProperties, mockRentPayments } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const TenantListForLandlord: React.FC = () => {
  const { user } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showKYCModal, setShowKYCModal] = useState(false);

  // Get landlord's properties
  const landlordProperties = mockProperties.filter(p => p.landlordId === user?.id);
  
  // Get tenants for landlord's properties
  const landlordTenants = mockUsers.filter(u => 
    u.role === 'tenant' && landlordProperties.some(p => p.tenantId === u.id)
  );

  const getTenantProperty = (tenantId: string) => {
    return landlordProperties.find(p => p.tenantId === tenantId);
  };

  const getTenantPaymentStatus = (tenantId: string) => {
    const payments = mockRentPayments.filter(p => p.tenantId === tenantId && p.landlordId === user?.id);
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const paidPayments = payments.filter(p => p.status === 'paid');
    
    return {
      pending: pendingPayments.length,
      paid: paidPayments.length,
      totalPending: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
      totalPaid: paidPayments.reduce((sum, p) => sum + p.amount, 0)
    };
  };

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewKYC = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowKYCModal(true);
  };

  const maskPANCard = (panCard?: string) => {
    if (!panCard) return 'Not provided';
    return `${panCard.slice(0, 4)}****${panCard.slice(-2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Tenants</h1>
        <p className="text-gray-600">Manage and view information about your tenants</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-semibold text-gray-900">{landlordTenants.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupied Properties</p>
              <p className="text-2xl font-semibold text-gray-900">
                {landlordProperties.filter(p => p.tenantId).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockRentPayments.filter(p => p.landlordId === user?.id && p.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tenants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {landlordTenants.map((tenant) => {
          const property = getTenantProperty(tenant.id);
          const paymentStatus = getTenantPaymentStatus(tenant.id);
          
          return (
            <Card key={tenant.id} className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                    <p className="text-sm text-gray-500">Tenant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKYCStatusColor(tenant.kycRequestStatus)}`}>
                    KYC: {tenant.kycRequestStatus || 'none'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {tenant.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {tenant.phone}
                </div>
                {property && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    {property.title}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {new Date(tenant.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  PAN: {maskPANCard(tenant.panCardNumber)}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-sm font-semibold text-red-600">
                      ₹{paymentStatus.totalPending.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{paymentStatus.pending} payments</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Paid This Year</p>
                    <p className="text-sm font-semibold text-green-600">
                      ₹{paymentStatus.totalPaid.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{paymentStatus.paid} payments</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewKYC(tenant)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View KYC
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {landlordTenants.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tenants Yet</h3>
          <p className="text-gray-600 mb-4">
            You don't have any tenants assigned to your properties yet.
          </p>
          <Button variant="primary">Add Tenant to Property</Button>
        </Card>
      )}

      {/* KYC Details Modal */}
      {showKYCModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">KYC Details</h2>
                    <p className="text-gray-600">{selectedTenant.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowKYCModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* KYC Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Verification Status</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">KYC Status:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getKYCStatusColor(selectedTenant.kycRequestStatus)}`}>
                      {selectedTenant.kycRequestStatus || 'Not Started'}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTenant.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTenant.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTenant.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedTenant.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Document Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Document Information</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">PAN Card</h4>
                        {selectedTenant.panCardNumber ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Provided
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Not Provided
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedTenant.panCardNumber ? maskPANCard(selectedTenant.panCardNumber) : 'No PAN card information available'}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Aadhaar Card</h4>
                        {selectedTenant.kycRequestStatus === 'verified' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {selectedTenant.kycRequestStatus || 'Not Verified'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedTenant.kycRequestStatus === 'verified' 
                          ? 'Aadhaar verification completed' 
                          : 'Aadhaar verification pending'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                {getTenantProperty(selectedTenant.id) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Property Information</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {getTenantProperty(selectedTenant.id)?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {getTenantProperty(selectedTenant.id)?.address}, {getTenantProperty(selectedTenant.id)?.city}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Monthly Rent: ₹{getTenantProperty(selectedTenant.id)?.rent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowKYCModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TenantListForLandlord;