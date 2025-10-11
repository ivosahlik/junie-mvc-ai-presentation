import React, { forwardRef } from 'react';
import { Input } from '../ui/input';

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  allowNegative?: boolean;
}

/**
 * Specialized input component for numeric values
 * Handles number formatting and validation
 */
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      allowDecimals = true,
      allowNegative = true,
      className,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty string
      if (inputValue === '') {
        onChange?.(undefined);
        return;
      }

      // Validate input based on constraints
      let regex = allowNegative ? /^-?\d*/ : /^\d*/;
      if (allowDecimals) {
        regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
      }

      if (!regex.test(inputValue)) {
        return; // Don't update if invalid
      }

      const numValue = parseFloat(inputValue);

      // Check if it's a valid number
      if (!isNaN(numValue)) {
        // Apply min/max constraints
        let constrainedValue = numValue;
        if (min !== undefined && constrainedValue < min) {
          constrainedValue = min;
        }
        if (max !== undefined && constrainedValue > max) {
          constrainedValue = max;
        }

        onChange?.(constrainedValue);
      } else if (inputValue.endsWith('.') && allowDecimals) {
        // Allow typing decimal point - don't call onChange yet, wait for more input
        return;
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Clean up the value on blur
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const numValue = parseFloat(inputValue);
        onChange?.(numValue);
      }

      props.onBlur?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className={className}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
