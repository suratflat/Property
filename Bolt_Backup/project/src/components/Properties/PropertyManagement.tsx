import React, { useState } from 'react';
import { Building2, Plus, MapPin, Bed, Bath, Square, Users, Edit, Trash2, Zap, User, Upload, Map, DollarSign, Percent } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockProperties, mockUsers } from '../../data/mockData';
import { Property, User as UserType } from '../../types';
import { useAuth } from '../../context/AuthContext';

const PropertyManagement: React.FC = () => {
  const { user } = useAuth();
  const [properties] = useState<Property[]>(mockProperties);
  const [users] = useState<UserType[]>(mockUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const landlords = users.filter(u => u.role === 'landlord');
  const tenants = users.filter(u => u.role === 'tenant');

  // Filter properties based on user role
  const filteredProperties = user?.role === 'landlord' 
    ? properties.filter(p => p.landlordId === user.id)
    : properties;

  const PropertyForm = ({ property, onClose }: { property?: Property; onClose: () => void }) => {
    const [brokerageType, setBrokerageType] = useState<'fixed' | 'percentage'>(
      property?.brokerage?.type || 'percentage'
    );
    const [brokerageValue, setBrokerageValue] = useState<string>(
      property?.brokerage?.value?.toString() || ''
    );
    const [brokerageCollectionType, setBrokerageCollectionType] = useState<'upfront' | 'recurring'>(
      property?.brokerage?.collectionType || 'recurring'
    );
    const [brokerageDescription, setBrokerageDescription] = useState<string>(
      property?.brokerage?.description || ''
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {property ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter property title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select 
                      defaultValue={property?.type}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    defaultValue={property?.address}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.city}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.pincode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps Location
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      defaultValue={property?.googleMapsLocation}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter address or paste Google Maps link"
                    />
                    <Button variant="outline" type="button">
                      <Map className="h-4 w-4 mr-1" />
                      Get Location
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This will help tenants and service providers navigate to the property
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      defaultValue={property?.bedrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      defaultValue={property?.bathrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      defaultValue={property?.area}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
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
                      defaultValue={property?.rent}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={property?.deposit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Brokerage/Commission Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Brokerage/Commission Configuration
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Platform Commission</p>
                      <p className="text-sm text-blue-700">
                        Configure how the platform will collect commission/brokerage for this property.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brokerage Type
                    </label>
                    <select 
                      value={brokerageType}
                      onChange={(e) => setBrokerageType(e.target.value as 'fixed' | 'percentage')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="percentage">Percentage of Rent</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {brokerageType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={brokerageValue}
                        onChange={(e) => setBrokerageValue(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={brokerageType === 'percentage' ? '5' : '2000'}
                        step={brokerageType === 'percentage' ? '0.1' : '100'}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {brokerageType === 'percentage' ? (
                          <Percent className="h-4 w-4 text-gray-400" />
                        ) : (
                          <span className="text-gray-400 text-sm">₹</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setBrokerageCollectionType('upfront')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        brokerageCollectionType === 'upfront'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 mr-2" />
                        <span className="font-medium">Upfront Collection</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Collect brokerage as a one-time payment when tenant moves in
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrokerageCollectionType('recurring')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        brokerageCollectionType === 'recurring'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 mr-2" />
                        <span className="font-medium">Recurring Collection</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Collect brokerage monthly along with rent payment
                      </p>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={brokerageDescription}
                    onChange={(e) => setBrokerageDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Enter a description for this brokerage arrangement..."
                  />
                </div>

                {/* Brokerage Preview */}
                {brokerageValue && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Brokerage Preview</h4>
                    <div className="text-sm text-green-800">
                      {brokerageType === 'percentage' ? (
                        <p>
                          <strong>{brokerageValue}%</strong> of monthly rent will be collected as commission
                          {property?.rent && (
                            <span> (₹{Math.round((parseFloat(brokerageValue) / 100) * property.rent).toLocaleString()} per month)</span>
                          )}
                        </p>
                      ) : (
                        <p>
                          <strong>₹{parseFloat(brokerageValue).toLocaleString()}</strong> will be collected as commission
                        </p>
                      )}
                      <p className="mt-1">
                        Collection: <strong>{brokerageCollectionType === 'upfront' ? 'One-time upfront payment' : 'Monthly with rent'}</strong>
                      </p>
                      {brokerageDescription && (
                        <p className="mt-1 italic">"{brokerageDescription}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Media Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Photos
                    </label>
                    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6`}>
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each (Max 10 photos)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Video (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload property walkthrough video</p>
                        <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Assignment (Admin Only) */}
              {user?.role === 'admin' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Landlord
                      </label>
                      <select 
                        defaultValue={property?.landlordId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Landlord</option>
                        {landlords.map(landlord => (
                          <option key={landlord.id} value={landlord.id}>
                            {landlord.name} ({landlord.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Tenant (Optional)
                      </label>
                      <select 
                        defaultValue={property?.tenantId || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.name} ({tenant.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Utility Consumer Numbers */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Utility Consumer Numbers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DGVCL Consumer Number
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.dgvclConsumerNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter DGVCL consumer number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gujarat Gas Consumer Number
                    </label>
                    <input
                      type="text"
                      defaultValue={property?.gujaratGasConsumerNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter Gujarat Gas consumer number"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      Consumer numbers will be used to automatically link utility bills to this property.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="primary" className="flex-1">
                  {property ? 'Update Property' : 'Add Property'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Property Management</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Manage all properties and assign users' 
              : 'Manage your property portfolio'
            }
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddForm(true)}
        >
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden" hover>
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.address}, {property.city}</span>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms} BD
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms} BA
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {property.area} sq ft
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>Landlord: {getUserName(property.landlordId)}</span>
                </div>
                {property.tenantId && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Tenant: {getUserName(property.tenantId)}</span>
                  </div>
                )}
              </div>

              {/* Brokerage Information */}
              {property.brokerage && (
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-800">Commission Setup</span>
                  </div>
                  <div className="text-xs text-green-700">
                    {property.brokerage.type === 'percentage' ? (
                      <p>{property.brokerage.value}% of rent</p>
                    ) : (
                      <p>₹{property.brokerage.value.toLocaleString()} fixed</p>
                    )}
                    <p className="capitalize">{property.brokerage.collectionType} collection</p>
                    {property.brokerage.description && (
                      <p className="italic mt-1">"{property.brokerage.description}"</p>
                    )}
                  </div>
                </div>
              )}

              {/* Utility Consumer Numbers */}
              {(property.dgvclConsumerNumber || property.gujaratGasConsumerNumber) && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-2">
                    <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">Utility Connections</span>
                  </div>
                  {property.dgvclConsumerNumber && (
                    <div className="text-xs text-gray-600">DGVCL: {property.dgvclConsumerNumber}</div>
                  )}
                  {property.gujaratGasConsumerNumber && (
                    <div className="text-xs text-gray-600">Gujarat Gas: {property.gujaratGasConsumerNumber}</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-primary-600">₹{property.rent.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setEditingProperty(property)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Property Modal */}
      {showAddForm && (
        <PropertyForm onClose={() => setShowAddForm(false)} />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <PropertyForm 
          property={editingProperty} 
          onClose={() => setEditingProperty(null)} 
        />
      )}
    </div>
  );
};

export default PropertyManagement;