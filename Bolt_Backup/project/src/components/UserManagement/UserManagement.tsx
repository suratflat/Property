import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, CheckCircle, XCircle, Search, Filter, UserCheck, Eye, X } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { User, ServiceCategory } from '../../types';
import { mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'landlord' | 'tenant' | 'service_provider' | 'admin'>('tenant');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<ServiceCategory>('plumber');
  const [customServiceCategory, setCustomServiceCategory] = useState('');
  const [newUserAadhaar, setNewUserAadhaar] = useState('');

  const serviceCategories: ServiceCategory[] = [
    'electrician', 'carpenter', 'painter', 'welding', 'tiles_repair', 
    'leakage_repair', 'plumber', 'cleaner', 'general', 'other'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'landlord':
        return 'bg-blue-100 text-blue-800';
      case 'tenant':
        return 'bg-purple-100 text-purple-800';
      case 'service_provider':
        return 'bg-orange-100 text-orange-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatServiceCategory = (category: ServiceCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const maskAadhaar = (aadhaar?: string) => {
    if (!aadhaar) return 'Not provided';
    return `****-****-${aadhaar.slice(-4)}`;
  };

  const handleRequestKYC = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              kycRequestStatus: 'requested',
              // Simulate adding Aadhaar number if not present
              aadhaarNumber: user.aadhaarNumber || `${Math.floor(Math.random() * 900000000000) + 100000000000}`
            }
          : user
      )
    );
  };

  const handleViewKYC = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    setShowKYCModal(true);
  };

  // Filter users - exclude SUPERADMIN from the list
  const filteredUsers = users.filter(user => {
    // Hide SUPERADMIN from regular admins
    if (user.role === 'superadmin') {
      return false;
    }
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setSelectedRole('tenant');
    setSelectedServiceCategory('plumber');
    setCustomServiceCategory('');
    setNewUserAadhaar('');
    setShowAddUser(false);
  };

  // Check if current user can view KYC documents
  const canViewKYC = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users across the platform</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddUser(true)}
        >
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredUsers.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">KYC Verified</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredUsers.filter(u => u.kycRequestStatus === 'verified').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Service Providers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredUsers.filter(u => u.role === 'service_provider').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="landlord">Landlords</option>
                <option value="tenant">Tenants</option>
                <option value="service_provider">Service Providers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PAN Card
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aadhaar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userItem) => (
                <tr key={userItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                      <div className="text-sm text-gray-500">{userItem.email}</div>
                      <div className="text-sm text-gray-500">{userItem.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(userItem.role)}`}>
                      {userItem.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userItem.role === 'service_provider' && userItem.serviceProviderCategory ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {formatServiceCategory(userItem.serviceProviderCategory)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKYCStatusColor(userItem.kycRequestStatus)}`}>
                      {userItem.kycRequestStatus || 'none'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userItem.panCardNumber ? (
                      <span className="text-green-600">✓ Provided</span>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userItem.aadhaarNumber ? (
                      <span className="text-green-600">{maskAadhaar(userItem.aadhaarNumber)}</span>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {canViewKYC && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleViewKYC(userItem)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View KYC
                        </Button>
                      )}
                      {userItem.kycRequestStatus !== 'requested' && userItem.kycRequestStatus !== 'verified' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleRequestKYC(userItem.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Request KYC
                        </Button>
                      )}
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

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'landlord' | 'tenant' | 'service_provider' | 'admin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Service Provider Category */}
                {selectedRole === 'service_provider' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Provider Category
                    </label>
                    <select 
                      value={selectedServiceCategory}
                      onChange={(e) => setSelectedServiceCategory(e.target.value as ServiceCategory)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>
                          {formatServiceCategory(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom Service Category */}
                {selectedRole === 'service_provider' && selectedServiceCategory === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Service Category
                    </label>
                    <input
                      type="text"
                      value={customServiceCategory}
                      onChange={(e) => setCustomServiceCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter custom service category"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN Card Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter PAN card number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newUserAadhaar}
                    onChange={(e) => setNewUserAadhaar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for digital signature in agreements
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1">
                    Add User
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* KYC Details Modal */}
      {showKYCModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">KYC Details</h2>
                    <p className="text-gray-600">{selectedUser.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowKYCModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* KYC Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Verification Status</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">KYC Status:</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getKYCStatusColor(selectedUser.kycRequestStatus)}`}>
                      {selectedUser.kycRequestStatus || 'Not Started'}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    {selectedUser.serviceProviderCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Service Category</label>
                        <p className="mt-1 text-sm text-gray-900">{formatServiceCategory(selectedUser.serviceProviderCategory)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Document Information</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">PAN Card</h4>
                        {selectedUser.panCardNumber ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Provided
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Not Provided
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedUser.panCardNumber || 'No PAN card information available'}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Aadhaar Card</h4>
                        {selectedUser.kycRequestStatus === 'verified' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {selectedUser.kycRequestStatus || 'Not Verified'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedUser.aadhaarNumber ? maskAadhaar(selectedUser.aadhaarNumber) : 'No Aadhaar information available'}
                      </p>
                      {selectedUser.aadhaarNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Full Number: {selectedUser.aadhaarNumber} (Admin View)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* KYC Actions for Admins */}
                {canViewKYC && selectedUser.kycRequestStatus === 'submitted' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">KYC Actions</h3>
                    <div className="flex space-x-3">
                      <Button variant="success" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve KYC
                      </Button>
                      <Button variant="danger" size="sm">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject KYC
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowKYCModal(false)}>
                    Close
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

export default UserManagement;