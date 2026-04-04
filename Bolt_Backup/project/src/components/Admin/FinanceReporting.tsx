import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Building2, Calculator, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockPlatformTransactions, mockRentPayments, mockProperties, mockUsers } from '../../data/mockData';

const FinanceReporting: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate financial metrics
  const totalRevenue = mockPlatformTransactions
    .filter(t => t.type === 'commission_earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayouts = mockPlatformTransactions
    .filter(t => t.type === 'landlord_payout' || t.type === 'service_provider_payout')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalPayouts;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

  // Mock data for charts
  const monthlyRevenueData = [
    { month: 'Jan', commission: 45000, payouts: 380000, netProfit: 45000 },
    { month: 'Feb', commission: 52000, payouts: 420000, netProfit: 52000 },
    { month: 'Mar', commission: 48000, payouts: 395000, netProfit: 48000 },
    { month: 'Apr', commission: 58000, payouts: 465000, netProfit: 58000 },
    { month: 'May', commission: 62000, payouts: 485000, netProfit: 62000 },
    { month: 'Jun', commission: 67000, payouts: 520000, netProfit: 67000 },
  ];

  const commissionBreakdown = [
    { name: 'Rent Commission', value: 75, color: '#3b82f6' },
    { name: 'Service Commission', value: 15, color: '#10b981' },
    { name: 'Late Fees', value: 8, color: '#f59e0b' },
    { name: 'Other', value: 2, color: '#ef4444' },
  ];

  const payoutBreakdown = [
    { name: 'Landlord Payouts', value: 85, color: '#3b82f6' },
    { name: 'Service Provider Payouts', value: 15, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Finance & Reporting</h1>
          <p className="text-gray-600">Comprehensive financial analytics and reporting</p>
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
            <Download className="h-4 w-4 mr-1" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payouts</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalPayouts)}</p>
              <p className="text-sm text-blue-600">Automated settlements</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Calculator className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(netProfit)}</p>
              <p className="text-sm text-primary-600">{profitMargin.toFixed(1)}% margin</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Building2 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{mockProperties.length}</p>
              <p className="text-sm text-yellow-600">Revenue generating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue and Profit Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Revenue Trend</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
              <Bar dataKey="commission" fill="#3b82f6" name="Commission" />
              <Bar dataKey="netProfit" fill="#10b981" name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Payout Trend</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
              <Line type="monotone" dataKey="payouts" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Commission and Payout Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Commission Breakdown</h3>
            <BarChart3 className="h-5 w-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={commissionBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {commissionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Payout Distribution</h3>
            <Users className="h-5 w-5 text-secondary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={payoutBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {payoutBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Financial Report */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Detailed Financial Report</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Q1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Q2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Q3</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Q4</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Commission Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(145000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(167000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(189000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(205000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(706000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+18.5%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Landlord Payouts</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1200000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1350000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1480000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1620000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(5650000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">+15.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Service Provider Payouts</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(85000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(92000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(98000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(105000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(380000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12.8%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Net Profit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(145000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(167000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(189000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(205000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatCurrency(706000)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+18.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tax Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">GST on Commission</h4>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(126000)}</p>
            <p className="text-sm text-gray-500">18% on commission earned</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">TDS Deducted</h4>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(35000)}</p>
            <p className="text-sm text-gray-500">2% on service payments</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Income Tax Provision</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(212000)}</p>
            <p className="text-sm text-gray-500">30% on net profit</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinanceReporting;