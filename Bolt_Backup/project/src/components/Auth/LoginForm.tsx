import React, { useState } from 'react';
import { Home, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../Common/Card';
import Button from '../Common/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'landlord' | 'tenant' | 'service_provider' | 'admin' | 'superadmin'>('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password, role);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const demoCredentials = {
    landlord: { email: 'rajesh@example.com', password: 'demo123' },
    tenant: { email: 'priya@example.com', password: 'demo123' },
    service_provider: { email: 'amit@example.com', password: 'demo123' },
    admin: { email: 'admin@example.com', password: 'demo123' },
    superadmin: { email: 'superadmin@example.com', password: 'demo123' },
  };

  const fillDemoCredentials = () => {
    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">PropertyHub</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('tenant')}
                  className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                    role === 'tenant'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('landlord')}
                  className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                    role === 'landlord'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Landlord
                </button>
                <button
                  type="button"
                  onClick={() => setRole('service_provider')}
                  className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                    role === 'service_provider'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Service Provider
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                    role === 'admin'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setRole('superadmin')}
                  className={`w-full p-3 text-sm font-medium rounded-lg border transition-colors ${
                    role === 'superadmin'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Super Admin
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 mb-2">Demo Credentials:</p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Use demo credentials for {role.replace('_', ' ')}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              className="w-full"
              disabled={isLoading}
              icon={LogIn}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;