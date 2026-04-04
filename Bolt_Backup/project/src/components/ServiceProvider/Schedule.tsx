import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockServiceRequests, mockProperties, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter service requests for current service provider
  const myRequests = mockServiceRequests.filter(r => r.serviceProviderId === user?.id);
  
  // Filter requests for selected date
  const scheduledRequests = myRequests.filter(r => 
    r.scheduledDate && new Date(r.scheduledDate).toDateString() === new Date(selectedDate).toDateString()
  );

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const getPropertyAddress = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? `${property.address}, ${property.city}` : 'Unknown Address';
  };

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const upcomingRequests = myRequests.filter(r => 
    r.scheduledDate && new Date(r.scheduledDate) > new Date() && r.status !== 'completed'
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Schedule</h1>
        <p className="text-gray-600">Manage your service appointments and tasks</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{scheduledRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myRequests.filter(r => r.status === 'assigned').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myRequests.filter(r => r.status === 'in_progress').length}
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
                {myRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Date Selector and Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Daily Schedule</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {scheduledRequests.length > 0 ? (
              <div className="space-y-4">
                {scheduledRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-50 rounded-lg">
                          <Wrench className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-500 capitalize">{request.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {request.scheduledDate ? new Date(request.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Time TBD'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {getPropertyAddress(request.propertyId)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        Contact: {getUserName(request.tenantId)}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {request.status === 'assigned' && (
                        <Button variant="primary" size="sm">
                          Start Work
                        </Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button variant="success" size="sm">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Tasks Scheduled</h4>
                <p className="text-gray-600">No tasks are scheduled for {new Date(selectedDate).toLocaleDateString()}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
            {upcomingRequests.length > 0 ? (
              <div className="space-y-3">
                {upcomingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{request.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{getPropertyTitle(request.propertyId)}</p>
                    {request.scheduledDate && (
                      <p className="text-xs text-gray-600">
                        {new Date(request.scheduledDate).toLocaleDateString()} at{' '}
                        {new Date(request.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No upcoming tasks</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" className="h-12">
            <Clock className="mr-2 h-4 w-4" />
            Check In
          </Button>
          <Button variant="secondary" className="h-12">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
          <Button variant="outline" className="h-12">
            <User className="mr-2 h-4 w-4" />
            Contact Customer
          </Button>
          <Button variant="outline" className="h-12">
            <Wrench className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;