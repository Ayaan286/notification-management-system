import React from 'react';
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface NotificationStatusBadgeProps {
  status: string;
}

const NotificationStatusBadge: React.FC<NotificationStatusBadgeProps> = ({ status }) => {
  let badgeClass = '';
  let icon = null;
  let label = status;
  
  switch (status) {
    case 'sent':
      badgeClass = 'status-pill status-sent';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'failed':
      badgeClass = 'status-pill status-failed';
      icon = <AlertTriangle className="h-3 w-3 mr-1" />;
      break;
    case 'pending':
      badgeClass = 'status-pill status-pending';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'retrying':
      badgeClass = 'status-pill status-retrying';
      icon = <RefreshCw className="h-3 w-3 mr-1 animate-spin" />;
      break;
    default:
      badgeClass = 'status-pill bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={badgeClass}>
      <span className="flex items-center">
        {icon}
        <span className="capitalize">{label}</span>
      </span>
    </span>
  );
};

export default NotificationStatusBadge;