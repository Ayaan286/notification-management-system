import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, BarChart2, Users, Mail, MessageSquare, Smartphone } from 'lucide-react';
import NotificationForm from '../components/NotificationForm';
import NotificationPreview from '../components/NotificationPreview';
import StatsCard from '../components/StatsCard';
import { useNotificationContext } from '../context/NotificationContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'in-app'>('email');
  const { notifications } = useNotificationContext();
  
  // Calculate statistics
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    pending: notifications.filter(n => n.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Send and monitor notifications from a centralized dashboard
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Notifications" 
          value={stats.total} 
          icon={<BarChart2 className="h-6 w-6 text-blue-600" />} 
          trend={{ value: "+12.5%", positive: true }} 
        />
        <StatsCard 
          title="Successful Deliveries" 
          value={stats.sent} 
          icon={<CheckCircle className="h-6 w-6 text-green-600" />} 
          trend={{ value: "+8.2%", positive: true }} 
        />
        <StatsCard 
          title="Failed Notifications" 
          value={stats.failed} 
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />} 
          trend={{ value: "-3.1%", positive: true }} 
        />
        <StatsCard 
          title="Active Users" 
          value={2384} 
          icon={<Users className="h-6 w-6 text-purple-600" />} 
          trend={{ value: "+5.7%", positive: true }} 
        />
      </div>

      {/* Notification Creator Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Send Notification</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create and send notifications to users through multiple channels
          </p>
        </div>
        
        {/* Notification Type Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'sms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>SMS</span>
            </button>
            <button
              onClick={() => setActiveTab('in-app')}
              className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'in-app'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>In-App</span>
            </button>
          </nav>
        </div>
        
        {/* Notification Creator Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <NotificationForm type={activeTab} />
          </div>
          <div>
            <NotificationPreview type={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;