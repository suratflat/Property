import React from 'react';
import { 
  BarChart3, 
  Building2, 
  CreditCard, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  Wrench,
  Zap,
  Receipt,
  Shield,
  Calendar,
  DollarSign,
  List,
  Calculator,
  TrendingUp,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, hasPermission } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    if (!user) return baseItems;

    switch (user.role) {
      case 'landlord':
        return [
          ...baseItems,
          { id: 'properties', label: 'Properties', icon: Building2 },
          { id: 'tenants', label: 'Tenants', icon: Users },
          { id: 'rent', label: 'Rent Management', icon: CreditCard },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'agreements', label: 'Agreements', icon: FileText },
          { id: 'kyc', label: 'KYC Management', icon: Shield },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'tenant':
        return [
          ...baseItems,
          { id: 'rent', label: 'Rent Payments', icon: CreditCard },
          { id: 'maintenance', label: 'Service Requests', icon: Wrench },
          { id: 'utilities', label: 'Utility Bills', icon: Zap },
          { id: 'agreements', label: 'My Agreement', icon: FileText },
          { id: 'kyc', label: 'KYC Verification', icon: Shield },
          { id: 'receipts', label: 'Receipts', icon: Receipt },
        ];
      case 'service_provider':
        return [
          ...baseItems,
          { id: 'tasks', label: 'Assigned Tasks', icon: Wrench },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'kyc', label: 'KYC Verification', icon: Shield },
        ];
      case 'superadmin':
        return [
          ...baseItems,
          { id: 'admin-management', label: 'Admin Management', icon: UserPlus },
          { id: 'properties', label: 'All Properties', icon: Building2 },
          { id: 'property-listing', label: 'Available Properties', icon: List },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'agreements', label: 'Agreement Management', icon: FileText },
          { id: 'smart-banking', label: 'Smart Banking', icon: RefreshCw },
          { id: 'finance-reporting', label: 'Finance & Reporting', icon: TrendingUp },
          { id: 'expense-reporting', label: 'Expense Reporting', icon: Receipt },
          { id: 'reconciliation', label: 'Reconciliation', icon: Calculator },
          { id: 'tax-management', label: 'Tax Management', icon: Calculator },
          { id: 'payments', label: 'Payment Gateway', icon: CreditCard },
          { id: 'kyc', label: 'KYC Management', icon: Shield },
          { id: 'reports', label: 'System Reports', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'admin':
        const adminItems = [...baseItems];
        
        // Add menu items based on permissions
        if (hasPermission('propertyManagement', 'view')) {
          adminItems.push({ id: 'properties', label: 'All Properties', icon: Building2 });
          adminItems.push({ id: 'property-listing', label: 'Available Properties', icon: List });
        }
        
        if (hasPermission('userManagement', 'view')) {
          adminItems.push({ id: 'users', label: 'User Management', icon: Users });
        }
        
        if (hasPermission('agreementManagement', 'view')) {
          adminItems.push({ id: 'agreements', label: 'Agreement Management', icon: FileText });
        }
        
        if (hasPermission('smartBanking', 'view')) {
          adminItems.push({ id: 'smart-banking', label: 'Smart Banking', icon: RefreshCw });
        }
        
        if (hasPermission('financialManagement', 'view')) {
          adminItems.push({ id: 'finance-reporting', label: 'Finance & Reporting', icon: TrendingUp });
          adminItems.push({ id: 'expense-reporting', label: 'Expense Reporting', icon: Receipt });
        }
        
        if (hasPermission('financialManagement', 'reconciliation')) {
          adminItems.push({ id: 'reconciliation', label: 'Reconciliation', icon: Calculator });
        }
        
        if (hasPermission('taxManagement', 'view')) {
          adminItems.push({ id: 'tax-management', label: 'Tax Management', icon: Calculator });
        }
        
        if (hasPermission('paymentGateway', 'view')) {
          adminItems.push({ id: 'payments', label: 'Payment Gateway', icon: CreditCard });
        }
        
        if (hasPermission('kycManagement', 'view')) {
          adminItems.push({ id: 'kyc', label: 'KYC Management', icon: Shield });
        }
        
        if (hasPermission('reports', 'view')) {
          adminItems.push({ id: 'reports', label: 'System Reports', icon: BarChart3 });
        }
        
        if (hasPermission('systemSettings', 'view')) {
          adminItems.push({ id: 'settings', label: 'Settings', icon: Settings });
        }
        
        return adminItems;
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;