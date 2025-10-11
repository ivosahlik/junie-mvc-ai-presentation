import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export interface TableAction<T> {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

interface TableActionsProps<T> {
  row: T;
  actions: TableAction<T>[];
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * Table actions dropdown menu component
 * Provides a dropdown menu with customizable actions for table rows
 */
const TableActions = <T,>({
  row,
  actions,
  triggerClassName = '',
  align = 'end',
}: TableActionsProps<T>) => {
  // Filter out hidden actions
  const visibleActions = actions.filter(action => !action.hidden || !action.hidden(row));

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${triggerClassName}`}
          aria-label="Open menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          const isDisabled = action.disabled ? action.disabled(row) : false;

          return (
            <div key={action.key}>
              {action.separator && index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => !isDisabled && action.onClick(row)}
                disabled={isDisabled}
                className={`flex items-center gap-2 ${
                  action.variant === 'destructive' ? 'text-red-600 focus:text-red-600' : ''
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Quick action buttons component (alternative to dropdown for fewer actions)
 */
interface QuickActionsProps<T> {
  row: T;
  actions: TableAction<T>[];
  className?: string;
}

export const QuickActions = <T,>({ row, actions, className = '' }: QuickActionsProps<T>) => {
  const visibleActions = actions.filter(action => !action.hidden || !action.hidden(row));

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleActions.map(action => {
        const Icon = action.icon;
        const isDisabled = action.disabled ? action.disabled(row) : false;

        return (
          <Button
            key={action.key}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              action.variant === 'destructive'
                ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                : ''
            }`}
            onClick={() => !isDisabled && action.onClick(row)}
            disabled={isDisabled}
            title={action.label}
          >
            {Icon && <Icon className="h-4 w-4" />}
          </Button>
        );
      })}
    </div>
  );
};

export default TableActions;
