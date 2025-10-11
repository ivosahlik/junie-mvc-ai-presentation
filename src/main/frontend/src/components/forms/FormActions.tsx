import type { ReactNode } from 'react';
import { Button } from '../ui/button';

interface FormActionsProps {
  children?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  submitDisabled?: boolean;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Form actions component that provides consistent button layout
 * Includes submit and cancel buttons with loading states
 */
const FormActions = ({
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
  submitDisabled = false,
  className = '',
  alignment = 'right',
}: FormActionsProps) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex gap-3 pt-6 border-t ${alignmentClasses[alignment]} ${className}`}>
      {children ? (
        children
      ) : (
        <>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isLoading || submitDisabled}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </>
      )}
    </div>
  );
};

export default FormActions;
