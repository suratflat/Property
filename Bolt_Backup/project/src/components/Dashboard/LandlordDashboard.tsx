import React, { useState } from 'react';
import { Building2, Users, CreditCard, Wrench, TrendingUp, AlertCircle, Zap, Calendar } from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../Common/Card';
import Button from '../Common/Button';
import PaymentGateway from '../Payments/PaymentGateway';
import { mockProperties, mockRentPayments, mockServiceRequests, mockUtilityBills, mockUsers, mockRecurringPayments } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const LandlordDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Filter data based on landlord
  const landlordProperties = mockProperties.filter(p => p.landlordId === user?.id);
  const totalProperties = landlordProperties.length;
  const occupiedProperties = landlordProperties.filter(p => p.status === 'occupied').length;
  const availableProperties = landlordProperties.filter(p => p.status === 'available').length;
  const totalRentExpected = landlordProperties.reduce((sum, p) => sum + (p.tenantId ? p.rent : 0), 0);
  
  const landlordRentPayments = mockRentPayments.filter(r => r.landlordId === user?.id);
  const pendingRentPayments = landlordRentPayments.filter(r => r.status === 'pending').length;
  
  const landlordServiceRequests = mockServiceRequests.filter(r => r.landlordId === user?.id);
  const pendingRequests = landlordServiceRequests.filter(r => r.status === 'pending').length;

  // Get utility bills for landlord's properties
  const landlordUtilityBills = mockUtilityBills.filter(bill => 
    landlordProperties.some(property => property.id === bill.propertyId)
  );

  const recentPayments = landlordRentPayments.slice(0, 3);
  const recentRequests = landlordServiceRequests.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = landlordProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const handleRentCollection = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setShowPaymentGateway(false);
    setSelectedPayment(null);
    // Here you would update the payment status in your state management
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Landlord Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Occupied Units"
          value={occupiedProperties}
          icon={Users}
          color="secondary"
        />
        <StatsCard
          title="Monthly Rent"
          value={formatCurrency(totalRentExpected)}
          icon={CreditCard}
          color="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={AlertCircle}
          color="warning"
        />
      </div>

      {/* Rent Collection & Recurring Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Rent Collection</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
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
                    {getPropertyTitle(payment.propertyId)} • {getUserName(payment.tenantId)}
                  </p>
                  <p className="text-sm text-gray-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : payment.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                  {payment.status === 'pending' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleRentCollection(payment)}
                    >
                      Collect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{request.title}</p>
                  <p className="text-sm text-gray-500">
                    {getPropertyTitle(request.propertyId)} • {getUserName(request.tenantId)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{request.category} • {request.priority} priority</p>
                  {request.estimatedCost && (
                    <p className="text-sm text-green-600">Estimate: {formatCurrency(request.estimatedCost)}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : request.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : request.status === 'assigned'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Utility Bills Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Utility Bills Status</h3>
          <Button variant="outline" size="sm">View All Bills</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landlordUtilityBills.slice(0, 6).map((bill) => (
            <div key={bill.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap className={`h-4 w-4 mr-2 ${bill.type === 'electricity' ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <span className="text-sm font-medium text-gray-900">{bill.provider}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bill.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bill.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{getPropertyTitle(bill.propertyId)}</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(bill.amount)}</p>
              <p className="text-xs text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p className="text-xs text-gray-400">Period: {bill.billPeriod}</p>
              {bill.tenantId && (
                <p className="text-xs text-gray-500 mt-1">Tenant: {getUserName(bill.tenantId)}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recurring Payment Setup */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recurring Payment Setup</h3>
          <Button variant="primary" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            Setup Auto-Debit
          </Button>
        </div>
        <div className="space-y-4">
          {mockRecurringPayments.filter(rp => rp.landlordId === user?.id).map((setup) => (
            <div key={setup.id} className="flex items-center justify-between py-3 border border-gray-200 rounded-lg px-4">
              <div>
                <p className="font-medium text-gray-900">{getPropertyTitle(setup.propertyId)}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(setup.amount)} • Auto-debit on {setup.debitDate}th of every month
                </p>
                <p className="text-sm text-gray-500">Tenant: {getUserName(setup.tenantId)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  setup.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : setup.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {setup.status}
                </span>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">ECS/NACH Auto-Debit</p>
              <p className="text-sm text-blue-700">
                Set up automatic rent collection with customizable debit dates. Requires tenant's bank mandate approval.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{totalProperties}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
            <div className="text-xs text-gray-500">Owned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{occupiedProperties}</div>
            <div className="text-sm text-gray-600">Occupied Properties</div>
            <div className="text-xs text-gray-500">Generating Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{availableProperties}</div>
            <div className="text-sm text-gray-600">Available for Rent</div>
            <div className="text-xs text-gray-500">Ready to Lease</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingRentPayments}</div>
            <div className="text-sm text-gray-600">Pending Payments</div>
            <div className="text-xs text-gray-500">Requires Action</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" className="h-12">
            <Building2 className="mr-2 h-4 w-4" />
            Add Property
          </Button>
          <Button variant="secondary" className="h-12">
            <Users className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
          <Button variant="success" className="h-12">
            <CreditCard className="mr-2 h-4 w-4" />
            Collect Rent
          </Button>
          <Button variant="warning" className="h-12">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </Button>
        </div>
      </Card>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && selectedPayment && (
        <PaymentGateway
          amount={selectedPayment.amount}
          description={`Rent payment for ${getPropertyTitle(selectedPayment.propertyId)}`}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPaymentGateway(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default LandlordDashboard;