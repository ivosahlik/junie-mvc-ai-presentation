import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Reusable confirmation dialog component
 * Provides consistent styling and behavior for confirmation dialogs
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  icon,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          iconColor: 'text-red-500',
          confirmButtonVariant: 'destructive' as const,
          defaultIcon: <XCircle className="h-6 w-6" />,
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          confirmButtonVariant: 'default' as const,
          defaultIcon: <AlertTriangle className="h-6 w-6" />,
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          confirmButtonVariant: 'default' as const,
          defaultIcon: <Info className="h-6 w-6" />,
        };
      default:
        return {
          iconColor: 'text-green-500',
          confirmButtonVariant: 'default' as const,
          defaultIcon: <CheckCircle className="h-6 w-6" />,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const displayIcon = icon || variantStyles.defaultIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {displayIcon && <div className={variantStyles.iconColor}>{displayIcon}</div>}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variantStyles.confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
