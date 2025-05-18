import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { 
  Notification, 
  NotificationFormData,
  NotificationPreview,
  NotificationStatus 
} from '../types/notification';
import { supabase } from '../lib/supabase';

interface NotificationContextProps {
  notifications: Notification[];
  formPreview: NotificationPreview | null;
  sendNotification: (data: NotificationFormData) => Promise<void>;
  updateFormPreview: (data: NotificationPreview | null) => void;
  resendNotification: (id: string) => void;
}

// Create context
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Sample initial data
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'email',
    recipient: 'john.doe@example.com',
    subject: 'Welcome to NotifyHub',
    message: 'Thank you for signing up for our service. We are excited to have you on board!',
    status: 'sent',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'sms',
    recipient: '+12345678901',
    message: 'Your verification code is 123456. It expires in 10 minutes.',
    status: 'sent',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: '3',
    type: 'in-app',
    recipient: 'user123',
    title: 'New Feature Available',
    message: 'We\'ve just launched a new feature. Check it out!',
    priority: 'normal',
    status: 'sent',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: '4',
    type: 'email',
    recipient: 'jane.smith@example.com',
    subject: 'Your Monthly Report',
    message: 'Your monthly activity report is now available. Click here to view it.',
    status: 'failed',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [formPreview, setFormPreview] = useState<NotificationPreview | null>(null);
  
  // Listen for form changes to update preview
  useEffect(() => {
    const formChangeListener = (e: Event) => {
      const target = e.target as HTMLInputElement;
      
      if (target.form?.id === 'notification-form') {
        // This would be implemented to update the preview in real-time
      }
    };
    
    document.addEventListener('input', formChangeListener);
    
    return () => {
      document.removeEventListener('input', formChangeListener);
    };
  }, []);
  
  // Send a notification
  const sendNotification = async (data: NotificationFormData): Promise<void> => {
    try {
      // For demo purposes, we'll just add to local state
      const newNotification: Notification = {
        id: uuidv4(),
        ...data,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      toast.success(`${data.type.toUpperCase()} notification sent successfully`);
      setFormPreview(null);
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error(`Failed to send ${data.type} notification`);
      throw error;
    }
  };
  
  // Update form preview
  const updateFormPreview = (data: NotificationPreview | null) => {
    setFormPreview(data);
  };
  
  // Resend a failed notification
  const resendNotification = (id: string) => {
    const notificationToResend = notifications.find(n => n.id === id);
    
    if (!notificationToResend) return;
    
    // Update status to retrying
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, status: 'retrying' as NotificationStatus, updatedAt: new Date().toISOString() } 
          : n
      )
    );
    
    // Simulate resend process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate on retry
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === id 
            ? { 
                ...n, 
                status: success ? 'sent' as NotificationStatus : 'failed' as NotificationStatus,
                retries: (n.retries || 0) + 1,
                updatedAt: new Date().toISOString()
              } 
            : n
        )
      );
      
      if (success) {
        toast.success('Notification resent successfully');
      } else {
        toast.error('Failed to resend notification');
      }
    }, 2000);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        formPreview,
        sendNotification,
        updateFormPreview,
        resendNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};