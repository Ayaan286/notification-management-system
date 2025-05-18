import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useNotificationContext } from '../context/NotificationContext';
import { NotificationType } from '../types/notification';

interface NotificationFormProps {
  type: NotificationType;
}

const NotificationForm: React.FC<NotificationFormProps> = ({ type }) => {
  const { sendNotification } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: '',
    title: '',
    priority: 'normal',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate recipient based on type
    if (!formData.recipient) {
      newErrors.recipient = 'Recipient is required';
    } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipient)) {
      newErrors.recipient = 'Valid email address is required';
    } else if (type === 'sms' && !/^\+?[1-9]\d{9,14}$/.test(formData.recipient)) {
      newErrors.recipient = 'Valid phone number is required';
    }
    
    // Validate subject for email
    if (type === 'email' && !formData.subject) {
      newErrors.subject = 'Subject is required for emails';
    }
    
    // Validate title for in-app notifications
    if (type === 'in-app' && !formData.title) {
      newErrors.title = 'Title is required for in-app notifications';
    }
    
    // Validate message
    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (type === 'sms' && formData.message.length > 160) {
      newErrors.message = 'SMS message must be 160 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare notification data based on type
      const notificationData = {
        type,
        recipient: formData.recipient,
        subject: type === 'email' ? formData.subject : undefined,
        title: type === 'in-app' ? formData.title : undefined,
        message: formData.message,
        priority: type === 'in-app' ? formData.priority : undefined,
      };
      
      await sendNotification(notificationData);
      
      // Reset form after successful submission
      setFormData({
        recipient: '',
        subject: '',
        message: '',
        title: '',
        priority: 'normal',
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Create {type.toUpperCase()} Notification</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="input-label">
            {type === 'email' ? 'Email Address' : type === 'sms' ? 'Phone Number' : 'User ID'}
          </label>
          <input
            type={type === 'email' ? 'email' : type === 'sms' ? 'tel' : 'text'}
            id="recipient"
            name="recipient"
            placeholder={type === 'email' ? 'user@example.com' : type === 'sms' ? '+1234567890' : 'user123'}
            className={`input ${errors.recipient ? 'border-red-500' : ''}`}
            value={formData.recipient}
            onChange={handleInputChange}
          />
          {errors.recipient && (
            <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>
          )}
        </div>
        
        {type === 'email' && (
          <div>
            <label htmlFor="subject" className="input-label">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Your email subject"
              className={`input ${errors.subject ? 'border-red-500' : ''}`}
              value={formData.subject}
              onChange={handleInputChange}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
        )}
        
        {type === 'in-app' && (
          <>
            <div>
              <label htmlFor="title" className="input-label">Notification Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Notification title"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="priority" className="input-label">Priority</label>
              <select
                id="priority"
                name="priority"
                className="input"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="message" className="input-label">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder={`Enter your ${type} message...`}
            className={`input resize-y ${errors.message ? 'border-red-500' : ''}`}
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          {type === 'sms' && (
            <p className="mt-1 text-xs text-gray-500">
              {formData.message.length}/160 characters
              {formData.message.length > 160 && (
                <span className="text-red-500"> (exceeds limit)</span>
              )}
            </p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;