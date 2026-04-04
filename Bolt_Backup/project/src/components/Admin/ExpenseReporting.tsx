import React, { useState } from 'react';
import { Receipt, Plus, Download, Calendar, DollarSign, TrendingDown, AlertCircle, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../Common/Card';
import Button from '../Common/Button';

const ExpenseReporting: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock expense data
  const expenses = [
    { id: '1', category: 'Technology', description: 'Server hosting and maintenance', amount: 25000, date: '2024-12-01', status: 'approved' },
    { id: '2', category: 'Marketing', description: 'Digital advertising campaigns', amount: 45000, date: '2024-12-03', status: 'approved' },
    { id: '3', category: 'Operations', description: 'Office rent and utilities', amount: 35000, date: '2024-12-05', status: 'approved' },
    { id: '4', category: 'Legal', description: 'Legal consultation and compliance', amount: 15000, date: '2024-12-07', status: 'pending' },
    { id: '5', category: 'Technology', description: 'Software licenses and tools', amount: 18000, date: '2024-12-10', status: 'approved' },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);

  // Mock data for charts
  const monthlyExpenseData = [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 135000 },
    { month: 'Mar', amount: 128000 },
    { month: 'Apr', amount: 142000 },
    { month: 'May', amount: 138000 },
    { month: 'Jun', amount: 155000 },
  ];

  const expenseCategoryData = [
    { name: 'Technology', value: 43000, color: '#3b82f6' },
    { name: 'Marketing', value: 45000, color: '#10b981' },
    { name: 'Operations', value: 35000, color: '#f59e0b' },
    { name: 'Legal', value: 15000, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expense Reporting</h1>
          <p className="text-gray-600">Track and manage platform operational expenses</p>
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
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowAddExpense(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-red-600">This month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(approvedExpenses)}</p>
              <p className="text-sm text-green-600">{expenses.filter(e => e.status === 'approved').length} items</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(pendingExpenses)}</p>
              <p className="text-sm text-yellow-600">{expenses.filter(e => e.status === 'pending').length} items</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average per Month</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(138000)}</p>
              <p className="text-sm text-blue-600">6-month average</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Expense Trends and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Expense Trend</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Expenses']} />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Expense by Category</h3>
            <Receipt className="h-5 w-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Expense List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="legal">Legal</option>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      expense.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {expense.status === 'pending' && (
                        <Button variant="primary" size="sm">
                          Approve
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

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add New Expense</h2>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Category</option>
                    <option value="technology">Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="legal">Legal</option>
                    <option value="finance">Finance</option>
                    <option value="hr">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter expense description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt/Invoice
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Receipt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload receipt or invoice</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1">
                    Add Expense
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddExpense(false)}
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

export default ExpenseReporting;