import React, { useState } from 'react';
import { UserPlus, Shield, Edit, Trash2, CheckCircle, XCircle, Users, Settings, Building2, FileText, DollarSign, CreditCard, BarChart3, RefreshCw, Calculator, Wrench } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { User, AdminPermissions } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminManagement: React.FC = () => {
  const { user } = useAuth();
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [permissions, setPermissions] = useState<AdminPermissions>({
    userManagement: { view: false, create: false, edit: false, delete: false },
    propertyManagement: { view: false, create: false, edit: false, delete: false },
    agreementManagement: { view: false, create: false, edit: false, delete: false },
    financialManagement: { view: false, edit: false, reports: false, reconciliation: false },
    paymentGateway: { view: false, configure: false },
    kycManagement: { view: false, approve: false, reject: false },
    systemSettings: { view: false, edit: false },
    reports: { view: false, export: false },
    smartBanking: { view: false, configure: false },
    taxManagement: { view: false, configure: false },
    serviceRequests: { view: false, assign: false, manage: false },
  });

  // Mock admin users data
  const [adminUsers, setAdminUsers] = useState<User[]>([
    {
      id: '5',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+91-9876543214',
      role: 'admin',
      isKYCVerified: true,
      kycRequestStatus: 'verified',
      panCardNumber: 'UVWXY7890Z',
      adminPermissions: {
        userManagement: { view: true, create: false, edit: false, delete: false },
        propertyManagement: { view: true, create: false, edit: false, delete: false },
        agreementManagement: { view: true, create: false, edit: false, delete: false },
        financialManagement: { view: true, edit: false, reports: true, reconciliation: false },
        paymentGateway: { view: true, configure: false },
        kycManagement: { view: true, approve: false, reject: false },
        systemSettings: { view: false, edit: false },
        reports: { view: true, export: false },
        smartBanking: { view: true, configure: false },
        taxManagement: { view: true, configure: false },
        serviceRequests: { view: true, assign: true, manage: false },
      },
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '6',
      name: 'Finance Admin',
      email: 'finance@example.com',
      phone: '+91-9876543215',
      role: 'admin',
      isKYCVerified: true,
      kycRequestStatus: 'verified',
      panCardNumber: 'ABCDE1234F',
      adminPermissions: {
        userManagement: { view: false, create: false, edit: false, delete: false },
        propertyManagement: { view: false, create: false, edit: false, delete: false },
        agreementManagement: { view: false, create: false, edit: false, delete: false },
        financialManagement: { view: true, edit: true, reports: true, reconciliation: true },
        paymentGateway: { view: true, configure: true },
        kycManagement: { view: false, approve: false, reject: false },
        systemSettings: { view: false, edit: false },
        reports: { view: true, export: true },
        smartBanking: { view: true, configure: true },
        taxManagement: { view: true, configure: true },
        serviceRequests: { view: false, assign: false, manage: false },
      },
      createdAt: '2024-02-01T00:00:00Z',
    },
  ]);

  const handlePermissionChange = (feature: keyof AdminPermissions, action: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [action]: value
      }
    }));
  };

  const handleCreateAdmin = () => {
    if (!adminName || !adminEmail || !adminPhone) {
      alert('Please fill in all required fields');
      return;
    }

    const newAdmin: User = {
      id: `admin_${Date.now()}`,
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      role: 'admin',
      isKYCVerified: false,
      kycRequestStatus: 'none',
      adminPermissions: permissions,
      createdAt: new Date().toISOString(),
    };

    setAdminUsers(prev => [...prev, newAdmin]);
    resetForm();
  };

  const handleEditAdmin = (admin: User) => {
    setEditingAdmin(admin);
    setAdminName(admin.name);
    setAdminEmail(admin.email);
    setAdminPhone(admin.phone);
    setPermissions(admin.adminPermissions || permissions);
    setShowAddAdmin(true);
  };

  const handleUpdateAdmin = () => {
    if (!editingAdmin || !adminName || !adminEmail || !adminPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setAdminUsers(prev => prev.map(admin => 
      admin.id === editingAdmin.id 
        ? { ...admin, name: adminName, email: adminEmail, phone: adminPhone, adminPermissions: permissions }
        : admin
    ));
    resetForm();
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
    }
  };

  const resetForm = () => {
    setShowAddAdmin(false);
    setEditingAdmin(null);
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
    setPermissions({
      userManagement: { view: false, create: false, edit: false, delete: false },
      propertyManagement: { view: false, create: false, edit: false, delete: false },
      agreementManagement: { view: false, create: false, edit: false, delete: false },
      financialManagement: { view: false, edit: false, reports: false, reconciliation: false },
      paymentGateway: { view: false, configure: false },
      kycManagement: { view: false, approve: false, reject: false },
      systemSettings: { view: false, edit: false },
      reports: { view: false, export: false },
      smartBanking: { view: false, configure: false },
      taxManagement: { view: false, configure: false },
      serviceRequests: { view: false, assign: false, manage: false },
    });
  };

  const getPermissionCount = (adminPermissions?: AdminPermissions) => {
    if (!adminPermissions) return 0;
    
    let count = 0;
    Object.values(adminPermissions).forEach(feature => {
      Object.values(feature).forEach(permission => {
        if (permission) count++;
      });
    });
    return count;
  };

  // Only SUPERADMIN can access this component
  if (user?.role !== 'superadmin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only Super Admins can access admin management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => setShowAddAdmin(true)}
        >
          Add Admin
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-semibold text-gray-900">{adminUsers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-2xl font-semibold text-gray-900">{adminUsers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permission Groups</p>
              <p className="text-2xl font-semibold text-gray-900">11</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adminUsers.map((admin) => (
          <Card key={admin.id} className="p-6" hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {admin.email}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {admin.phone}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Permissions:</span> {getPermissionCount(admin.adminPermissions)} granted
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Created:</span> {new Date(admin.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Permission Summary */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {admin.adminPermissions?.userManagement.view && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">User Mgmt</span>
                )}
                {admin.adminPermissions?.financialManagement.view && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Finance</span>
                )}
                {admin.adminPermissions?.propertyManagement.view && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Properties</span>
                )}
                {admin.adminPermissions?.systemSettings.view && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Settings</span>
                )}
                {getPermissionCount(admin.adminPermissions) > 4 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    +{getPermissionCount(admin.adminPermissions) - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleEditAdmin(admin)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteAdmin(admin.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions & Access Control</h3>
                  <div className="space-y-6">
                    
                    {/* User Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        User Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.userManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('userManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Property Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        Property Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.propertyManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('propertyManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Agreement Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Agreement Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.agreementManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('agreementManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Financial Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Financial Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.financialManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('financialManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Payment Gateway */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Gateway
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.paymentGateway).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('paymentGateway', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* KYC Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        KYC Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.kycManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('kycManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* System Settings */}
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings (Core Functionality)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.systemSettings).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('systemSettings', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-red-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Core functionality access - Grant with caution
                      </p>
                    </div>

                    {/* Reports */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Reports & Analytics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.reports).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('reports', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Smart Banking */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Smart Banking
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.smartBanking).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('smartBanking', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tax Management */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        Tax Management
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.taxManagement).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('taxManagement', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Service Requests */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Wrench className="h-4 w-4 mr-2" />
                        Service Requests
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions.serviceRequests).map(([action, value]) => (
                          <label key={action} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange('serviceRequests', action, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
                  >
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetForm}
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

export default AdminManagement;