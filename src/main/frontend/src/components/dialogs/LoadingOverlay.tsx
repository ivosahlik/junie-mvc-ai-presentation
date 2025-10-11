import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

/**
 * Loading overlay component that shows a loading spinner over content
 * Can be used as an overlay or inline loading indicator
 */
const LoadingOverlay = ({
  isLoading,
  children,
  message = 'Loading...',
  className = '',
  spinnerSize = 'md',
  overlay = true,
}: LoadingOverlayProps) => {
  const getSpinnerSize = () => {
    switch (spinnerSize) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  if (!isLoading) {
    return <>{children}</>;
  }

  if (overlay) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className={`${getSpinnerSize()} animate-spin text-primary`} />
            {message && <p className="text-sm text-gray-600 font-medium">{message}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Inline loading (replaces content)
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`${getSpinnerSize()} animate-spin text-primary`} />
        {message && <p className="text-sm text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingOverlay;
