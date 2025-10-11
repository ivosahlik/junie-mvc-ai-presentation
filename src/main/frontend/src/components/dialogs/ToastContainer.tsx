import { createPortal } from 'react-dom';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';

interface ToastContainerProps {
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  className?: string;
}

/**
 * Container component that displays all active toasts
 * Uses React Portal to render toasts at the document level
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  className = '',
}) => {
  const { toasts, removeToast } = useToast();

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  const toastContainer = (
    <div
      className={`
        fixed z-50 flex flex-col gap-2 pointer-events-none
        ${getPositionClasses()}
        ${className}
      `}
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );

  // Use portal to render toasts at document level
  return createPortal(toastContainer, document.body);
};

export default ToastContainer;
