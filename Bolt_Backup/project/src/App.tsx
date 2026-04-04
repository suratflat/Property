import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import LandlordDashboard from './components/Dashboard/LandlordDashboard';
import TenantDashboard from './components/Dashboard/TenantDashboard';
import ServiceProviderDashboard from './components/Dashboard/ServiceProviderDashboard';
import PropertyManagement from './components/Properties/PropertyManagement';
import ServiceRequestManagement from './components/ServiceRequests/ServiceRequestManagement';
import KYCManagement from './components/KYC/KYCManagement';
import UserManagement from './components/UserManagement/UserManagement';
import SystemReports from './components/Reports/SystemReports';
import Settings from './components/Settings/Settings';
import TenantListForLandlord from './components/Users/TenantListForLandlord';
import LandlordRentManagement from './components/Rent/LandlordRentManagement';
import AgreementManagement from './components/Agreements/AgreementManagement';
import TenantAgreementView from './components/Agreements/TenantAgreementView';
import Schedule from './components/ServiceProvider/Schedule';
import Earnings from './components/ServiceProvider/Earnings';
import PropertyListing from './components/Properties/PropertyListing';
import SmartBanking from './components/Admin/SmartBanking';
import FinanceReporting from './components/Admin/FinanceReporting';
import ExpenseReporting from './components/Admin/ExpenseReporting';
import Reconciliation from './components/Admin/Reconciliation';
import TaxManagement from './components/Admin/TaxManagement';
import AdminManagement from './components/AdminManagement/AdminManagement';

const AppContent: React.FC = () => {
  console.log('🚀 AppContent: Component started rendering');
  
  const { user, isLoading, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('🚀 AppContent: Auth state received:', { 
    user: user?.name || 'null', 
    userRole: user?.role || 'null',
    isLoading 
  });

  if (isLoading) {
    console.log('🚀 AppContent: Showing loading screen');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚀 AppContent: No user found, showing login form');
    return <LoginForm />;
  }

  console.log('🚀 AppContent: User authenticated, rendering main app');

  // Define admin-only tabs for regular admins (not superadmin)
  const adminOnlyTabs = ['users', 'payments', 'settings', 'smart-banking', 'finance-reporting', 'expense-reporting', 'reconciliation', 'tax-management'];
  const superAdminOnlyTabs = ['admin-management'];

  const renderContent = () => {
    console.log('🎯 renderContent: Rendering tab:', activeTab);
    
    // Access control for SUPERADMIN-only features
    if (superAdminOnlyTabs.includes(activeTab) && user.role !== 'superadmin') {
      console.log('🎯 renderContent: Access denied for non-superadmin user');
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this feature. This section is restricted to Super Administrators only.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    // Access control for regular admin features
    if (adminOnlyTabs.includes(activeTab) && user.role === 'admin') {
      // Check specific permissions for admin users
      const permissionMap: { [key: string]: { feature: string; action: string } } = {
        'users': { feature: 'userManagement', action: 'view' },
        'payments': { feature: 'paymentGateway', action: 'view' },
        'settings': { feature: 'systemSettings', action: 'view' },
        'smart-banking': { feature: 'smartBanking', action: 'view' },
        'finance-reporting': { feature: 'financialManagement', action: 'view' },
        'expense-reporting': { feature: 'financialManagement', action: 'view' },
        'reconciliation': { feature: 'financialManagement', action: 'reconciliation' },
        'tax-management': { feature: 'taxManagement', action: 'view' },
      };

      const permission = permissionMap[activeTab];
      if (permission && !hasPermission(permission.feature, permission.action)) {
        console.log('🎯 renderContent: Access denied for admin user - insufficient permissions');
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this feature. Please contact your Super Administrator to request access.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Dashboard
            </button>
          </div>
        );
      }
    }

    // Access control for non-admin users trying to access admin features
    if (adminOnlyTabs.includes(activeTab) && user.role !== 'admin' && user.role !== 'superadmin') {
      console.log('🎯 renderContent: Access denied for non-admin user');
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this feature. This section is restricted to administrators only.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    try {
      console.log('🎯 renderContent: Attempting to render component for tab:', activeTab);
      
      switch (activeTab) {
        case 'dashboard':
          console.log('🎯 renderContent: Rendering dashboard for role:', user.role);
          if (user.role === 'superadmin' || user.role === 'admin') return <AdminDashboard />;
          if (user.role === 'landlord') return <LandlordDashboard />;
          if (user.role === 'service_provider') return <ServiceProviderDashboard />;
          return <TenantDashboard />;
        case 'admin-management':
          console.log('🎯 renderContent: Rendering AdminManagement');
          return <AdminManagement />;
        case 'properties':
          console.log('🎯 renderContent: Rendering PropertyManagement');
          return <PropertyManagement />;
        case 'property-listing':
          console.log('🎯 renderContent: Rendering PropertyListing');
          return <PropertyListing />;
        case 'tenants':
          console.log('🎯 renderContent: Rendering tenants for role:', user.role);
          return user.role === 'landlord' ? <TenantListForLandlord /> : <div>Access Denied</div>;
        case 'rent':
          console.log('🎯 renderContent: Rendering rent management for role:', user.role);
          if (user.role === 'landlord') return <LandlordRentManagement />;
          if (user.role === 'tenant') return <TenantDashboard />;
          return <div>Access Denied</div>;
        case 'maintenance':
          console.log('🎯 renderContent: Rendering ServiceRequestManagement');
          return <ServiceRequestManagement />;
        case 'agreements':
          console.log('🎯 renderContent: Rendering agreements for role:', user.role);
          if (user.role === 'landlord' || user.role === 'admin' || user.role === 'superadmin') return <AgreementManagement />;
          if (user.role === 'tenant') return <TenantAgreementView />;
          return <div>Access Denied</div>;
        case 'kyc':
          console.log('🎯 renderContent: Rendering KYCManagement');
          return <KYCManagement />;
        case 'users':
          console.log('🎯 renderContent: Rendering UserManagement');
          return <UserManagement />;
        case 'smart-banking':
          console.log('🎯 renderContent: Rendering SmartBanking');
          return <SmartBanking />;
        case 'finance-reporting':
          console.log('🎯 renderContent: Rendering FinanceReporting');
          return <FinanceReporting />;
        case 'expense-reporting':
          console.log('🎯 renderContent: Rendering ExpenseReporting');
          return <ExpenseReporting />;
        case 'reconciliation':
          console.log('🎯 renderContent: Rendering Reconciliation');
          return <Reconciliation />;
        case 'tax-management':
          console.log('🎯 renderContent: Rendering TaxManagement');
          return <TaxManagement />;
        case 'schedule':
          console.log('🎯 renderContent: Rendering Schedule');
          return <Schedule />;
        case 'earnings':
          console.log('🎯 renderContent: Rendering Earnings');
          return <Earnings />;
        case 'tasks':
          console.log('🎯 renderContent: Rendering tasks (ServiceRequestManagement)');
          return <ServiceRequestManagement />;
        case 'utilities':
          console.log('🎯 renderContent: Rendering utilities (TenantDashboard)');
          return <TenantDashboard />;
        case 'receipts':
          console.log('🎯 renderContent: Rendering receipts placeholder');
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Receipts</h2>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          );
        case 'payments':
          console.log('🎯 renderContent: Rendering payments management');
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Payment Gateway Management</h1>
                <p className="text-gray-600">Configure and monitor payment gateway settings</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Gateways</p>
                      <p className="text-2xl font-semibold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-semibold text-gray-900">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-semibold text-gray-900">98.5%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800">
                    Payment gateway integration is active. All transactions are processed securely through our integrated payment system including UPI, Cards, and Net Banking.
                  </p>
                </div>
              </div>
            </div>
          );
        case 'reports':
          console.log('🎯 renderContent: Rendering SystemReports');
          return <SystemReports />;
        case 'settings':
          console.log('🎯 renderContent: Rendering Settings');
          return <Settings />;
        default:
          console.log('🎯 renderContent: Rendering default placeholder for tab:', activeTab);
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h2>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          );
      }
    } catch (error) {
      console.error('❌ renderContent: Error rendering content for tab:', activeTab, error);
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            There was an error loading this page. Please try refreshing or contact support.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }
  };

  console.log('🚀 AppContent: About to render main layout');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  console.log('🌟 App: Component started');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;