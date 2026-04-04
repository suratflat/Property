import React, { useState } from 'react';
import { Calculator, CheckCircle, AlertTriangle, RefreshCw, Download, Calendar, DollarSign } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockReconciliationRecords, mockPlatformTransactions } from '../../data/mockData';

const Reconciliation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reconciliationType, setReconciliationType] = useState<'daily' | 'monthly'>('daily');
  const [showReconcileModal, setShowReconcileModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate reconciliation summary
  const totalIncoming = mockPlatformTransactions
    .filter(t => t.type === 'commission_earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = mockPlatformTransactions
    .filter(t => t.type === 'landlord_payout' || t.type === 'service_provider_payout')
    .reduce((sum, t) => sum + t.amount, 0);

  const platformBalance = totalIncoming - totalOutgoing;

  const pendingReconciliations = mockReconciliationRecords.filter(r => r.status === 'pending').length;
  const discrepancyRecords = mockReconciliationRecords.filter(r => r.status === 'discrepancy_found').length;

  const handleRunReconciliation = () => {
    setShowReconcileModal(true);
  };

  const handleCompleteReconciliation = () => {
    console.log('Running reconciliation for:', selectedDate, reconciliationType);
    setShowReconcileModal(false);
    // Here you would trigger the actual reconciliation process
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reconciliation</h1>
          <p className="text-gray-600">Monitor and reconcile all incoming and outgoing payments</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="primary" onClick={handleRunReconciliation}>
            <Calculator className="h-4 w-4 mr-1" />
            Run Reconciliation
          </Button>
        </div>
      </div>

      {/* Reconciliation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incoming</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalIncoming)}</p>
              <p className="text-sm text-green-600">Commission & fees</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outgoing</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalOutgoing)}</p>
              <p className="text-sm text-red-600">Payouts & settlements</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Platform Balance</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(platformBalance)}</p>
              <p className="text-sm text-blue-600">Net position</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Discrepancies</p>
              <p className="text-2xl font-semibold text-gray-900">{discrepancyRecords}</p>
              <p className="text-sm text-yellow-600">Require attention</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Discrepancy Alert */}
      {discrepancyRecords > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-900">Reconciliation Discrepancies Found</h3>
                <p className="text-yellow-800">
                  {discrepancyRecords} reconciliation records have discrepancies that require manual review.
                </p>
              </div>
            </div>
            <Button variant="warning">
              Review Discrepancies
            </Button>
          </div>
        </Card>
      )}

      {/* Reconciliation Records */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Reconciliation History</h3>
            <div className="flex items-center space-x-2">
              <select
                value={reconciliationType}
                onChange={(e) => setReconciliationType(e.target.value as 'daily' | 'monthly')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incoming
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outgoing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reconciled By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReconciliationRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.totalIncoming)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.totalOutgoing)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(record.platformBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : record.status === 'discrepancy_found'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.reconciledBy || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {record.status === 'discrepancy_found' && (
                        <Button variant="primary" size="sm">
                          Resolve
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

      {/* Discrepancy Details */}
      {discrepancyRecords > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Discrepancy Details</h3>
          <div className="space-y-4">
            {mockReconciliationRecords
              .filter(r => r.status === 'discrepancy_found')
              .map((record) => (
                <div key={record.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-900">
                      Reconciliation Date: {new Date(record.date).toLocaleDateString()}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Discrepancy Found
                    </span>
                  </div>
                  {record.discrepancies && (
                    <div className="space-y-2">
                      {record.discrepancies.map((discrepancy, index) => (
                        <div key={index} className="text-sm text-red-800">
                          <strong>{discrepancy.type}:</strong> {formatCurrency(discrepancy.amount)} - {discrepancy.description}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <Button variant="primary" size="sm">
                      Investigate & Resolve
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Run Reconciliation Modal */}
      {showReconcileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Run Reconciliation</h2>
                <p className="text-gray-600 mt-1">Reconcile all transactions for the selected period</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reconciliation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reconciliation Type
                  </label>
                  <select
                    value={reconciliationType}
                    onChange={(e) => setReconciliationType(e.target.value as 'daily' | 'monthly')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="daily">Daily Reconciliation</option>
                    <option value="monthly">Monthly Reconciliation</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      This will reconcile all incoming and outgoing transactions for the selected period and identify any discrepancies.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="primary" className="flex-1" onClick={handleCompleteReconciliation}>
                    Start Reconciliation
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReconcileModal(false)}
                  >
                    Cancel
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

export default Reconciliation;