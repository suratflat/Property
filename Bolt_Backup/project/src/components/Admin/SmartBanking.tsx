import React, { useState } from 'react';
import { CreditCard, AlertTriangle, CheckCircle, RefreshCw, TrendingDown, Clock, DollarSign, Activity } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockBankingTransactions, mockRentPayments } from '../../data/mockData';

const SmartBanking: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate banking statistics
  const totalTransactions = mockBankingTransactions.length;
  const successfulTransactions = mockBankingTransactions.filter(t => t.status === 'success').length;
  const bouncedTransactions = mockBankingTransactions.filter(t => t.status === 'bounced').length;
  const pendingRetries = mockBankingTransactions.filter(t => t.status === 'bounced' && (t.retryCount || 0) < (t.maxRetries || 3)).length;

  const successRate = totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100) : 0;
  const bounceRate = totalTransactions > 0 ? ((bouncedTransactions / totalTransactions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Smart Banking</h1>
          <p className="text-gray-600">Monitor ECS/NACH/UPI transactions and handle bounces</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Banking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{totalTransactions}</p>
              <p className="text-sm text-blue-600">All payment methods</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{successRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600">{successfulTransactions} successful</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{bounceRate.toFixed(1)}%</p>
              <p className="text-sm text-red-600">{bouncedTransactions} bounced</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Retries</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingRetries}</p>
              <p className="text-sm text-yellow-600">Auto-retry scheduled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bounced Transactions Alert */}
      {bouncedTransactions > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-900">Bounced Transactions Detected</h3>
                <p className="text-red-700">
                  {bouncedTransactions} transactions have bounced and require attention. 
                  {pendingRetries > 0 && ` ${pendingRetries} are scheduled for auto-retry.`}
                </p>
              </div>
            </div>
            <Button variant="primary">
              Handle Bounces
            </Button>
          </div>
        </Card>
      )}

      {/* Transaction Details */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Banking Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retry Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockBankingTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {transaction.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'bounced'
                        ? 'bg-red-100 text-red-800'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.bankReference || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.status === 'bounced' && (
                      <div>
                        <div className="text-xs text-gray-500">
                          Retry: {transaction.retryCount || 0}/{transaction.maxRetries || 3}
                        </div>
                        {transaction.nextRetryDate && (
                          <div className="text-xs text-blue-600">
                            Next: {new Date(transaction.nextRetryDate).toLocaleDateString()}
                          </div>
                        )}
                        {transaction.bounceReason && (
                          <div className="text-xs text-red-600">
                            Reason: {transaction.bounceReason}
                          </div>
                        )}
                      </div>
                    )}
                    {transaction.status === 'success' && (
                      <span className="text-xs text-green-600">Completed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {transaction.status === 'bounced' && (
                        <Button variant="primary" size="sm">
                          Retry Now
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bounce Reasons Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bounce Reasons Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Insufficient Funds</h4>
            <p className="text-2xl font-bold text-red-600">45%</p>
            <p className="text-sm text-gray-500">Most common reason</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Account Closed</h4>
            <p className="text-2xl font-bold text-orange-600">25%</p>
            <p className="text-sm text-gray-500">Requires mandate update</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Technical Issues</h4>
            <p className="text-2xl font-bold text-yellow-600">20%</p>
            <p className="text-sm text-gray-500">Bank system errors</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Mandate Expired</h4>
            <p className="text-2xl font-bold text-blue-600">10%</p>
            <p className="text-sm text-gray-500">Renewal required</p>
          </div>
        </div>
      </Card>

      {/* Auto-Retry Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-Retry Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Retry Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Retry Attempts
                </label>
                <input
                  type="number"
                  defaultValue="3"
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retry Interval (Days)
                </label>
                <input
                  type="number"
                  defaultValue="3"
                  min="1"
                  max="7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Email notifications for bounces</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">SMS alerts for failed retries</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Dashboard alerts for manual intervention</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary">Save Configuration</Button>
        </div>
      </Card>
    </div>
  );
};

export default SmartBanking;