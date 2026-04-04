import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockServiceRequests } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const Earnings: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Filter service requests for current service provider
  const myRequests = mockServiceRequests.filter(r => r.serviceProviderId === user?.id);
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  // Calculate earnings
  const totalEarnings = completedRequests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0);
  const thisMonthEarnings = completedRequests
    .filter(r => r.completedDate && new Date(r.completedDate).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0);
  
  const pendingPayments = completedRequests.filter(r => !r.actualCost).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock earnings data for charts
  const monthlyEarnings = [
    { month: 'Jan', earnings: 15000, jobs: 8 },
    { month: 'Feb', earnings: 18000, jobs: 10 },
    { month: 'Mar', earnings: 22000, jobs: 12 },
    { month: 'Apr', earnings: 19000, jobs: 9 },
    { month: 'May', earnings: 25000, jobs: 14 },
    { month: 'Jun', earnings: 28000, jobs: 16 },
  ];

  const weeklyEarnings = [
    { week: 'Week 1', earnings: 6000 },
    { week: 'Week 2', earnings: 7500 },
    { week: 'Week 3', earnings: 8200 },
    { week: 'Week 4', earnings: 6300 },
  ];

  const recentPayments = [
    {
      id: '1',
      date: '2024-12-10',
      amount: 2500,
      description: 'Kitchen Sink Repair',
      status: 'paid',
      property: '3BHK Premium Apartment'
    },
    {
      id: '2',
      date: '2024-12-08',
      amount: 1800,
      description: 'Electrical Wiring Fix',
      status: 'paid',
      property: '2BHK Modern Flat'
    },
    {
      id: '3',
      date: '2024-12-05',
      amount: 3200,
      description: 'Bathroom Plumbing',
      status: 'pending',
      property: '3BHK Premium Apartment'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your income and payment history</p>
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
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalEarnings)}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(thisMonthEarnings)}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">{completedRequests.length}</p>
              <p className="text-sm text-blue-600">This month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPayments}</p>
              <p className="text-sm text-yellow-600">Awaiting payment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Earnings Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Earnings</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Earnings']} />
              <Bar dataKey="earnings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Weekly Trend</h3>
            <Calendar className="h-5 w-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Earnings']} />
              <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Bank Account Details</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Account: ****1234</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 ml-6">IFSC: HDFC0001234</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 ml-6">Bank: HDFC Bank</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Schedule</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                • Payments are processed weekly
              </div>
              <div className="text-sm text-gray-600">
                • Next payment: Every Friday
              </div>
              <div className="text-sm text-gray-600">
                • Processing time: 1-2 business days
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline">Update Payment Details</Button>
        </div>
      </Card>
    </div>
  );
};

export default Earnings;