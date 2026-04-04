import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AdminPermissions } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (feature: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default admin permissions for new admins
const defaultAdminPermissions: AdminPermissions = {
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
};

// Mock users for authentication - keeping it simple to avoid circular dependencies
const authUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Patel',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    role: 'landlord',
    isKYCVerified: true,
    kycRequestStatus: 'verified',
    panCardNumber: 'ABCDE1234F',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    role: 'tenant',
    isKYCVerified: true,
    kycRequestStatus: 'verified',
    panCardNumber: 'FGHIJ5678K',
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    role: 'service_provider',
    serviceProviderCategory: 'plumber',
    isKYCVerified: true,
    kycRequestStatus: 'verified',
    panCardNumber: 'KLMNO9012P',
    createdAt: '2024-01-17T00:00:00Z',
  },
  {
    id: '4',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    phone: '+91-9876543213',
    role: 'superadmin',
    isKYCVerified: true,
    kycRequestStatus: 'verified',
    panCardNumber: 'PQRST3456U',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+91-9876543214',
    role: 'admin',
    isKYCVerified: true,
    kycRequestStatus: 'verified',
    panCardNumber: 'UVWXY7890Z',
    adminPermissions: defaultAdminPermissions,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🔧 AuthProvider: Component initialized');

  useEffect(() => {
    console.log('🔧 AuthProvider: useEffect started - checking localStorage');
    
    try {
      // Check for stored user on app load
      const storedUser = localStorage.getItem('user');
      console.log('🔧 AuthProvider: storedUser from localStorage:', storedUser ? 'found' : 'not found');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('🔧 AuthProvider: parsedUser:', parsedUser);
          
          // Find the current user data from authUsers to ensure we have the latest fields
          const currentUser = authUsers.find(u => u.id === parsedUser.id && u.email === parsedUser.email);
          console.log('🔧 AuthProvider: currentUser found:', currentUser ? 'yes' : 'no');
          
          if (currentUser) {
            console.log('🔧 AuthProvider: Setting user to:', currentUser);
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
          } else {
            // If user not found in authUsers, clear storage
            console.log('🔧 AuthProvider: User not found in authUsers, clearing localStorage');
            localStorage.removeItem('user');
          }
        } catch (parseError) {
          console.error('🔧 AuthProvider: Error parsing stored user:', parseError);
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('🔧 AuthProvider: Error in useEffect:', error);
    }
    
    console.log('🔧 AuthProvider: Setting isLoading to false');
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    console.log('🔧 AuthProvider: login called with:', { email, role });
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = authUsers.find(u => u.email === email && u.role === role);
      console.log('🔧 AuthProvider: foundUser:', foundUser ? 'yes' : 'no');
      
      if (foundUser) {
        console.log('🔧 AuthProvider: Login successful, setting user:', foundUser);
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      console.log('🔧 AuthProvider: Login failed - user not found');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('🔧 AuthProvider: Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('🔧 AuthProvider: logout called');
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (feature: string, action: string): boolean => {
    if (!user) return false;
    
    // SUPERADMIN has all permissions
    if (user.role === 'superadmin') return true;
    
    // Regular admin needs to check permissions
    if (user.role === 'admin' && user.adminPermissions) {
      const featurePermissions = user.adminPermissions[feature as keyof AdminPermissions];
      if (featurePermissions && typeof featurePermissions === 'object') {
        return featurePermissions[action as keyof typeof featurePermissions] || false;
      }
    }
    
    return false;
  };

  console.log('🔧 AuthProvider: Rendering with state:', { user: user?.name || 'null', isLoading });

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};