import type { ReactNode } from 'react';
import { Label } from '../ui/label';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
  htmlFor?: string;
}

/**
 * Form field component that provides consistent field layout
 * Includes label, input, error message, and help text
 */
const FormField = ({
  label,
  children,
  error,
  helpText,
  required = false,
  className = '',
  htmlFor,
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {children}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default FormField;
