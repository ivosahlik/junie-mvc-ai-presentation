import { Eye, Edit, Trash2, Copy, Download } from 'lucide-react';
import type { TableAction } from './TableActions';

/**
 * Predefined common table actions
 */
export const createCommonActions = <T>(callbacks: {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCopy?: (row: T) => void;
  onDownload?: (row: T) => void;
}): TableAction<T>[] => {
  const actions: TableAction<T>[] = [];

  if (callbacks.onView) {
    actions.push({
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: callbacks.onView,
    });
  }

  if (callbacks.onEdit) {
    actions.push({
      key: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: callbacks.onEdit,
    });
  }

  if (callbacks.onCopy) {
    actions.push({
      key: 'copy',
      label: 'Duplicate',
      icon: Copy,
      onClick: callbacks.onCopy,
    });
  }

  if (callbacks.onDownload) {
    actions.push({
      key: 'download',
      label: 'Download',
      icon: Download,
      onClick: callbacks.onDownload,
    });
  }

  if (callbacks.onDelete) {
    actions.push({
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: callbacks.onDelete,
      variant: 'destructive',
      separator: true,
    });
  }

  return actions;
};
