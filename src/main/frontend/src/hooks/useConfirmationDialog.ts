import { useState, useCallback } from 'react';

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmationDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'default' | 'destructive' | 'warning' | 'info';
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Custom hook for managing confirmation dialogs
 * Provides state management and handlers for confirmation dialogs
 */
export const useConfirmationDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'default',
    isLoading: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setDialogState({
      open: true,
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      variant: options.variant || 'default',
      isLoading: false,
      onConfirm: async () => {
        setDialogState(prev => ({ ...prev, isLoading: true }));
        try {
          await options.onConfirm();
          setDialogState(prev => ({ ...prev, open: false, isLoading: false }));
        } catch (error) {
          console.error('Confirmation action failed:', error);
          setDialogState(prev => ({ ...prev, isLoading: false }));
        }
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        setDialogState(prev => ({ ...prev, open: false }));
      },
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const confirmDelete = useCallback(
    (itemName: string, onConfirm: () => void | Promise<void>) => {
      showConfirmation({
        title: 'Delete Confirmation',
        description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'destructive',
        onConfirm,
      });
    },
    [showConfirmation]
  );

  const confirmAction = useCallback(
    (
      title: string,
      description: string,
      onConfirm: () => void | Promise<void>,
      options?: Partial<ConfirmationOptions>
    ) => {
      showConfirmation({
        title,
        description,
        onConfirm,
        ...options,
      });
    },
    [showConfirmation]
  );

  return {
    dialogState,
    showConfirmation,
    hideConfirmation,
    confirmDelete,
    confirmAction,
  };
};

export default useConfirmationDialog;
