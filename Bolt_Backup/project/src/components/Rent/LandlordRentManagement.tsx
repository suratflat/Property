import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, Filter, Download, Info } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockRentPayments, mockProperties, mockUsers, mockRecurringPayments } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const LandlordRentManagement: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter data for current landlord
  const landlordRentPayments = mockRentPayments.filter(p => p.landlordId === user?.id);
  const landlordProperties = mockProperties.filter(p => p.landlordId === user?.id);
  const landlordRecurringPayments = mockRecurringPayments.filter(rp => rp.landlordId === user?.id);

  // Calculate statistics
  const totalRentExpected = landlordProperties.reduce((sum, p) => sum + (p.tenantId ? p.rent : 0), 0);
  const totalRentCollected = landlordRentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = landlordRentPayments.filter(p => p.status === 'pending');
  const overduePayments = landlordRentPayments.filter(p => p.status === 'overdue');

  // Filter payments based on status
  const filteredPayments = filterStatus === 'all' 
    ? landlordRentPayments 
    : landlordRentPayments.filter(p => p.status === filterStatus);

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = landlordProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Rent Management</h1>
        <p className="text-gray-600">Track rent payments and payouts from the platform</p>
      </div>

      {/* Payment Flow Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Flow Information</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• All rent payments are collected directly into the platform's company account</p>
              <p>• Platform commission/brokerage is automatically deducted from collected rent</p>
              <p>• Landlord payouts are processed only after successful collection and reconciliation</p>
              <p>• ECS/NACH mandate setup is managed by platform administrators only</p>
              <p>• You will receive notifications when payments are collected and payouts are processed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Expected</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRentExpected)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collected This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRentCollected)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Collection</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPayments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{overduePayments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Auto-Debit Setup Overview - Read Only for Landlords */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Auto-Debit Setup (Read-Only)</h3>
          <div className="text-sm text-gray-500">Managed by Platform Administrators</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landlordRecurringPayments.map((setup) => (
            <div key={setup.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{getPropertyTitle(setup.propertyId)}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  setup.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : setup.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {setup.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Tenant: {getUserName(setup.tenantId)}</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(setup.amount)}</p>
              <p className="text-xs text-gray-500">Auto-debit on {setup.debitDate}th of every month</p>
              {setup.bankAccount && (
                <p className="text-xs text-gray-400 mt-1">Bank: {setup.bankAccount}</p>
              )}
              <div className="mt-3 text-xs text-gray-500">
                <p>Note: ECS/NACH setup managed by platform administrators</p>
              </div>
            </div>
          ))}
        </div>
        {landlordRecurringPayments.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Auto-Debit Setup</h4>
            <p className="text-gray-600 mb-4">Contact platform administrators to set up automatic rent collection</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ECS/NACH mandate creation is handled by platform administrators to ensure security and compliance.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending Collection</option>
                <option value="paid">Collected</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Rent Payments & Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rent Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Payout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payout Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getPropertyTitle(payment.propertyId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getUserName(payment.tenantId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    {payment.isRecurring && (
                      <div className="text-xs text-blue-600">Auto-Debit</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.platformCommissionAmount ? formatCurrency(payment.platformCommissionAmount) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {payment.landlordPayoutAmount ? formatCurrency(payment.landlordPayoutAmount) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'paid' ? 'Collected' : payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.payoutStatus === 'processed' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.payoutStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.payoutStatus || 'N/A'}
                    </span>
                    {payment.payoutDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Paid: {new Date(payment.payoutDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString()}
                    {payment.paidDate && (
                      <div className="text-xs text-green-600">
                        Collected: {new Date(payment.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Flow Explanation */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How Payment Processing Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Collection</h4>
            <p className="text-sm text-gray-600">
              Rent is collected directly from tenant into platform's company account via ECS/NACH/UPI
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Processing</h4>
            <p className="text-sm text-gray-600">
              Platform commission/brokerage is deducted and reconciliation is performed
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Payout</h4>
            <p className="text-sm text-gray-600">
              Net amount (after commission) is transferred to your registered bank account
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LandlordRentManagement;