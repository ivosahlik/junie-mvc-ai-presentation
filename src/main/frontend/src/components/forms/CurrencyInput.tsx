import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: number;
  onChange?: (value: number | undefined) => void;
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  allowNegative?: boolean;
}

/**
 * Specialized input component for currency values
 * Handles currency formatting and validation
 */
const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      currency = 'USD',
      locale = 'en-US',
      min = 0,
      max,
      allowNegative = false,
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Format number as currency
    const formatCurrency = useCallback(
      (num: number): string => {
        try {
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(num);
        } catch {
          // Fallback formatting
          return `$${num.toFixed(2)}`;
        }
      },
      [locale, currency]
    );

    // Parse currency string to number
    const parseCurrency = (str: string): number | undefined => {
      // Remove currency symbols and formatting
      const cleaned = str.replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? undefined : num;
    };

    // Update display value when value prop changes
    useEffect(() => {
      if (value !== undefined && !isFocused) {
        setDisplayValue(formatCurrency(value));
      } else if (value === undefined && !isFocused) {
        setDisplayValue('');
      }
    }, [value, isFocused, currency, locale, formatCurrency]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Show raw number when focused for easier editing
      if (value !== undefined) {
        setDisplayValue(value.toString());
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      const numValue = parseCurrency(displayValue);
      if (numValue !== undefined) {
        // Apply constraints
        let constrainedValue = numValue;
        if (min !== undefined && constrainedValue < min) {
          constrainedValue = min;
        }
        if (max !== undefined && constrainedValue > max) {
          constrainedValue = max;
        }
        if (!allowNegative && constrainedValue < 0) {
          constrainedValue = 0;
        }

        onChange?.(constrainedValue);
        setDisplayValue(formatCurrency(constrainedValue));
      } else {
        onChange?.(undefined);
        setDisplayValue('');
      }

      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (isFocused) {
        // When focused, allow typing raw numbers
        const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
        if (inputValue === '' || regex.test(inputValue)) {
          setDisplayValue(inputValue);
        }
      } else {
        setDisplayValue(inputValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }

      // Ensure that it is a number or decimal point and stop the keypress
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105) &&
        e.keyCode !== 190 &&
        e.keyCode !== 110
      ) {
        e.preventDefault();
      }

      props.onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
