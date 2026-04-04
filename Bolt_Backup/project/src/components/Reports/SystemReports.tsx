import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, Building2, CreditCard, Wrench, Zap, AlertTriangle, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockRentPayments, mockUtilityBills, mockProperties, mockUsers, mockServiceRequests } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const SystemReports: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter data based on user role
  const isLandlord = user?.role === 'landlord';
  const landlordProperties = isLandlord ? mockProperties.filter(p => p.landlordId === user.id) : mockProperties;
  const landlordRentPayments = isLandlord ? mockRentPayments.filter(r => r.landlordId === user.id) : mockRentPayments;
  const landlordUtilityBills = isLandlord ? mockUtilityBills.filter(b => 
    landlordProperties.some(property => property.id === b.propertyId)
  ) : mockUtilityBills;
  const landlordServiceRequests = isLandlord ? mockServiceRequests.filter(r => r.landlordId === user.id) : mockServiceRequests;

  // Calculate statistics
  const totalRentCollected = landlordRentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUtilityBillsPaid = landlordUtilityBills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalMaintenanceExpenses = landlordServiceRequests
    .filter(r => r.status === 'completed' && r.actualCost)
    .reduce((sum, r) => sum + (r.actualCost || 0), 0);

  const pendingRentPayments = landlordRentPayments.filter(p => p.status === 'pending');
  const pendingUtilityBills = landlordUtilityBills.filter(b => b.status === 'pending');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate Property Profit/Loss
  const calculatePropertyProfitLoss = () => {
    return landlordProperties.map(property => {
      const rentCollected = landlordRentPayments
        .filter(p => p.propertyId === property.id && p.status === 'paid')
        .filter(p => new Date(p.paidDate || p.dueDate).getFullYear() === selectedYear)
        .reduce((sum, p) => sum + p.amount, 0);

      const maintenanceExpenses = landlordServiceRequests
        .filter(r => r.propertyId === property.id && r.status === 'completed' && r.actualCost)
        .filter(r => new Date(r.completedDate || r.createdAt).getFullYear() === selectedYear)
        .reduce((sum, r) => sum + (r.actualCost || 0), 0);

      const utilityExpenses = landlordUtilityBills
        .filter(b => b.propertyId === property.id && b.status === 'paid')
        .filter(b => new Date(b.paidDate || b.dueDate).getFullYear() === selectedYear)
        .reduce((sum, b) => sum + b.amount, 0);

      const totalExpenses = maintenanceExpenses + utilityExpenses;
      const netProfit = rentCollected - totalExpenses;

      return {
        propertyId: property.id,
        propertyTitle: property.title,
        rentCollected,
        maintenanceExpenses,
        utilityExpenses,
        totalExpenses,
        netProfit,
        profitMargin: rentCollected > 0 ? ((netProfit / rentCollected) * 100) : 0
      };
    });
  };

  const propertyProfitLoss = calculatePropertyProfitLoss();

  // Mock data for charts (adjusted for landlord view)
  const revenueData = [
    { month: 'Jan', rent: isLandlord ? 45000 : 125000, utilities: isLandlord ? 15000 : 45000, properties: isLandlord ? 15 : 45 },
    { month: 'Feb', rent: isLandlord ? 48000 : 132000, utilities: isLandlord ? 16000 : 48000, properties: isLandlord ? 16 : 48 },
    { month: 'Mar', rent: isLandlord ? 46000 : 128000, utilities: isLandlord ? 14000 : 42000, properties: isLandlord ? 15 : 46 },
    { month: 'Apr', rent: isLandlord ? 52000 : 145000, utilities: isLandlord ? 18000 : 52000, properties: isLandlord ? 17 : 52 },
    { month: 'May', rent: isLandlord ? 55000 : 158000, utilities: isLandlord ? 19000 : 55000, properties: isLandlord ? 18 : 55 },
    { month: 'Jun', rent: isLandlord ? 58000 : 162000, utilities: isLandlord ? 20000 : 58000, properties: isLandlord ? 19 : 58 },
  ];

  const userGrowthData = isLandlord ? [
    { month: 'Jan', tenants: 15 },
    { month: 'Feb', tenants: 16 },
    { month: 'Mar', tenants: 15 },
    { month: 'Apr', tenants: 17 },
    { month: 'May', tenants: 18 },
    { month: 'Jun', tenants: 19 },
  ] : [
    { month: 'Jan', landlords: 25, tenants: 45, serviceProviders: 12 },
    { month: 'Feb', landlords: 28, tenants: 52, serviceProviders: 15 },
    { month: 'Mar', landlords: 32, tenants: 58, serviceProviders: 18 },
    { month: 'Apr', landlords: 35, tenants: 65, serviceProviders: 22 },
    { month: 'May', landlords: 38, tenants: 72, serviceProviders: 25 },
    { month: 'Jun', landlords: 42, tenants: 78, serviceProviders: 28 },
  ];

  const serviceRequestData = [
    { name: 'Plumber', value: 35, color: '#3b82f6' },
    { name: 'Electrician', value: 25, color: '#10b981' },
    { name: 'Carpenter', value: 20, color: '#f59e0b' },
    { name: 'Painter', value: 15, color: '#ef4444' },
    { name: 'General', value: 5, color: '#8b5cf6' },
  ];

  const paymentStatusData = [
    { name: 'Paid', value: 78, color: '#10b981' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Overdue', value: 7, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isLandlord ? 'Property Reports' : 'System Reports'}
          </h1>
          <p className="text-gray-600">
            {isLandlord ? 'Analytics and insights for your properties' : 'Analytics and insights for platform performance'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRentCollected + totalUtilityBillsPaid)}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-50 rounded-lg">
              <Building2 className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {isLandlord ? 'My Properties' : 'Active Properties'}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{landlordProperties.length}</p>
              <div className="text-sm text-green-600">
                {landlordProperties.filter(p => p.status === 'occupied').length} occupied • {' '}
                {landlordProperties.filter(p => p.status === 'available').length} available
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {isLandlord ? 'My Tenants' : 'Total Users'}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLandlord ? landlordProperties.filter(p => p.tenantId).length : mockUsers.length}
              </p>
              <p className="text-sm text-green-600">+18% growth</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingRentPayments.length + pendingUtilityBills.length}</p>
              <p className="text-sm text-red-600">Requires attention</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Property Profit/Loss Statement */}
      {isLandlord && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Annual Property Profit/Loss Statement</h3>
              <p className="text-sm text-gray-600">Financial performance for year {selectedYear}</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent Collected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilities</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Profit/Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propertyProfitLoss.map((property) => (
                  <tr key={property.propertyId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.propertyTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.rentCollected)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.maintenanceExpenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.utilityExpenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.totalExpenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={property.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(property.netProfit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={property.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {property.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(propertyProfitLoss.reduce((sum, p) => sum + p.rentCollected, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(propertyProfitLoss.reduce((sum, p) => sum + p.maintenanceExpenses, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(propertyProfitLoss.reduce((sum, p) => sum + p.utilityExpenses, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(propertyProfitLoss.reduce((sum, p) => sum + p.totalExpenses, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={propertyProfitLoss.reduce((sum, p) => sum + p.netProfit, 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(propertyProfitLoss.reduce((sum, p) => sum + p.netProfit, 0))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={propertyProfitLoss.reduce((sum, p) => sum + p.profitMargin, 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {(propertyProfitLoss.reduce((sum, p) => sum + p.profitMargin, 0) / propertyProfitLoss.length).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Revenue and Property Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
              <Bar dataKey="rent" fill="#3b82f6" name="Rent" />
              <Bar dataKey="utilities" fill="#10b981" name="Utilities" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isLandlord ? 'Tenant Growth' : 'User Growth'}
            </h3>
            <Users className="h-5 w-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {isLandlord ? (
                <Line type="monotone" dataKey="tenants" stroke="#3b82f6" strokeWidth={2} />
              ) : (
                <>
                  <Line type="monotone" dataKey="landlords" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="tenants" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="serviceProviders" stroke="#f59e0b" strokeWidth={2} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {isLandlord ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Tenants</span>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Service Requests and Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Service Request Categories</h3>
            <Wrench className="h-5 w-5 text-yellow-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceRequestData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {serviceRequestData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
            <CreditCard className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pending Payments Report */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Pending Payments Report</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Pending Rent Payments */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Pending Rent Payments</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRentPayments.map((payment) => {
                    const property = landlordProperties.find(p => p.id === payment.propertyId);
                    const tenant = mockUsers.find(u => u.id === payment.tenantId);
                    return (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {property?.title || 'Unknown Property'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tenant?.name || 'Unknown Tenant'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Utility Bills */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Pending Utility Bills</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumer No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUtilityBills.map((bill) => {
                    const property = landlordProperties.find(p => p.id === bill.propertyId);
                    const tenant = mockUsers.find(u => u.id === bill.tenantId);
                    return (
                      <tr key={bill.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {property?.title || 'Unknown Property'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tenant?.name || 'No Tenant Assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Zap className={`h-4 w-4 mr-2 ${bill.type === 'electricity' ? 'text-yellow-500' : 'text-blue-500'}`} />
                            {bill.provider}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.consumerNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(bill.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(bill.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            {bill.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{landlordProperties.length}</div>
            <div className="text-sm text-gray-600">{isLandlord ? 'My Properties' : 'Total Properties'}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRentCollected).replace('₹', '₹')}</div>
            <div className="text-sm text-gray-600">Rent Collected</div>
            <div className="text-xs text-gray-500">This Year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalMaintenanceExpenses).replace('₹', '₹')}</div>
            <div className="text-sm text-gray-600">Maintenance Expenses</div>
            <div className="text-xs text-gray-500">This Year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingRentPayments.length + pendingUtilityBills.length}</div>
            <div className="text-sm text-gray-600">Pending Payments</div>
            <div className="text-xs text-gray-500">Requires Action</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemReports;