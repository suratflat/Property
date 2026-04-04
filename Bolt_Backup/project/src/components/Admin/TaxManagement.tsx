import React, { useState } from 'react';
import { Calculator, FileText, Download, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockTaxConfigurations } from '../../data/mockData';

const TaxManagement: React.FC = () => {
  const [showAddTax, setShowAddTax] = useState(false);
  const [selectedTaxType, setSelectedTaxType] = useState<'gst' | 'tds' | 'income_tax'>('gst');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate tax summary
  const totalCommission = 706000; // Mock data
  const gstRate = mockTaxConfigurations.find(t => t.taxType === 'gst' && t.isActive)?.rate || 18;
  const tdsRate = mockTaxConfigurations.find(t => t.taxType === 'tds' && t.isActive)?.rate || 2;
  const incomeTaxRate = mockTaxConfigurations.find(t => t.taxType === 'income_tax' && t.isActive)?.rate || 30;

  const gstAmount = (totalCommission * gstRate) / 100;
  const tdsAmount = (totalCommission * tdsRate) / 100;
  const incomeTaxAmount = (totalCommission * incomeTaxRate) / 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tax Management</h1>
          <p className="text-gray-600">Configure and calculate taxes on brokerage and commission</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Tax Report
          </Button>
          <Button variant="primary" onClick={() => setShowAddTax(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Tax Configuration
          </Button>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GST (18%)</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(gstAmount)}</p>
              <p className="text-sm text-blue-600">On commission earned</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">TDS (2%)</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(tdsAmount)}</p>
              <p className="text-sm text-orange-600">On service payments</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Income Tax (30%)</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(incomeTaxAmount)}</p>
              <p className="text-sm text-green-600">On net profit</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tax Liability</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(gstAmount + tdsAmount + incomeTaxAmount)}</p>
              <p className="text-sm text-red-600">All taxes combined</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tax Configurations */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Tax Configurations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicable On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTaxConfigurations.map((tax) => (
                <tr key={tax.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {tax.taxType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tax.rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tax.applicableOn.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tax.effectiveFrom).toLocaleDateString()}
                    {tax.effectiveTo && ` - ${new Date(tax.effectiveTo).toLocaleDateString()}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tax.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tax Calculation Details */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Calculation Breakdown</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">GST Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Commission Earned</p>
                <p className="font-semibold">{formatCurrency(totalCommission)}</p>
              </div>
              <div>
                <p className="text-gray-600">GST Rate</p>
                <p className="font-semibold">{gstRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">GST Amount</p>
                <p className="font-semibold text-blue-600">{formatCurrency(gstAmount)}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">TDS Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Service Payments</p>
                <p className="font-semibold">{formatCurrency(totalCommission)}</p>
              </div>
              <div>
                <p className="text-gray-600">TDS Rate</p>
                <p className="font-semibold">{tdsRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">TDS Amount</p>
                <p className="font-semibold text-orange-600">{formatCurrency(tdsAmount)}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Income Tax Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Net Profit</p>
                <p className="font-semibold">{formatCurrency(totalCommission)}</p>
              </div>
              <div>
                <p className="text-gray-600">Income Tax Rate</p>
                <p className="font-semibold">{incomeTaxRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">Income Tax Amount</p>
                <p className="font-semibold text-green-600">{formatCurrency(incomeTaxAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Tax Configuration Modal */}
      {showAddTax && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add Tax Configuration</h2>
                <button
                  onClick={() => setShowAddTax(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Type
                  </label>
                  <select 
                    value={selectedTaxType}
                    onChange={(e) => setSelectedTaxType(e.target.value as 'gst' | 'tds' | 'income_tax')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="gst">GST</option>
                    <option value="tds">TDS</option>
                    <option value="income_tax">Income Tax</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter tax rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable On
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="commission">Commission</option>
                    <option value="service_payment">Service Payment</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective From
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective To (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Enter tax description"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1">
                    Add Tax Configuration
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddTax(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TaxManagement;