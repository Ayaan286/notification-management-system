export type NotificationType = 'email' | 'sms' | 'in-app';

export type NotificationStatus = 'sent' | 'failed' | 'pending' | 'retrying';

export interface NotificationPreview {
  type: NotificationType;
  recipient?: string;
  subject?: string;
  title?: string;
  message?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface Notification {
  id: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  title?: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
  retries?: number;
}

export interface NotificationFormData {
  type: NotificationType;
  recipient: string;
  subject?: string;
  title?: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}