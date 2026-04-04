import React, { useState } from 'react';
import { CreditCard, Wrench, Zap, FileText, Home, AlertCircle, Calendar, CheckCircle, Info } from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../Common/Card';
import Button from '../Common/Button';
import PaymentGateway from '../Payments/PaymentGateway';
import { mockRentPayments, mockServiceRequests, mockUtilityBills, mockProperties } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);

  // Safely filter data for current tenant with null checks
  const tenantRentPayments = user?.id ? mockRentPayments.filter(p => p.tenantId === user.id) : [];
  const tenantServiceRequests = user?.id ? mockServiceRequests.filter(r => r.tenantId === user.id) : [];
  const tenantUtilityBills = user?.id ? mockUtilityBills.filter(b => b.tenantId === user.id) : [];
  const tenantProperty = user?.id ? mockProperties.find(p => p.tenantId === user.id) : null;

  const currentRent = tenantProperty?.rent || 0;
  const pendingPayments = tenantRentPayments.filter(p => p.status === 'pending').length;
  const activeRequests = tenantServiceRequests.filter(r => r.status !== 'completed').length;
  const pendingBills = tenantUtilityBills.filter(b => b.status === 'pending').length;

  const recentRentPayments = tenantRentPayments.slice(0, 3);
  const recentServiceRequests = tenantServiceRequests.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = (bill: any) => {
    setSelectedBill(bill);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setShowPaymentGateway(false);
    setSelectedBill(null);
  };

  // Show loading state if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tenant Dashboard</h1>
        <p className="text-gray-600">Manage your rent, maintenance requests, and utility bills.</p>
      </div>

      {/* Payment Flow Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment Processing</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• All payments are processed securely through the platform's payment gateway</p>
              <p>• Rent payments are collected into the company account and then distributed to landlords</p>
              <p>• Service request payments include platform fees and are settled with service providers</p>
              <p>• Auto-debit (ECS/NACH) setup is managed by platform administrators for your security</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Rent"
          value={formatCurrency(currentRent)}
          icon={Home}
          color="primary"
        />
        <StatsCard
          title="Pending Payments"
          value={pendingPayments}
          icon={CreditCard}
          color="warning"
        />
        <StatsCard
          title="Active Requests"
          value={activeRequests}
          icon={Wrench}
          color="secondary"
        />
        <StatsCard
          title="Utility Bills Due"
          value={pendingBills}
          icon={Zap}
          color="danger"
        />
      </div>

      {/* Quick Pay Section */}
      {pendingPayments > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">December Rent Due</h3>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(currentRent)}</p>
              <p className="text-sm text-gray-600">Due Date: 5th December 2024</p>
              {tenantRentPayments.find(p => p.status === 'pending' && p.isRecurring) && (
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Auto-debit enabled (Managed by Platform)</span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => handlePayment({ 
                  id: 'rent', 
                  amount: currentRent, 
                  description: 'Monthly Rent Payment - Collected by Platform' 
                })}
              >
                Pay with UPI
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handlePayment({ 
                  id: 'rent', 
                  amount: currentRent, 
                  description: 'Monthly Rent Payment - Collected by Platform' 
                })}
              >
                Pay with Card
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Rent Payment History and Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Rent Payment History</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentRentPayments.length > 0 ? recentRentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                    {payment.isRecurring && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Auto-Debit
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {payment.paidDate ? `Paid: ${new Date(payment.paidDate).toLocaleDateString()}` : `Due: ${new Date(payment.dueDate).toLocaleDateString()}`}
                  </p>
                  {payment.transactionId && (
                    <p className="text-xs text-gray-400">TXN: {payment.transactionId}</p>
                  )}
                  <p className="text-xs text-blue-600">Processed via Platform Gateway</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : payment.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-4">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No payment history available</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Service Requests</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentServiceRequests.length > 0 ? recentServiceRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{request.title}</p>
                  <p className="text-sm text-gray-500 capitalize">{request.category} • {request.priority} priority</p>
                  {request.scheduledDate && (
                    <p className="text-xs text-gray-400">
                      Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
                    </p>
                  )}
                  {request.status === 'tenant_responsibility' && request.landlordComment && (
                    <p className="text-xs text-orange-600 mt-1">
                      Landlord: {request.landlordComment}
                    </p>
                  )}
                  {request.actualCost && (
                    <p className="text-xs text-blue-600">
                      Payment processed via Platform (includes fees)
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : request.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : request.status === 'assigned'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'tenant_responsibility'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
            )) : (
              <div className="text-center py-4">
                <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No service requests yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Utility Bills Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Utility Bills</h3>
          <Button variant="outline" size="sm">View All Bills</Button>
        </div>
        {tenantUtilityBills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenantUtilityBills.map((bill) => (
              <div key={bill.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Zap className={`h-5 w-5 mr-2 ${bill.type === 'electricity' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    <span className="font-medium text-gray-900">{bill.provider}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    bill.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(bill.amount)}</p>
                <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400">Bill Period: {bill.billPeriod}</p>
                <p className="text-xs text-gray-400">Consumer No: {bill.consumerNumber}</p>
                {bill.status === 'pending' && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => handlePayment({
                      id: bill.id,
                      amount: bill.amount,
                      description: `${bill.provider} Bill - ${bill.billPeriod} (Platform Processed)`
                    })}
                  >
                    Pay Now
                  </Button>
                )}
                {bill.status === 'paid' && bill.paidDate && (
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">
                      Paid on {new Date(bill.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Utility Bills</h4>
            <p className="text-gray-600">No utility bills found for your property.</p>
          </div>
        )}
      </Card>

      {/* Auto-Debit Information (Read-only) */}
      {tenantRentPayments.some(p => p.isRecurring) && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Auto-Debit Setup</h3>
            <span className="text-sm text-gray-500">(Managed by Platform)</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">ECS/NACH Auto-Debit Active</p>
                <p className="text-sm text-green-700">
                  Your rent of {formatCurrency(currentRent)} will be automatically debited on the 5th of every month.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Note: Auto-debit settings are managed by platform administrators for security and compliance.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Processing Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Processing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Secure Collection</h4>
            <p className="text-sm text-gray-600">
              All payments are processed through secure platform gateway with multiple payment options
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Automatic Distribution</h4>
            <p className="text-sm text-gray-600">
              Platform automatically distributes payments to landlords and service providers after processing
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Transaction Records</h4>
            <p className="text-sm text-gray-600">
              Complete transaction history and receipts available for all your payments
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="primary" 
            className="h-12"
            onClick={() => handlePayment({ 
              id: 'rent', 
              amount: currentRent, 
              description: 'Monthly Rent Payment - Platform Processed' 
            })}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Rent
          </Button>
          <Button variant="secondary" className="h-12">
            <Wrench className="mr-2 h-4 w-4" />
            Service Request
          </Button>
          <Button variant="warning" className="h-12">
            <Zap className="mr-2 h-4 w-4" />
            Pay Utilities
          </Button>
          <Button variant="outline" className="h-12">
            <FileText className="mr-2 h-4 w-4" />
            View Agreement
          </Button>
        </div>
      </Card>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && selectedBill && (
        <PaymentGateway
          amount={selectedBill.amount}
          description={selectedBill.description}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPaymentGateway(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
};

export default TenantDashboard;