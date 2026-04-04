import React, { useState } from 'react';
import { Wrench, Clock, CheckCircle, AlertCircle, Calendar, DollarSign, TrendingUp, MapPin } from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { mockServiceRequests, mockProperties, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ServiceProviderDashboard: React.FC = () => {
  const { user } = useAuth();

  // Filter service requests for current service provider
  const myRequests = mockServiceRequests.filter(r => r.serviceProviderId === user?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'assigned' || r.status === 'pending');
  const inProgressRequests = myRequests.filter(r => r.status === 'in_progress');
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  // Calculate earnings
  const totalEarnings = completedRequests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0);
  const thisMonthEarnings = completedRequests
    .filter(r => r.completedDate && new Date(r.completedDate).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0);

  const recentRequests = myRequests.slice(0, 3);

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

  const formatServiceCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Service Provider Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your tasks and earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Tasks"
          value={pendingRequests.length}
          icon={AlertCircle}
          color="warning"
        />
        <StatsCard
          title="In Progress"
          value={inProgressRequests.length}
          icon={Clock}
          color="secondary"
        />
        <StatsCard
          title="Completed"
          value={completedRequests.length}
          icon={CheckCircle}
          color="success"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
          icon={DollarSign}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Service Category Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">My Service Category</h3>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
            {user?.serviceProviderCategory ? formatServiceCategory(user.serviceProviderCategory) : 'General'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(thisMonthEarnings)}</div>
            <div className="text-sm text-gray-600">This Month Earnings</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{myRequests.length}</div>
            <div className="text-sm text-gray-600">Total Tasks Assigned</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {completedRequests.length > 0 ? Math.round((completedRequests.length / myRequests.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </Card>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{request.title}</p>
                  <p className="text-sm text-gray-500">{getPropertyTitle(request.propertyId)}</p>
                  <p className="text-sm text-gray-500">Client: {getUserName(request.tenantId)}</p>
                  {request.estimatedCost && (
                    <p className="text-sm text-green-600">Estimate: {formatCurrency(request.estimatedCost)}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : request.status === 'assigned'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
            <Button variant="outline" size="sm">View Schedule</Button>
          </div>
          <div className="space-y-4">
            {myRequests
              .filter(r => r.scheduledDate && new Date(r.scheduledDate).toDateString() === new Date().toDateString())
              .slice(0, 3)
              .map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{request.title}</h4>
                    <span className="text-xs text-gray-500">
                      {request.scheduledDate ? new Date(request.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getPropertyAddress(request.propertyId)}
                  </div>
                  <p className="text-xs text-gray-500">Contact: {getUserName(request.tenantId)}</p>
                </div>
              ))}
            {myRequests.filter(r => r.scheduledDate && new Date(r.scheduledDate).toDateString() === new Date().toDateString()).length === 0 && (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No tasks scheduled for today</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" className="h-12">
            <Wrench className="mr-2 h-4 w-4" />
            View Tasks
          </Button>
          <Button variant="secondary" className="h-12">
            <Calendar className="mr-2 h-4 w-4" />
            My Schedule
          </Button>
          <Button variant="success" className="h-12">
            <DollarSign className="mr-2 h-4 w-4" />
            Earnings
          </Button>
          <Button variant="outline" className="h-12">
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceProviderDashboard;