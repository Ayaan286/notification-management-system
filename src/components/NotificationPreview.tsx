import React from 'react';
import { Mail, Smartphone, MessageSquare, Clock, User, Info, AlertCircle } from 'lucide-react';
import { useNotificationContext } from '../context/NotificationContext';
import { NotificationType } from '../types/notification';

interface NotificationPreviewProps {
  type: NotificationType;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ type }) => {
  const { formPreview } = useNotificationContext();
  
  if (!formPreview) {
    return (
      <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <Info className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Fill out the form to see a preview of your notification
          </p>
        </div>
      </div>
    );
  }

  const renderEmailPreview = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Email Preview</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="mb-3">
          <p className="text-sm text-gray-500">To: {formPreview.recipient || 'recipient@example.com'}</p>
          <p className="text-sm text-gray-500">Subject: {formPreview.subject || 'No subject'}</p>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm whitespace-pre-line">{formPreview.message || 'No message content'}</p>
        </div>
      </div>
    </div>
  );

  const renderSmsPreview = () => (
    <div className="max-w-xs mx-auto">
      <div className="p-4 bg-gray-800 rounded-t-lg flex justify-between items-center">
        <div className="text-white text-xs">Carrier</div>
        <div className="flex space-x-1">
          <div className="w-4 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="border-l border-r border-b border-gray-300 rounded-b-lg bg-gray-100 p-3">
        <div className="bg-green-100 rounded-lg p-3 max-w-[80%] relative mb-2 text-sm">
          <div className="text-gray-800 whitespace-pre-line">{formPreview.message || 'SMS message preview'}</div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            <Clock className="inline h-3 w-3 mr-1" />
            Just now
          </div>
          <div className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2">
            <div className="w-2 h-2 bg-green-100 rotate-45"></div>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500 mt-2">
          Sent to {formPreview.recipient || '+1234567890'}
        </div>
      </div>
    </div>
  );

  const renderInAppPreview = () => {
    const getPriorityColor = () => {
      switch (formPreview?.priority) {
        case 'low': return 'bg-gray-100 border-gray-200';
        case 'high': return 'bg-orange-50 border-orange-200';
        case 'urgent': return 'bg-red-50 border-red-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    };
    
    const getPriorityIcon = () => {
      switch (formPreview?.priority) {
        case 'low': return <Info className="h-5 w-5 text-gray-500" />;
        case 'high': return <AlertCircle className="h-5 w-5 text-orange-500" />;
        case 'urgent': return <AlertCircle className="h-5 w-5 text-red-500" />;
        default: return <Info className="h-5 w-5 text-blue-500" />;
      }
    };
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-800 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
            <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-white text-xs">App Interface</div>
        </div>
        <div className="p-4 bg-gray-100">
          <div className={`border rounded-lg p-3 ${getPriorityColor()} mb-2`}>
            <div className="flex items-start">
              {getPriorityIcon()}
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-800">
                    {formPreview?.title || 'Notification Title'}
                  </p>
                  <span className="text-xs text-gray-500">Now</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                  {formPreview?.message || 'In-app notification message will appear here'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {formPreview?.recipient || 'user123'}
            </div>
            <div className="text-blue-600 font-medium">View all notifications</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Preview</h3>
      <div className="h-full">
        {type === 'email' && renderEmailPreview()}
        {type === 'sms' && renderSmsPreview()}
        {type === 'in-app' && renderInAppPreview()}
      </div>
    </div>
  );
};

export default NotificationPreview;