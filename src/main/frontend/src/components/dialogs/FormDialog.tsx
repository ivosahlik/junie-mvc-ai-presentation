import type { ReactNode, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormWrapper, FormActions } from '../forms';

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal form dialog component
 * Provides a consistent modal wrapper for forms
 */
const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false,
  submitDisabled = false,
  className = '',
  size = 'md',
}: FormDialogProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'sm:max-w-md';
      case 'lg':
        return 'sm:max-w-2xl';
      case 'xl':
        return 'sm:max-w-4xl';
      default:
        return 'sm:max-w-lg';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getSizeClass()} max-h-[90vh] overflow-y-auto ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <FormWrapper onSubmit={onSubmit} isLoading={isLoading}>
          <div className="space-y-4">{children}</div>

          <FormActions
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitDisabled={submitDisabled}
          />
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
