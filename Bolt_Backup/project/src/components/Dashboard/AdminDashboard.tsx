import React, { useState } from 'react';
import { BarChart3, Users, Building2, CreditCard, TrendingUp, AlertCircle, DollarSign, Shield, Wrench, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatsCard from './StatsCard';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockProperties, mockUsers, mockRentPayments, mockServiceRequests, mockUtilityBills, mockPlatformTransactions } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate platform statistics
  const totalProperties = mockProperties.length;
  const occupiedProperties = mockProperties.filter(p => p.status === 'occupied').length;
  const totalUsers = mockUsers.length;
  const landlords = mockUsers.filter(u => u.role === 'landlord').length;
  const tenants = mockUsers.filter(u => u.role === 'tenant').length;
  const serviceProviders = mockUsers.filter(u => u.role === 'service_provider').length;

  // Financial calculations
  const totalRevenue = mockPlatformTransactions
    .filter(t => t.type === 'commission_earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayouts = mockPlatformTransactions
    .filter(t => t.type === 'landlord_payout' || t.type === 'service_provider_payout')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingRentPayments = mockRentPayments.filter(p => p.status === 'pending').length;
  const pendingServiceRequests = mockServiceRequests.filter(r => r.status === 'pending').length;
  const pendingUtilityBills = mockUtilityBills.filter(b => b.status === 'pending').length;

  // Mock data for charts
  const monthlyRevenueData = [
    { month: 'Jan', commission: 45000, payouts: 380000, users: 45 },
    { month: 'Feb', commission: 52000, payouts: 420000, users: 52 },
    { month: 'Mar', commission: 48000, payouts: 395000, users: 58 },
    { month: 'Apr', commission: 58000, payouts: 465000, users: 65 },
    { month: 'May', commission: 62000, payouts: 485000, users: 72 },
    { month: 'Jun', commission: 67000, payouts: 520000, users: 78 },
  ];

  const userGrowthData = [
    { month: 'Jan', landlords: 25, tenants: 45, serviceProviders: 12 },
    { month: 'Feb', landlords: 28, tenants: 52, serviceProviders: 15 },
    { month: 'Mar', landlords: 32, tenants: 58, serviceProviders: 18 },
    { month: 'Apr', landlords: 35, tenants: 65, serviceProviders: 22 },
    { month: 'May', landlords: 38, tenants: 72, serviceProviders: 25 },
    { month: 'Jun', landlords: 42, tenants: 78, serviceProviders: 28 },
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 65, color: '#3b82f6' },
    { name: 'Houses', value: 25, color: '#10b981' },
    { name: 'Commercial', value: 10, color: '#f59e0b' },
  ];

  const recentActivities = [
    { id: 1, type: 'payment', description: 'Rent payment received - 3BHK Premium Apartment', amount: 25000, time: '2 hours ago' },
    { id: 2, type: 'user', description: 'New landlord registered - Vikram Mehta', time: '4 hours ago' },
    { id: 3, type: 'service', description: 'Service request completed - Kitchen Sink Repair', amount: 2500, time: '6 hours ago' },
    { id: 4, type: 'property', description: 'New property listed - 2BHK Modern Flat', time: '8 hours ago' },
    { id: 5, type: 'payment', description: 'Commission earned from rent collection', amount: 1250, time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the PropertyHub admin panel. Monitor platform performance and manage operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-1" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Properties"
          value={totalProperties}
          icon={Building2}
          color="primary"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="secondary"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Pending Actions"
          value={pendingRentPayments + pendingServiceRequests}
          icon={AlertCircle}
          color="warning"
        />
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Platform Performance</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
              <Bar dataKey="commission" fill="#3b82f6" name="Commission" />
              <Bar dataKey="payouts" fill="#10b981" name="Payouts" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Property Distribution</h3>
            <Building2 className="h-5 w-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Growth and Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
            <Users className="h-5 w-5 text-secondary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="landlords" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="tenants" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="serviceProviders" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Landlords</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Tenants</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Service Providers</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Total Commission Earned</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Total Payouts</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPayouts)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-primary-900">Net Platform Revenue</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'payment' ? 'bg-green-100' :
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'service' ? 'bg-yellow-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-green-600" />}
                  {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'service' && <Wrench className="h-4 w-4 text-yellow-600" />}
                  {activity.type === 'property' && <Building2 className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.amount && (
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(activity.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {pendingRentPayments > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Pending Rent Payments</p>
                    <p className="text-sm text-yellow-800">{pendingRentPayments} payments require attention</p>
                  </div>
                </div>
              </div>
            )}
            
            {pendingServiceRequests > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Pending Service Requests</p>
                    <p className="text-sm text-blue-800">{pendingServiceRequests} requests need assignment</p>
                  </div>
                </div>
              </div>
            )}

            {pendingUtilityBills > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Overdue Utility Bills</p>
                    <p className="text-sm text-red-800">{pendingUtilityBills} bills are overdue</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">KYC Verification</p>
                  <p className="text-sm text-green-800">
                    {mockUsers.filter(u => u.kycRequestStatus === 'verified').length} users verified, 
                    {' '}{mockUsers.filter(u => u.kycRequestStatus === 'requested').length} pending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" className="h-12">
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
          <Button variant="secondary" className="h-12">
            <Building2 className="mr-2 h-4 w-4" />
            View Properties
          </Button>
          <Button variant="success" className="h-12">
            <BarChart3 className="mr-2 h-4 w-4" />
            Financial Reports
          </Button>
          <Button variant="outline" className="h-12">
            <Shield className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;