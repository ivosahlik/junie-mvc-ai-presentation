import { useState, useCallback } from 'react';

export interface FormDialogState {
  open: boolean;
  title: string;
  description?: string;
  submitLabel: string;
  cancelLabel: string;
  isLoading: boolean;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FormDialogOptions {
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Custom hook for managing form dialogs
 * Provides state management and handlers for form dialogs
 */
export const useFormDialog = () => {
  const [dialogState, setDialogState] = useState<FormDialogState>({
    open: false,
    title: '',
    description: undefined,
    submitLabel: 'Save',
    cancelLabel: 'Cancel',
    isLoading: false,
    size: 'md',
  });

  const openDialog = useCallback((options: FormDialogOptions) => {
    setDialogState({
      open: true,
      title: options.title,
      description: options.description,
      submitLabel: options.submitLabel || 'Save',
      cancelLabel: options.cancelLabel || 'Cancel',
      isLoading: false,
      size: options.size || 'md',
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setDialogState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const openCreateDialog = useCallback(
    (entityName: string, options?: Partial<FormDialogOptions>) => {
      openDialog({
        title: `Create ${entityName}`,
        description: `Add a new ${entityName.toLowerCase()} to the system`,
        submitLabel: 'Create',
        ...options,
      });
    },
    [openDialog]
  );

  const openEditDialog = useCallback(
    (entityName: string, options?: Partial<FormDialogOptions>) => {
      openDialog({
        title: `Edit ${entityName}`,
        description: `Update the ${entityName.toLowerCase()} information`,
        submitLabel: 'Update',
        ...options,
      });
    },
    [openDialog]
  );

  const openViewDialog = useCallback(
    (entityName: string, options?: Partial<FormDialogOptions>) => {
      openDialog({
        title: `View ${entityName}`,
        description: `View ${entityName.toLowerCase()} details`,
        submitLabel: 'Close',
        cancelLabel: '',
        ...options,
      });
    },
    [openDialog]
  );

  return {
    dialogState,
    openDialog,
    closeDialog,
    setLoading,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
  };
};

export default useFormDialog;
