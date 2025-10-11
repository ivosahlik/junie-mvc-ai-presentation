import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast as ToastType } from '../../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

/**
 * Individual toast notification component
 */
const Toast = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          icon: XCircle,
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          icon: AlertTriangle,
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          icon: Info,
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
          icon: Info,
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full
        transition-all duration-300 ease-in-out transform
        ${styles.bgColor} ${styles.textColor}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && <h4 className="text-sm font-medium mb-1">{toast.title}</h4>}
        <p className="text-sm">{toast.message}</p>

        {toast.action && (
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={toast.action.onClick} className="text-xs">
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        className={`flex-shrink-0 h-6 w-6 p-0 ${styles.iconColor} hover:bg-black/10`}
        onClick={handleRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Toast;
