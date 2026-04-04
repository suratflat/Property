import React, { useState } from 'react';
import { FileText, Download, Calendar, User, Home, CheckCircle, Clock, AlertCircle, Shield, Users } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockAgreements, mockProperties, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const TenantAgreementView: React.FC = () => {
  const { user } = useAuth();
  const [showESignModal, setShowESignModal] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [aadhaarOtp, setAadhaarOtp] = useState('');

  // Filter agreements for current tenant
  const tenantAgreements = mockAgreements.filter(a => a.tenantIds.includes(user?.id || ''));

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const getPropertyAddress = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? `${property.address}, ${property.city}` : 'Unknown Address';
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

  const needsSignature = (agreement: any) => {
    const currentUserSignatory = agreement.signatories.find((s: any) => s.userId === user?.id);
    return currentUserSignatory && !currentUserSignatory.signed;
  };

  const handleESign = (agreement: any) => {
    setSelectedAgreement(agreement);
    setShowESignModal(true);
  };

  const handleSignAgreement = () => {
    // Simulate e-signing process
    console.log('E-signing agreement:', selectedAgreement?.id, 'with Aadhaar OTP:', aadhaarOtp);
    setShowESignModal(false);
    setSelectedAgreement(null);
    setAadhaarOtp('');
    // Here you would update the agreement status
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Agreements</h1>
        <p className="text-gray-600">View and manage your rental agreements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agreements</p>
              <p className="text-2xl font-semibold text-gray-900">{tenantAgreements.length}</p>
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
                {tenantAgreements.filter(a => getAgreementStatus(a) === 'signed').length}
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
                {tenantAgreements.filter(a => needsSignature(a)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Agreements List */}
      <div className="space-y-6">
        {tenantAgreements.map((agreement) => {
          const daysRemaining = calculateDaysRemaining(agreement.endDate);
          const status = getAgreementStatus(agreement);
          const needsMySignature = needsSignature(agreement);
          
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
                    <p className="text-sm text-gray-500">{getPropertyAddress(agreement.propertyId)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Agreement Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Landlords: {agreement.landlordIds.map((id: string) => getUserName(id)).join(', ')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    Tenants: {agreement.tenantIds.map((id: string) => getUserName(id)).join(', ')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Duration: {new Date(agreement.startDate).toLocaleDateString()} - {new Date(agreement.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    Monthly Rent: ₹{agreement.rentAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    Security Deposit: ₹{agreement.depositAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Signature Status */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Signature Status</h4>
                <div className="space-y-2">
                  {agreement.signatories.map((signatory: any) => (
                    <div key={signatory.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {getUserName(signatory.userId)} ({signatory.role})
                          {signatory.userId === user?.id && <span className="text-primary-600 font-medium"> (You)</span>}
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

              {/* Agreement Status Alerts */}
              {needsMySignature && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      <strong>Action Required:</strong> This agreement requires your digital signature. Please review and sign using your Aadhaar authentication.
                    </p>
                  </div>
                </div>
              )}

              {daysRemaining > 0 && daysRemaining <= 30 && status === 'signed' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                    <p className="text-sm text-orange-800">
                      ⚠️ Agreement expires in {daysRemaining} days. Please contact your landlord for renewal.
                    </p>
                  </div>
                </div>
              )}

              {daysRemaining <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      ⚠️ Agreement has expired. Please contact your landlord immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* Key Terms Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Terms</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {agreement.terms.slice(0, 3).map((term: string, index: number) => (
                    <li key={index}>• {term}</li>
                  ))}
                  {agreement.terms.length > 3 && (
                    <li className="text-primary-600">• +{agreement.terms.length - 3} more terms</li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  View Full Agreement
                </Button>
                {needsMySignature && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleESign(agreement)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    E-Sign Now
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {tenantAgreements.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agreements Found</h3>
          <p className="text-gray-600 mb-4">
            You don't have any rental agreements yet. Your landlord will create and share agreements with you.
          </p>
        </Card>
      )}

      {/* E-Sign Modal */}
      {showESignModal && selectedAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Digital Signature Required</h2>
                <p className="text-gray-600 mt-1">Sign agreement using Aadhaar authentication</p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Agreement Details:</h4>
                  <p className="text-sm text-blue-800">{getPropertyTitle(selectedAgreement.propertyId)}</p>
                  <p className="text-xs text-blue-700">Rent: ₹{selectedAgreement.rentAmount.toLocaleString()}/month</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={user?.aadhaarNumber || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your registered Aadhaar number will be used for verification
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar OTP Verification
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    We'll send an OTP to your registered mobile number for Aadhaar authentication
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    maxLength={6}
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Your signature will be legally binding and encrypted
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    onClick={handleSignAgreement}
                    disabled={!aadhaarOtp || aadhaarOtp.length !== 6}
                  >
                    Verify & Sign
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowESignModal(false)}
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

export default TenantAgreementView;