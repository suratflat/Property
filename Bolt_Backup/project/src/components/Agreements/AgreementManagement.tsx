import React, { useState } from 'react';
import { FileText, Plus, Calendar, User, Home, CheckCircle, Clock, AlertCircle, Download, Users, Shield, DollarSign, Percent, Edit, X } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockAgreements, mockProperties, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const AgreementManagement: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedLandlordIds, setSelectedLandlordIds] = useState<string[]>([]);
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [landlordAadhaar, setLandlordAadhaar] = useState<{[key: string]: string}>({});
  const [tenantAadhaar, setTenantAadhaar] = useState<{[key: string]: string}>({});
  
  // Landlord Brokerage Configuration
  const [landlordBrokerageType, setLandlordBrokerageType] = useState<'fixed' | 'percentage'>('percentage');
  const [landlordBrokerageValue, setLandlordBrokerageValue] = useState<string>('');
  const [landlordBrokerageCollectionType, setLandlordBrokerageCollectionType] = useState<'upfront' | 'recurring'>('recurring');
  const [landlordBrokerageDescription, setLandlordBrokerageDescription] = useState<string>('');
  const [waiveLandlordBrokerage, setWaiveLandlordBrokerage] = useState(false);
  
  // Tenant Brokerage Configuration
  const [tenantBrokerageType, setTenantBrokerageType] = useState<'fixed' | 'percentage'>('percentage');
  const [tenantBrokerageValue, setTenantBrokerageValue] = useState<string>('');
  const [tenantBrokerageCollectionType, setTenantBrokerageCollectionType] = useState<'upfront' | 'recurring'>('recurring');
  const [tenantBrokerageDescription, setTenantBrokerageDescription] = useState<string>('');
  const [waiveTenantBrokerage, setWaiveTenantBrokerage] = useState(false);
  
  // Legal charges state
  const [landlordLegalCharges, setLandlordLegalCharges] = useState<string>('');
  const [tenantLegalCharges, setTenantLegalCharges] = useState<string>('');
  const [waiveLandlordLegalCharges, setWaiveLandlordLegalCharges] = useState(false);
  const [waiveTenantLegalCharges, setWaiveTenantLegalCharges] = useState(false);

  // Filter agreements based on user role
  const getFilteredAgreements = () => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      return mockAgreements;
    } else if (user?.role === 'landlord') {
      return mockAgreements.filter(a => a.landlordIds.includes(user.id));
    } else if (user?.role === 'tenant') {
      return mockAgreements.filter(a => a.tenantIds.includes(user.id));
    }
    return [];
  };

  const agreements = getFilteredAgreements();
  const landlords = mockUsers.filter(u => u.role === 'landlord');
  const tenants = mockUsers.filter(u => u.role === 'tenant');

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const getSelectedProperty = () => {
    return mockProperties.find(p => p.id === selectedPropertyId);
  };

  const getAgreementStatus = (agreement: any) => {
    const totalSignatories = agreement.signatories.length;
    const signedCount = agreement.signatories.filter((s: any) => s.signed).length;
    
    if (signedCount === totalSignatories) {
      return 'signed';
    } else if (signedCount > 0) {
      return 'pending_signature';
    } else {
      return 'draft';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending_signature':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'pending_signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePropertySelection = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = mockProperties.find(p => p.id === propertyId);
    
    // Pre-fill landlord brokerage information from property if available
    if (property?.landlordBrokerage) {
      setLandlordBrokerageType(property.landlordBrokerage.type);
      setLandlordBrokerageValue(property.landlordBrokerage.value.toString());
      setLandlordBrokerageCollectionType(property.landlordBrokerage.collectionType);
      setLandlordBrokerageDescription(property.landlordBrokerage.description || '');
      setWaiveLandlordBrokerage(property.landlordBrokerage.waived || false);
    } else {
      // Reset to defaults if no landlord brokerage info
      setLandlordBrokerageType('percentage');
      setLandlordBrokerageValue('');
      setLandlordBrokerageCollectionType('recurring');
      setLandlordBrokerageDescription('');
      setWaiveLandlordBrokerage(false);
    }

    // Pre-fill tenant brokerage information from property if available
    if (property?.tenantBrokerage) {
      setTenantBrokerageType(property.tenantBrokerage.type);
      setTenantBrokerageValue(property.tenantBrokerage.value.toString());
      setTenantBrokerageCollectionType(property.tenantBrokerage.collectionType);
      setTenantBrokerageDescription(property.tenantBrokerage.description || '');
      setWaiveTenantBrokerage(property.tenantBrokerage.waived || false);
    } else {
      // Reset to defaults if no tenant brokerage info
      setTenantBrokerageType('percentage');
      setTenantBrokerageValue('');
      setTenantBrokerageCollectionType('recurring');
      setTenantBrokerageDescription('');
      setWaiveTenantBrokerage(false);
    }
  };

  const handleLandlordSelection = (landlordId: string) => {
    setSelectedLandlordIds(prev => {
      const newSelection = prev.includes(landlordId)
        ? prev.filter(id => id !== landlordId)
        : [...prev, landlordId];
      
      // Initialize Aadhaar number for newly selected landlords
      if (!prev.includes(landlordId)) {
        const landlord = mockUsers.find(u => u.id === landlordId);
        if (landlord?.aadhaarNumber) {
          setLandlordAadhaar(prevAadhaar => ({
            ...prevAadhaar,
            [landlordId]: landlord.aadhaarNumber || ''
          }));
        }
      }
      
      return newSelection;
    });
  };

  const handleTenantSelection = (tenantId: string) => {
    setSelectedTenantIds(prev => {
      const newSelection = prev.includes(tenantId)
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId];
      
      // Initialize Aadhaar number for newly selected tenants
      if (!prev.includes(tenantId)) {
        const tenant = mockUsers.find(u => u.id === tenantId);
        if (tenant?.aadhaarNumber) {
          setTenantAadhaar(prevAadhaar => ({
            ...prevAadhaar,
            [tenantId]: tenant.aadhaarNumber || ''
          }));
        }
      }
      
      return newSelection;
    });
  };

  const handleAadhaarChange = (userId: string, value: string, role: 'landlord' | 'tenant') => {
    if (role === 'landlord') {
      setLandlordAadhaar(prev => ({ ...prev, [userId]: value }));
    } else {
      setTenantAadhaar(prev => ({ ...prev, [userId]: value }));
    }
  };

  const calculateLandlordBrokeragePreview = () => {
    const property = getSelectedProperty();
    if (!property || !landlordBrokerageValue || waiveLandlordBrokerage) return null;

    const value = parseFloat(landlordBrokerageValue);
    if (isNaN(value)) return null;

    if (landlordBrokerageType === 'percentage') {
      const amount = Math.round((value / 100) * property.rent);
      return {
        description: `${value}% of monthly rent (deducted from landlord payout)`,
        amount: amount,
        frequency: landlordBrokerageCollectionType === 'upfront' ? 'One-time' : 'Monthly'
      };
    } else {
      return {
        description: `Fixed amount (deducted from landlord payout)`,
        amount: value,
        frequency: landlordBrokerageCollectionType === 'upfront' ? 'One-time' : 'Monthly'
      };
    }
  };

  const calculateTenantBrokeragePreview = () => {
    const property = getSelectedProperty();
    if (!property || !tenantBrokerageValue || waiveTenantBrokerage) return null;

    const value = parseFloat(tenantBrokerageValue);
    if (isNaN(value)) return null;

    if (tenantBrokerageType === 'percentage') {
      const amount = Math.round((value / 100) * property.rent);
      return {
        description: `${value}% of monthly rent (added to tenant payment)`,
        amount: amount,
        frequency: tenantBrokerageCollectionType === 'upfront' ? 'One-time' : 'Monthly'
      };
    } else {
      return {
        description: `Fixed amount (added to tenant payment)`,
        amount: value,
        frequency: tenantBrokerageCollectionType === 'upfront' ? 'One-time' : 'Monthly'
      };
    }
  };

  const resetForm = () => {
    setSelectedPropertyId('');
    setSelectedLandlordIds([]);
    setSelectedTenantIds([]);
    setLandlordAadhaar({});
    setTenantAadhaar({});
    
    // Reset landlord brokerage
    setLandlordBrokerageType('percentage');
    setLandlordBrokerageValue('');
    setLandlordBrokerageCollectionType('recurring');
    setLandlordBrokerageDescription('');
    setWaiveLandlordBrokerage(false);
    
    // Reset tenant brokerage
    setTenantBrokerageType('percentage');
    setTenantBrokerageValue('');
    setTenantBrokerageCollectionType('recurring');
    setTenantBrokerageDescription('');
    setWaiveTenantBrokerage(false);
    
    // Reset legal charges
    setLandlordLegalCharges('');
    setTenantLegalCharges('');
    setWaiveLandlordLegalCharges(false);
    setWaiveTenantLegalCharges(false);
    
    setShowCreateForm(false);
  };

  const landlordBrokeragePreview = calculateLandlordBrokeragePreview();
  const tenantBrokeragePreview = calculateTenantBrokeragePreview();

  // Check if user can create/edit agreements
  const canCreateEditAgreements = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'landlord';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agreement Management</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' || user?.role === 'superadmin'
              ? 'Manage all rental agreements across the platform'
              : user?.role === 'landlord'
              ? 'Manage rental agreements for your properties'
              : 'View your rental agreements'
            }
          </p>
        </div>
        {canCreateEditAgreements && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateForm(true)}
          >
            Create Agreement
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agreements</p>
              <p className="text-2xl font-semibold text-gray-900">{agreements.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fully Signed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {agreements.filter(a => getAgreementStatus(a) === 'signed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Signature</p>
              <p className="text-2xl font-semibold text-gray-900">
                {agreements.filter(a => getAgreementStatus(a) === 'pending_signature').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-semibold text-gray-900">
                {agreements.filter(a => {
                  const daysRemaining = calculateDaysRemaining(a.endDate);
                  return daysRemaining <= 30 && daysRemaining > 0;
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Agreements List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agreements.map((agreement) => {
          const daysRemaining = calculateDaysRemaining(agreement.endDate);
          const status = getAgreementStatus(agreement);
          
          return (
            <Card key={agreement.id} className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getPropertyTitle(agreement.propertyId)}
                    </h3>
                    <p className="text-sm text-gray-500">{agreement.type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Landlords: {agreement.landlordIds.map(id => getUserName(id)).join(', ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Tenants: {agreement.tenantIds.map(id => getUserName(id)).join(', ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(agreement.startDate).toLocaleDateString()} - {new Date(agreement.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="h-4 w-4 mr-2" />
                  Rent: ₹{agreement.rentAmount.toLocaleString()} | Deposit: ₹{agreement.depositAmount.toLocaleString()}
                </div>
              </div>

              {/* Enhanced Brokerage Information */}
              {(agreement.landlordBrokerage || agreement.tenantBrokerage) && (
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-800">Brokerage Configuration</span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    {agreement.landlordBrokerage && (
                      <div>
                        <strong>Landlord:</strong> {agreement.landlordBrokerage.waived ? 'Waived' : 
                          agreement.landlordBrokerage.type === 'percentage' ? 
                          `${agreement.landlordBrokerage.value}% (${agreement.landlordBrokerage.collectionType})` :
                          `₹${agreement.landlordBrokerage.value.toLocaleString()} (${agreement.landlordBrokerage.collectionType})`
                        }
                        {agreement.landlordBrokerage.description && (
                          <div className="italic text-green-600">"{agreement.landlordBrokerage.description}"</div>
                        )}
                      </div>
                    )}
                    {agreement.tenantBrokerage && (
                      <div>
                        <strong>Tenant:</strong> {agreement.tenantBrokerage.waived ? 'Waived' : 
                          agreement.tenantBrokerage.type === 'percentage' ? 
                          `${agreement.tenantBrokerage.value}% (${agreement.tenantBrokerage.collectionType})` :
                          `₹${agreement.tenantBrokerage.value.toLocaleString()} (${agreement.tenantBrokerage.collectionType})`
                        }
                        {agreement.tenantBrokerage.description && (
                          <div className="italic text-green-600">"{agreement.tenantBrokerage.description}"</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Legal Charges Information */}
              {(agreement.landlordLegalCharges || agreement.tenantLegalCharges) && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-800">Legal Charges</span>
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    {agreement.landlordLegalCharges && (
                      <p>
                        Landlord: {agreement.waiveLandlordLegalCharges ? 'Waived' : `₹${agreement.landlordLegalCharges.toLocaleString()}`}
                      </p>
                    )}
                    {agreement.tenantLegalCharges && (
                      <p>
                        Tenant: {agreement.waiveTenantLegalCharges ? 'Waived' : `₹${agreement.tenantLegalCharges.toLocaleString()}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Signature Status Details */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Signature Status</h4>
                <div className="space-y-2">
                  {agreement.signatories.map((signatory: any) => (
                    <div key={signatory.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {getUserName(signatory.userId)} ({signatory.role})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {signatory.signed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={`text-xs font-medium ${
                          signatory.signed ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {signatory.signed ? 'Signed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {daysRemaining > 0 && daysRemaining <= 30 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      ⚠️ Expires in {daysRemaining} days
                    </p>
                  </div>
                </div>
              )}

              {daysRemaining <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      ⚠️ Agreement has expired
                    </p>
                  </div>
                </div>
              )}

              {/* Key Terms Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Terms</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {agreement.terms.slice(0, 3).map((term: string, index: number) => (
                    <li key={index}>• {term}</li>
                  ))}
                  {agreement.terms.length > 3 && (
                    <li className="text-primary-600">• +{agreement.terms.length - 3} more terms</li>
                  )}
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                {canCreateEditAgreements && status === 'draft' && (
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button variant="primary" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {agreements.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agreements Yet</h3>
          <p className="text-gray-600 mb-4">
            {canCreateEditAgreements
              ? "Create your first rental agreement to get started."
              : "No agreements have been created for you yet."
            }
          </p>
          {canCreateEditAgreements && (
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              Create Agreement
            </Button>
          )}
        </Card>
      )}

      {/* Create Agreement Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New Agreement</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property
                  </label>
                  <select 
                    value={selectedPropertyId}
                    onChange={(e) => handlePropertySelection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Property</option>
                    {mockProperties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.address}, {property.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Brokerage Configuration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Brokerage Configuration for this Agreement
                  </h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Platform Commission Setup</p>
                        <p className="text-sm text-blue-700">
                          Configure separate commission/brokerage for landlord and tenant for this specific agreement.
                          {selectedPropertyId && getSelectedProperty()?.landlordBrokerage && (
                            <span className="block mt-1 font-medium">
                              Property defaults loaded from property configuration.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Landlord Brokerage Configuration */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-red-600" />
                      Landlord Brokerage (Deducted from Payout)
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="waiveLandlordBrokerage"
                          checked={waiveLandlordBrokerage}
                          onChange={(e) => setWaiveLandlordBrokerage(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="waiveLandlordBrokerage" className="text-sm font-medium text-gray-700">
                          Waive landlord brokerage for this agreement
                        </label>
                      </div>

                      {!waiveLandlordBrokerage && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brokerage Type
                              </label>
                              <select 
                                value={landlordBrokerageType}
                                onChange={(e) => setLandlordBrokerageType(e.target.value as 'fixed' | 'percentage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="percentage">Percentage of Rent</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {landlordBrokerageType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={landlordBrokerageValue}
                                  onChange={(e) => setLandlordBrokerageValue(e.target.value)}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder={landlordBrokerageType === 'percentage' ? '3' : '1500'}
                                  step={landlordBrokerageType === 'percentage' ? '0.1' : '100'}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  {landlordBrokerageType === 'percentage' ? (
                                    <Percent className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <span className="text-gray-400 text-sm">₹</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Collection Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setLandlordBrokerageCollectionType('upfront')}
                                className={`p-3 border rounded-lg text-left transition-colors ${
                                  landlordBrokerageCollectionType === 'upfront'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Upfront Deduction</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Deduct brokerage as one-time from first payout
                                </p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setLandlordBrokerageCollectionType('recurring')}
                                className={`p-3 border rounded-lg text-left transition-colors ${
                                  landlordBrokerageCollectionType === 'recurring'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Monthly Deduction</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Deduct brokerage monthly from rent payout
                                </p>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description (Optional)
                            </label>
                            <textarea
                              value={landlordBrokerageDescription}
                              onChange={(e) => setLandlordBrokerageDescription(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              rows={2}
                              placeholder="Enter description for landlord brokerage arrangement..."
                            />
                          </div>
                        </>
                      )}

                      {/* Landlord Brokerage Preview */}
                      {landlordBrokeragePreview && !waiveLandlordBrokerage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-red-900 mb-1">Landlord Brokerage Preview</h5>
                          <div className="text-sm text-red-800">
                            <p>
                              <strong>{landlordBrokeragePreview.description}:</strong> ₹{landlordBrokeragePreview.amount.toLocaleString()}
                            </p>
                            <p className="mt-1">
                              Collection: <strong>{landlordBrokeragePreview.frequency}</strong>
                            </p>
                            {landlordBrokerageDescription && (
                              <p className="mt-1 italic">"{landlordBrokerageDescription}"</p>
                            )}
                          </div>
                        </div>
                      )}

                      {waiveLandlordBrokerage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800">
                            ✓ Landlord brokerage waived for this agreement
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tenant Brokerage Configuration */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                      Tenant Brokerage (Added to Payment)
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="waiveTenantBrokerage"
                          checked={waiveTenantBrokerage}
                          onChange={(e) => setWaiveTenantBrokerage(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="waiveTenantBrokerage" className="text-sm font-medium text-gray-700">
                          Waive tenant brokerage for this agreement
                        </label>
                      </div>

                      {!waiveTenantBrokerage && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brokerage Type
                              </label>
                              <select 
                                value={tenantBrokerageType}
                                onChange={(e) => setTenantBrokerageType(e.target.value as 'fixed' | 'percentage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="percentage">Percentage of Rent</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {tenantBrokerageType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={tenantBrokerageValue}
                                  onChange={(e) => setTenantBrokerageValue(e.target.value)}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder={tenantBrokerageType === 'percentage' ? '2' : '1000'}
                                  step={tenantBrokerageType === 'percentage' ? '0.1' : '100'}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  {tenantBrokerageType === 'percentage' ? (
                                    <Percent className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <span className="text-gray-400 text-sm">₹</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Collection Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setTenantBrokerageCollectionType('upfront')}
                                className={`p-3 border rounded-lg text-left transition-colors ${
                                  tenantBrokerageCollectionType === 'upfront'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Upfront Collection</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Collect brokerage as one-time payment with deposit
                                </p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setTenantBrokerageCollectionType('recurring')}
                                className={`p-3 border rounded-lg text-left transition-colors ${
                                  tenantBrokerageCollectionType === 'recurring'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Monthly Collection</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Collect brokerage monthly with rent payment
                                </p>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description (Optional)
                            </label>
                            <textarea
                              value={tenantBrokerageDescription}
                              onChange={(e) => setTenantBrokerageDescription(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              rows={2}
                              placeholder="Enter description for tenant brokerage arrangement..."
                            />
                          </div>
                        </>
                      )}

                      {/* Tenant Brokerage Preview */}
                      {tenantBrokeragePreview && !waiveTenantBrokerage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-blue-900 mb-1">Tenant Brokerage Preview</h5>
                          <div className="text-sm text-blue-800">
                            <p>
                              <strong>{tenantBrokeragePreview.description}:</strong> ₹{tenantBrokeragePreview.amount.toLocaleString()}
                            </p>
                            <p className="mt-1">
                              Collection: <strong>{tenantBrokeragePreview.frequency}</strong>
                            </p>
                            {tenantBrokerageDescription && (
                              <p className="mt-1 italic">"{tenantBrokerageDescription}"</p>
                            )}
                          </div>
                        </div>
                      )}

                      {waiveTenantBrokerage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800">
                            ✓ Tenant brokerage waived for this agreement
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agreement Execution Legal Charges */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Agreement Execution Legal Charges
                  </h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">One-time Legal Charges</p>
                        <p className="text-sm text-yellow-700">
                          These charges will be debited once from the respective parties for agreement execution and legal documentation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Landlord Legal Charges</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={landlordLegalCharges}
                            onChange={(e) => setLandlordLegalCharges(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter amount"
                            disabled={waiveLandlordLegalCharges}
                          />
                        </div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={waiveLandlordLegalCharges}
                            onChange={(e) => {
                              setWaiveLandlordLegalCharges(e.target.checked);
                              if (e.target.checked) {
                                setLandlordLegalCharges('');
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Waive legal charges for landlord</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Tenant Legal Charges</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={tenantLegalCharges}
                            onChange={(e) => setTenantLegalCharges(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter amount"
                            disabled={waiveTenantLegalCharges}
                          />
                        </div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={waiveTenantLegalCharges}
                            onChange={(e) => {
                              setWaiveTenantLegalCharges(e.target.checked);
                              if (e.target.checked) {
                                setTenantLegalCharges('');
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Waive legal charges for tenant</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Legal Charges Summary */}
                  {(landlordLegalCharges || tenantLegalCharges || waiveLandlordLegalCharges || waiveTenantLegalCharges) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Legal Charges Summary</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>
                          Landlord: {waiveLandlordLegalCharges ? 'Waived' : landlordLegalCharges ? `₹${parseFloat(landlordLegalCharges).toLocaleString()}` : 'Not set'}
                        </p>
                        <p>
                          Tenant: {waiveTenantLegalCharges ? 'Waived' : tenantLegalCharges ? `₹${parseFloat(tenantLegalCharges).toLocaleString()}` : 'Not set'}
                        </p>
                        <p className="mt-2 text-xs">
                          These charges will be collected once upon agreement execution.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Landlord Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Landlords/Owners
                  </label>
                  <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {landlords.map(landlord => (
                      <div key={landlord.id} className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedLandlordIds.includes(landlord.id)}
                            onChange={() => handleLandlordSelection(landlord.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{landlord.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({landlord.email})</span>
                          </div>
                        </label>
                        {selectedLandlordIds.includes(landlord.id) && (
                          <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Aadhaar Number
                              </label>
                              <input
                                type="text"
                                value={landlordAadhaar[landlord.id] || ''}
                                onChange={(e) => handleAadhaarChange(landlord.id, e.target.value, 'landlord')}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Enter 12-digit Aadhaar number"
                                maxLength={12}
                              />
                            </div>
                            <div className="flex items-end">
                              <span className="text-xs text-gray-500">
                                {landlord.kycRequestStatus === 'verified' ? '✓ KYC Verified' : 'KYC Pending'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedLandlordIds.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">Please select at least one landlord</p>
                  )}
                </div>

                {/* Tenant Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Tenants
                  </label>
                  <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {tenants.map(tenant => (
                      <div key={tenant.id} className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedTenantIds.includes(tenant.id)}
                            onChange={() => handleTenantSelection(tenant.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{tenant.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({tenant.email})</span>
                          </div>
                        </label>
                        {selectedTenantIds.includes(tenant.id) && (
                          <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Aadhaar Number
                              </label>
                              <input
                                type="text"
                                value={tenantAadhaar[tenant.id] || ''}
                                onChange={(e) => handleAadhaarChange(tenant.id, e.target.value, 'tenant')}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Enter 12-digit Aadhaar number"
                                maxLength={12}
                              />
                            </div>
                            <div className="flex items-end">
                              <span className="text-xs text-gray-500">
                                {tenant.kycRequestStatus === 'verified' ? '✓ KYC Verified' : 'KYC Pending'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedTenantIds.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">Please select at least one tenant</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="75000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agreement Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="leave_license">Leave & License Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={6}
                    placeholder="Enter agreement terms and conditions..."
                  />
                </div>

                {/* Aadhaar Verification Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Aadhaar-based Digital Signatures</p>
                      <p className="text-sm text-blue-700">
                        All parties will be required to digitally sign this agreement using their Aadhaar authentication. 
                        Ensure all Aadhaar numbers are correct before creating the agreement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    disabled={selectedLandlordIds.length === 0 || selectedTenantIds.length === 0}
                  >
                    Create Agreement
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
    </div>
  );
};

export default AgreementManagement;