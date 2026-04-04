import React, { useState } from 'react';
import { Plus, Wrench, Clock, CheckCircle, AlertCircle, Calendar, DollarSign, MessageSquare, ThumbsUp, ThumbsDown, Edit, UserX, Info } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockServiceRequests, mockProperties, mockUsers } from '../../data/mockData';
import { ServiceRequest, ServiceCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ServiceRequestManagement: React.FC = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showTenantResponsibilityModal, setShowTenantResponsibilityModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [estimateAmount, setEstimateAmount] = useState('');
  const [estimateDescription, setEstimateDescription] = useState('');
  const [negotiationComment, setNegotiationComment] = useState('');
  const [tenantResponsibilityComment, setTenantResponsibilityComment] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<ServiceCategory>('plumber');
  const [customServiceCategory, setCustomServiceCategory] = useState('');

  const serviceCategories: ServiceCategory[] = [
    'electrician', 'carpenter', 'painter', 'welding', 'tiles_repair', 
    'leakage_repair', 'plumber', 'cleaner', 'general', 'other'
  ];

  // Filter requests based on user role
  const getFilteredRequests = () => {
    switch (user?.role) {
      case 'landlord':
        return mockServiceRequests.filter(r => r.landlordId === user.id);
      case 'tenant':
        return mockServiceRequests.filter(r => r.tenantId === user.id);
      case 'service_provider':
        return mockServiceRequests.filter(r => r.serviceProviderId === user.id);
      case 'admin':
      case 'superadmin':
        return mockServiceRequests;
      default:
        return [];
    }
  };

  const requests = getFilteredRequests();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'assigned':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'estimate_submitted':
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      case 'tenant_responsibility':
        return <UserX className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'estimate_submitted':
        return 'bg-purple-100 text-purple-800';
      case 'tenant_responsibility':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const formatServiceCategory = (category: ServiceCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'tenant':
        return 'Service Requests';
      case 'landlord':
        return 'Maintenance Management';
      case 'service_provider':
        return 'My Tasks';
      case 'admin':
      case 'superadmin':
        return 'All Service Requests';
      default:
        return 'Service Requests';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'tenant':
        return 'Submit and track your maintenance requests';
      case 'landlord':
        return 'Manage property maintenance and service requests';
      case 'service_provider':
        return 'View and manage your assigned tasks';
      case 'admin':
      case 'superadmin':
        return 'Monitor all service requests across the platform';
      default:
        return 'Manage service requests';
    }
  };

  const handleSubmitEstimate = () => {
    if (!estimateAmount || !estimateDescription) {
      alert('Please fill in all fields');
      return;
    }
    
    console.log('Submitting estimate:', {
      requestId: selectedRequest?.id,
      amount: estimateAmount,
      description: estimateDescription
    });
    
    setShowEstimateModal(false);
    setSelectedRequest(null);
    setEstimateAmount('');
    setEstimateDescription('');
  };

  const handleApproveEstimate = (request: ServiceRequest) => {
    console.log('Approving estimate for request:', request.id);
    // Here you would update the request status
  };

  const handleNegotiateEstimate = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowNegotiationModal(true);
  };

  const handleRejectEstimate = (request: ServiceRequest) => {
    console.log('Rejecting estimate for request:', request.id);
    // Here you would update the request status
  };

  const handleSendNegotiation = () => {
    if (!negotiationComment) {
      alert('Please enter a comment');
      return;
    }
    
    console.log('Sending negotiation:', {
      requestId: selectedRequest?.id,
      comment: negotiationComment
    });
    
    setShowNegotiationModal(false);
    setSelectedRequest(null);
    setNegotiationComment('');
  };

  const handleMarkTenantResponsibility = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowTenantResponsibilityModal(true);
  };

  const handleSubmitTenantResponsibility = () => {
    if (!tenantResponsibilityComment) {
      alert('Please enter a comment explaining why this is tenant responsibility');
      return;
    }
    
    console.log('Marking as tenant responsibility:', {
      requestId: selectedRequest?.id,
      comment: tenantResponsibilityComment
    });
    
    setShowTenantResponsibilityModal(false);
    setSelectedRequest(null);
    setTenantResponsibilityComment('');
    // Here you would update the request status to 'tenant_responsibility'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600">{getPageDescription()}</p>
        </div>
        {user?.role === 'tenant' && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddForm(true)}
          >
            New Request
          </Button>
        )}
      </div>

      {/* Service Payment Information */}
      {(user?.role === 'tenant' || user?.role === 'service_provider') && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Service Payment Processing</h3>
              <div className="text-sm text-blue-800 space-y-2">
                {user?.role === 'tenant' && (
                  <>
                    <p>• Service payments are collected through the platform's secure payment gateway</p>
                    <p>• Platform fees and processing charges are included in the total amount</p>
                    <p>• Payments are distributed to service providers after completion and verification</p>
                  </>
                )}
                {user?.role === 'service_provider' && (
                  <>
                    <p>• Service payments are collected from tenants through the platform</p>
                    <p>• TDS and platform fees are automatically deducted from your payment</p>
                    <p>• Net amount is transferred to your registered bank account after job completion</p>
                    <p>• Payment processing typically takes 1-2 business days after completion</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Wrench className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'in_progress' || r.status === 'assigned').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="p-6" hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Wrench className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {formatServiceCategory(request.serviceProviderCategory)}
                  </p>
                  <p className="text-sm text-gray-500">{getPropertyTitle(request.propertyId)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{request.description}</p>

            {/* Tenant Responsibility Alert */}
            {request.status === 'tenant_responsibility' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <UserX className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Tenant Responsibility</p>
                    {request.landlordComment && (
                      <p className="text-sm text-orange-700 mt-1">
                        <strong>Landlord Comment:</strong> {request.landlordComment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Request Details */}
            <div className="space-y-2 mb-4">
              {user?.role !== 'tenant' && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Tenant:</span> {getUserName(request.tenantId)}
                </div>
              )}
              {user?.role !== 'landlord' && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Landlord:</span> {getUserName(request.landlordId)}
                </div>
              )}
              {request.serviceProviderId && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Assigned to:</span> {getUserName(request.serviceProviderId)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                {request.priority} priority
              </span>
              {request.estimatedCost && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Est. ₹{request.estimatedCost.toLocaleString()}
                </div>
              )}
            </div>

            {/* Payment Information for Completed Requests */}
            {request.status === 'completed' && request.actualCost && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Payment Processed</span>
                  <span className="text-sm font-semibold text-green-800">
                    ₹{request.actualCost.toLocaleString()}
                  </span>
                </div>
                {user?.role === 'service_provider' && (
                  <div className="text-xs text-green-700 space-y-1">
                    <p>• Platform fees and TDS deducted</p>
                    <p>• Net amount: ₹{(request.actualCost * 0.85).toLocaleString()} (approx.)</p>
                    <p>• Payment status: {request.serviceProviderPayoutStatus || 'Processing'}</p>
                  </div>
                )}
                {user?.role === 'tenant' && (
                  <div className="text-xs text-green-700">
                    <p>Payment collected via platform gateway (includes processing fees)</p>
                  </div>
                )}
              </div>
            )}

            {/* Estimate and Approval Status */}
            {request.estimatedCost && request.landlordApprovalStatus && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Estimate Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApprovalStatusColor(request.landlordApprovalStatus)}`}>
                    {request.landlordApprovalStatus}
                  </span>
                </div>
                {request.landlordComment && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Landlord Comment:</span> {request.landlordComment}
                  </p>
                )}
              </div>
            )}

            {request.scheduledDate && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              
              {/* Service Provider Actions */}
              {user?.role === 'service_provider' && request.status === 'assigned' && !request.estimatedCost && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowEstimateModal(true);
                  }}
                >
                  Submit Estimate
                </Button>
              )}
              
              {user?.role === 'service_provider' && (request.status === 'assigned' || request.status === 'in_progress') && (
                <Button variant="secondary" size="sm">
                  Update Status
                </Button>
              )}

              {/* Landlord Actions */}
              {user?.role === 'landlord' && request.status === 'pending' && (
                <>
                  <Button variant="primary" size="sm">
                    Assign Worker
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkTenantResponsibility(request)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Tenant Responsibility
                  </Button>
                </>
              )}

              {user?.role === 'landlord' && request.estimatedCost && request.landlordApprovalStatus === 'pending' && (
                <>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleApproveEstimate(request)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleNegotiateEstimate(request)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Negotiate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRejectEstimate(request)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}

              {/* Admin Actions */}
              {(user?.role === 'admin' || user?.role === 'superadmin') && request.status === 'pending' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMarkTenantResponsibility(request)}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Tenant Responsibility
                </Button>
              )}

              {/* Tenant Actions */}
              {user?.role === 'tenant' && request.status !== 'completed' && request.status !== 'tenant_responsibility' && (
                <Button variant="secondary" size="sm">
                  Update
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="p-12 text-center">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Requests</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'tenant' 
              ? "You haven't submitted any service requests yet."
              : "No service requests found for your properties."
            }
          </p>
          {user?.role === 'tenant' && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              Submit First Request
            </Button>
          )}
        </Card>
      )}

      {/* Add Request Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">New Service Request</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Category
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Custom Service Category */}
                {selectedServiceCategory === 'other' && (
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
                    Issue Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Payment Information</p>
                      <p className="text-sm text-blue-700">
                        Service payments will be processed through the platform's secure gateway. 
                        Platform fees and processing charges will be included in the final amount.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Submit Estimate Modal */}
      {showEstimateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Submit Estimate</h2>
                <button
                  onClick={() => setShowEstimateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Request: {selectedRequest.title}</p>
                  <p className="text-sm text-gray-500">Property: {getPropertyTitle(selectedRequest.propertyId)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={estimateAmount}
                    onChange={(e) => setEstimateAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter estimated cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Description
                  </label>
                  <textarea
                    value={estimateDescription}
                    onChange={(e) => setEstimateDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Describe the work to be done..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Payment will be processed through the platform. TDS and platform fees will be deducted from your final payment.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1" onClick={handleSubmitEstimate}>
                    Submit Estimate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEstimateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Negotiation Modal */}
      {showNegotiationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Negotiate Estimate</h2>
                <button
                  onClick={() => setShowNegotiationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Estimate: ₹{selectedRequest.estimatedCost?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Request: {selectedRequest.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Comment
                  </label>
                  <textarea
                    value={negotiationComment}
                    onChange={(e) => setNegotiationComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Enter your negotiation comment or counter-offer..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" className="flex-1" onClick={handleSendNegotiation}>
                    Send Negotiation
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNegotiationModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tenant Responsibility Modal */}
      {showTenantResponsibilityModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Mark as Tenant Responsibility</h2>
                <button
                  onClick={() => setShowTenantResponsibilityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Request: {selectedRequest.title}</p>
                  <p className="text-sm text-gray-500">Property: {getPropertyTitle(selectedRequest.propertyId)}</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <UserX className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">Important Notice</p>
                      <p className="text-sm text-orange-700">
                        This will mark the request as tenant's responsibility and send it back to the tenant with your comment.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason/Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={tenantResponsibilityComment}
                    onChange={(e) => setTenantResponsibilityComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Explain why this is the tenant's responsibility to fix/repair..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="warning" className="flex-1" onClick={handleSubmitTenantResponsibility}>
                    Mark as Tenant Responsibility
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTenantResponsibilityModal(false)}
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

export default ServiceRequestManagement;