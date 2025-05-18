import React, { useState } from 'react';
import { Filter, RefreshCw, Download, Search } from 'lucide-react';
import { useNotificationContext } from '../context/NotificationContext';
import NotificationStatusBadge from '../components/NotificationStatusBadge';
import { NotificationType } from '../types/notification';

const History: React.FC = () => {
  const { notifications, resendNotification } = useNotificationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle notification resend
  const handleResend = (id: string) => {
    resendNotification(id);
  };

  // Mock CSV export
  const handleExport = () => {
    alert('Export functionality would download a CSV of the filtered notifications');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Notification History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all your sent notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExport}
            className="btn btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="in-app">In-App</option>
            </select>
            
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="retrying">Retrying</option>
            </select>
            
            <button className="btn btn-secondary flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Recipient</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Subject/Message</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <tr key={notification.id} className="table-row">
                  <td className="table-cell font-medium text-gray-800">{notification.recipient}</td>
                  <td className="table-cell capitalize">{notification.type}</td>
                  <td className="table-cell">
                    {notification.subject ? (
                      <div>
                        <div className="font-medium text-gray-800">{notification.subject}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{notification.message}</div>
                      </div>
                    ) : (
                      <div className="text-gray-800 truncate max-w-xs">{notification.message}</div>
                    )}
                  </td>
                  <td className="table-cell">
                    <NotificationStatusBadge status={notification.status} />
                  </td>
                  <td className="table-cell">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    {notification.status === 'failed' && (
                      <button 
                        onClick={() => handleResend(notification.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Resend
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="table-cell text-center py-8">
                  <p className="text-gray-500">No notifications found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or send some notifications</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;