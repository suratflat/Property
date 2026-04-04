import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, CreditCard, Globe, Mail, Database, Key, Webhook, Zap, Link, Server, Code, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    rentReminders: true,
    maintenanceUpdates: true,
    paymentAlerts: true,
  });

  // Third-party integration states
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Utility integration states
  const [dgvclApiKey, setDgvclApiKey] = useState('');
  const [dgvclEndpoint, setDgvclEndpoint] = useState('https://api.dgvcl.com/v1');
  const [dgvclAutoFetch, setDgvclAutoFetch] = useState(false);
  const [dgvclAutoPay, setDgvclAutoPay] = useState(false);
  
  const [gujaratGasApiKey, setGujaratGasApiKey] = useState('');
  const [gujaratGasEndpoint, setGujaratGasEndpoint] = useState('https://api.gujaratgas.com/v1');
  const [gujaratGasAutoFetch, setGujaratGasAutoFetch] = useState(false);
  const [gujaratGasAutoPay, setGujaratGasAutoPay] = useState(false);

  const settingsTabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'third-party', label: 'Third-Party APIs', icon: Webhook },
    { id: 'utility-integrations', label: 'Utility Integrations', icon: Zap },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue="PropertyHub"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                defaultValue="support@propertyhub.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Zone
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                defaultValue="5"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Late Payment Fee (₹)
              </label>
              <input
                type="number"
                defaultValue="500"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grace Period (Days)
            </label>
            <input
              type="number"
              defaultValue="3"
              min="0"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <p className="text-sm text-gray-500">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'smsNotifications' && 'Receive notifications via SMS'}
                {key === 'pushNotifications' && 'Receive push notifications'}
                {key === 'rentReminders' && 'Send rent payment reminders'}
                {key === 'maintenanceUpdates' && 'Send maintenance request updates'}
                {key === 'paymentAlerts' && 'Send payment confirmation alerts'}
              </p>
            </div>
            <button
              onClick={() => handleNotificationChange(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Add an extra layer of security to admin accounts</p>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Session Timeout</label>
              <p className="text-sm text-gray-500">Automatically log out inactive users</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Password Length
              </label>
              <input
                type="number"
                defaultValue="8"
                min="6"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiry (Days)
              </label>
              <input
                type="number"
                defaultValue="90"
                min="30"
                max="365"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm text-gray-700">Require uppercase letters</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm text-gray-700">Require lowercase letters</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm text-gray-700">Require numbers</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm text-gray-700">Require special characters</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Gateway Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Payment Gateway
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="razorpay">Razorpay</option>
              <option value="payu">PayU</option>
              <option value="ccavenue">CCAvenue</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key
              </label>
              <input
                type="password"
                placeholder="Enter Secret Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Test Mode</label>
              <p className="text-sm text-gray-500">Enable test mode for development</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">UPI Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPI Merchant ID
            </label>
            <input
              type="text"
              placeholder="Enter UPI Merchant ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPI VPA
            </label>
            <input
              type="text"
              placeholder="merchant@upi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Third-Party Integrations</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email Service</h4>
                  <p className="text-sm text-gray-500">SMTP configuration for email notifications</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">SMS Service</h4>
                  <p className="text-sm text-gray-500">SMS gateway for notifications</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Aadhaar API</h4>
                  <p className="text-sm text-gray-500">Integration for KYC verification</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderThirdPartyIntegrations = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Webhook className="h-5 w-5 mr-2" />
          Webhook Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-app.com/webhook"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL where PropertyHub will send webhook notifications
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook Secret
            </label>
            <input
              type="password"
              placeholder="Enter webhook secret for verification"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Events to Send
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Payment Completed</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">Service Request Created</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Agreement Signed</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">User Registration</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Property Listed</span>
              </label>
            </div>
          </div>

          <Button variant="primary">Save Webhook Configuration</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Server className="h-5 w-5 mr-2" />
          External API Integration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Name/Service
            </label>
            <input
              type="text"
              placeholder="e.g., CRM System, Analytics Platform"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="url"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.external-service.com/v1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key (Optional)
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter Secret Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authentication Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
              <option value="api-key">API Key</option>
              <option value="oauth">OAuth 2.0</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">Test Connection</Button>
            <Button variant="primary">Save API Configuration</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Custom Integration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Integration Name
            </label>
            <input
              type="text"
              placeholder="Custom Integration Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Headers (JSON)
            </label>
            <textarea
              rows={4}
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Timeout (seconds)
            </label>
            <input
              type="number"
              defaultValue="30"
              min="5"
              max="300"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Button variant="primary">Save Custom Integration</Button>
        </div>
      </Card>
    </div>
  );

  const renderUtilityIntegrations = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-600" />
          DGVCL (Electricity) Integration
        </h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">DGVCL API Integration</p>
                <p className="text-sm text-yellow-700">
                  Automatically fetch electricity bills and enable payment processing for DGVCL consumers.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DGVCL API Endpoint
            </label>
            <input
              type="url"
              value={dgvclEndpoint}
              onChange={(e) => setDgvclEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DGVCL API Key
            </label>
            <input
              type="password"
              value={dgvclApiKey}
              onChange={(e) => setDgvclApiKey(e.target.value)}
              placeholder="Enter DGVCL API Key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Number Validation Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.dgvcl.com/v1/validate-consumer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Fetch Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.dgvcl.com/v1/bills"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Processing Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.dgvcl.com/v1/payments"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto-Fetch Bills</label>
                <p className="text-sm text-gray-500">Automatically fetch new electricity bills daily</p>
              </div>
              <button
                onClick={() => setDgvclAutoFetch(!dgvclAutoFetch)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  dgvclAutoFetch ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    dgvclAutoFetch ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto-Pay Bills</label>
                <p className="text-sm text-gray-500">Automatically process payments for due bills</p>
              </div>
              <button
                onClick={() => setDgvclAutoPay(!dgvclAutoPay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  dgvclAutoPay ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    dgvclAutoPay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">Test DGVCL Connection</Button>
            <Button variant="primary">Save DGVCL Configuration</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-600" />
          Gujarat Gas Integration
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">Gujarat Gas API Integration</p>
                <p className="text-sm text-blue-700">
                  Automatically fetch gas bills and enable payment processing for Gujarat Gas consumers.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gujarat Gas API Endpoint
            </label>
            <input
              type="url"
              value={gujaratGasEndpoint}
              onChange={(e) => setGujaratGasEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gujarat Gas API Key
            </label>
            <input
              type="password"
              value={gujaratGasApiKey}
              onChange={(e) => setGujaratGasApiKey(e.target.value)}
              placeholder="Enter Gujarat Gas API Key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Number Validation Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.gujaratgas.com/v1/validate-consumer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Fetch Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.gujaratgas.com/v1/bills"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Processing Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.gujaratgas.com/v1/payments"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto-Fetch Bills</label>
                <p className="text-sm text-gray-500">Automatically fetch new gas bills daily</p>
              </div>
              <button
                onClick={() => setGujaratGasAutoFetch(!gujaratGasAutoFetch)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gujaratGasAutoFetch ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gujaratGasAutoFetch ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto-Pay Bills</label>
                <p className="text-sm text-gray-500">Automatically process payments for due bills</p>
              </div>
              <button
                onClick={() => setGujaratGasAutoPay(!gujaratGasAutoPay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gujaratGasAutoPay ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gujaratGasAutoPay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">Test Gujarat Gas Connection</Button>
            <Button variant="primary">Save Gujarat Gas Configuration</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Utility Integration Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Fetch Frequency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Due Reminder (Days Before)
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-Payment Buffer (Days Before Due)
            </label>
            <input
              type="number"
              defaultValue="2"
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">Integration Status</p>
                <p className="text-sm text-green-700">
                  Both DGVCL and Gujarat Gas integrations are configured and ready for use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDatabaseSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Database Management</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">1.2GB</div>
            <div className="text-sm text-gray-600">Database Size</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">15ms</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="primary">Backup Database</Button>
          <Button variant="outline">Optimize Tables</Button>
          <Button variant="outline">View Logs</Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Automatic Backup</p>
              <p className="text-sm text-yellow-700">Daily backups are scheduled at 2:00 AM IST</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payments':
        return renderPaymentSettings();
      case 'integrations':
        return renderIntegrationSettings();
      case 'third-party':
        return renderThirdPartyIntegrations();
      case 'utility-integrations':
        return renderUtilityIntegrations();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderContent()}
          
          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;