import React, { useState } from 'react';
import { Building2, MapPin, Bed, Bath, Square, Search, Filter, Heart, Phone, Mail } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockProperties, mockUsers } from '../../data/mockData';

const PropertyListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Filter available properties (no tenant assigned)
  const availableProperties = mockProperties.filter(p => !p.tenantId);

  const getLandlordName = (landlordId: string) => {
    const landlord = mockUsers.find(u => u.id === landlordId);
    return landlord ? landlord.name : 'Unknown Landlord';
  };

  const getLandlordContact = (landlordId: string) => {
    const landlord = mockUsers.find(u => u.id === landlordId);
    return landlord ? { phone: landlord.phone, email: landlord.email } : null;
  };

  const filteredProperties = availableProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === 'all' || property.city === cityFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      matchesPrice = property.rent >= min && (max ? property.rent <= max : true);
    }
    
    return matchesSearch && matchesCity && matchesType && matchesPrice;
  });

  const uniqueCities = [...new Set(availableProperties.map(p => p.city))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Available Properties for Rent</h1>
        <p className="text-gray-600">Browse and find your perfect rental property</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Cities</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Prices</option>
            <option value="0-15000">Under ₹15,000</option>
            <option value="15000-25000">₹15,000 - ₹25,000</option>
            <option value="25000-35000">₹25,000 - ₹35,000</option>
            <option value="35000-50000">₹35,000 - ₹50,000</option>
            <option value="50000">Above ₹50,000</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredProperties.length} properties available for rent
        </p>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Sort by: Newest</option>
            <option>Sort by: Price Low to High</option>
            <option>Sort by: Price High to Low</option>
            <option>Sort by: Area</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const landlordContact = getLandlordContact(property.landlordId);
          
          return (
            <Card key={property.id} className="overflow-hidden" hover>
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.address}, {property.city}</span>
                  </div>
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

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Landlord Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Owner: {getLandlordName(property.landlordId)}
                  </p>
                  {landlordContact && (
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {landlordContact.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {landlordContact.email}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">₹{property.rent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Security Deposit</p>
                    <p className="text-sm font-semibold text-gray-900">₹{property.deposit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="primary" className="flex-1">
                    Contact Owner
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-4">
            No properties match your current search criteria. Try adjusting your filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setCityFilter('all');
              setTypeFilter('all');
              setPriceRange('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default PropertyListing;