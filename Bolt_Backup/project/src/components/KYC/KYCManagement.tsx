import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle, Eye, FileText, User, CreditCard, Users, ArrowRight } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { useAuth } from '../../context/AuthContext';

const KYCManagement: React.FC = () => {
  const { user } = useAuth();
  const [showESign, setShowESign] = useState(false);
  const [panCardNumber, setPanCardNumber] = useState(user?.panCardNumber || '');
  const [aadhaarNumber, setAadhaarNumber] = useState(user?.aadhaarNumber || '');

  // Derive KYC status from user context
  const kycStatus = user?.kycRequestStatus || 'none';
  const isKYCVerified = kycStatus === 'verified';

  // Check if user is admin or superadmin (they don't need e-sign)
  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';

  const handleNavigateToUserManagement = () => {
    // This would typically use a router to navigate
    // For now, we'll just show an alert
    alert('Navigating to User Management section...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">KYC & Digital Verification</h1>
        <p className="text-gray-600">
          {isAdminUser 
            ? 'Manage KYC verification and access user documents'
            : 'Complete your identity verification and digital signing process'
          }
        </p>
      </div>

      {/* Admin KYC Document Access Notice */}
      {isAdminUser && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Administrator KYC Access</h3>
                <p className="text-blue-800">
                  As an administrator, you can view and manage KYC documents for all users including Landlords, Tenants, and Service Providers. 
                  All KYC document viewing and management is handled through the User Management section.
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Digital signatures are not required for admin accounts as they don't sign rental agreements.
                </p>
              </div>
            </div>
            <Button 
              variant="primary"
              onClick={handleNavigateToUserManagement}
              className="flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Go to User Management
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* KYC Document Access Guide for Admins */}
      {isAdminUser && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">KYC Document Access Guide</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Viewing User KYC Documents
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                To view uploaded PAN card and Aadhaar card documents for Landlords, Tenants, and Service Providers:
              </p>
              <ol className="text-sm text-gray-700 space-y-1 ml-4">
                <li>1. Navigate to the <strong>User Management</strong> section from the sidebar</li>
                <li>2. Find the user whose KYC documents you want to view</li>
                <li>3. Click the <strong>"View KYC"</strong> button in the Actions column</li>
                <li>4. Review their PAN card and Aadhaar verification status</li>
                <li>5. Approve or reject KYC submissions as needed</li>
              </ol>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                KYC Verification Actions
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Available actions for KYC management:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>Request KYC:</strong> Send KYC verification request to users</li>
                <li>• <strong>View Documents:</strong> Access uploaded PAN and Aadhaar documents</li>
                <li>• <strong>Approve KYC:</strong> Verify and approve submitted documents</li>
                <li>• <strong>Reject KYC:</strong> Reject incomplete or invalid submissions</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important Note</p>
                  <p className="text-sm text-yellow-700">
                    This KYC Management section is designed for individual users to submit their own documents. 
                    Administrative KYC oversight and document viewing is centralized in the User Management section 
                    to maintain clear separation between personal profile management and administrative functions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* KYC Request Status - Only for non-admin users */}
      {kycStatus === 'requested' && !isAdminUser && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">KYC Verification Requested</h3>
              <p className="text-yellow-800">
                The admin has requested you to complete your KYC verification. Please complete the process below.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* KYC Status - Only for non-admin users */}
      {!isAdminUser && (
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-3 rounded-full ${
              kycStatus === 'verified' ? 'bg-green-100' : 
              kycStatus === 'rejected' ? 'bg-red-100' : 
              kycStatus === 'submitted' ? 'bg-blue-100' :
              kycStatus === 'requested' ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              <Shield className={`h-6 w-6 ${
                kycStatus === 'verified' ? 'text-green-600' : 
                kycStatus === 'rejected' ? 'text-red-600' : 
                kycStatus === 'submitted' ? 'text-blue-600' :
                kycStatus === 'requested' ? 'text-yellow-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">KYC Status</h3>
              <p className={`text-sm font-medium ${
                kycStatus === 'verified' ? 'text-green-600' : 
                kycStatus === 'rejected' ? 'text-red-600' : 
                kycStatus === 'submitted' ? 'text-blue-600' :
                kycStatus === 'requested' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {kycStatus === 'verified' ? 'Verified' : 
                 kycStatus === 'rejected' ? 'Rejected' : 
                 kycStatus === 'submitted' ? 'Under Review' :
                 kycStatus === 'requested' ? 'Verification Requested' : 'Not Started'}
              </p>
            </div>
          </div>

          {kycStatus === 'requested' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Please complete your KYC verification as requested by the administrator.
                </p>
              </div>
            </div>
          )}

          {kycStatus === 'submitted' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Your KYC documents have been submitted and are under review. This may take 24-48 hours.
                </p>
              </div>
            </div>
          )}

          {kycStatus === 'verified' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  Your identity has been successfully verified. You can now access all features.
                </p>
              </div>
            </div>
          )}

          {kycStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">
                  Your KYC verification was rejected. Please contact support or resubmit with correct documents.
                </p>
              </div>
            </div>
          )}

          {isKYCVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Your KYC documents are verified and cannot be modified. If you need to update your information, please contact support.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* PAN Card Verification - Hidden for Admin users */}
      {!isAdminUser && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">PAN Card Verification</h3>
                <p className="text-sm text-gray-600">Verify your identity using PAN Card</p>
              </div>
            </div>
            {user?.panCardNumber && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                value={panCardNumber}
                onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
                placeholder="Enter 10-character PAN number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                maxLength={10}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                disabled={isKYCVerified}
              />
              <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PAN Card Image
              </label>
              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 ${isKYCVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isKYCVerified ? 'Document verified - cannot be modified' : 'Upload PAN card image'}
                  </p>
                  {!isKYCVerified && (
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  )}
                </div>
              </div>
            </div>

            {!isKYCVerified && (
              <Button variant="primary" className="w-full md:w-auto">
                Verify PAN Card
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Aadhaar Verification - Hidden for Admin users */}
      {!isAdminUser && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Aadhaar Verification</h3>
                <p className="text-sm text-gray-600">Verify your identity using Aadhaar</p>
              </div>
            </div>
            {kycStatus === 'verified' && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                maxLength={12}
                disabled={isKYCVerified}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used for digital signature verification in agreements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Aadhaar Front
                </label>
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 ${isKYCVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {isKYCVerified ? 'Document verified' : 'Upload front side'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Aadhaar Back
                </label>
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 ${isKYCVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {isKYCVerified ? 'Document verified' : 'Upload back side'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isKYCVerified && (
              <Button variant="primary" className="w-full md:w-auto">
                Verify Aadhaar
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* E-Sign - Only show for non-admin users */}
      {!isAdminUser && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary-50 rounded-lg">
                <FileText className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Digital Signature (E-Sign)</h3>
                <p className="text-sm text-gray-600">Set up your digital signature for agreements</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">E-Sign Benefits:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Legally binding digital signatures</li>
                <li>• Quick agreement signing process</li>
                <li>• Secure and encrypted</li>
                <li>• Paperless transactions</li>
                <li>• Aadhaar-based authentication</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowESign(true)}
                disabled={kycStatus !== 'verified'}
              >
                Set up E-Sign
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Sample
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* E-Sign Setup Modal - Only for non-admin users */}
      {showESign && !isAdminUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-secondary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Setup E-Sign</h2>
                <p className="text-gray-600 mt-1">Create your digital signature</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your verified Aadhaar number will be used for digital signatures
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP Verification
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    We'll send an OTP to your registered mobile number
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Your signature will be encrypted and stored securely
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="secondary" className="flex-1">
                    Verify & Setup
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowESign(false)}
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

export default KYCManagement;