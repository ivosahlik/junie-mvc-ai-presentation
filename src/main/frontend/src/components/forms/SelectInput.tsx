import { forwardRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
}

/**
 * Specialized select input component with consistent styling
 * Handles dropdown selections with proper keyboard navigation
 */
const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = 'Select an option...',
      disabled = false,
      className,
      allowClear = false,
    },
    ref
  ) => {
    const handleValueChange = (newValue: string) => {
      if (newValue === '__clear__' && allowClear) {
        onChange?.('');
      } else {
        onChange?.(newValue);
      }
    };

    return (
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowClear && value && (
            <SelectItem value="__clear__" className="text-gray-500 italic">
              Clear selection
            </SelectItem>
          )}
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
