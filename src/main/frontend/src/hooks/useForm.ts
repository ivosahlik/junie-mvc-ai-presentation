import { useState, useCallback } from 'react';
import { validateForm, isFormValid } from '../utils/validation';
import type { ValidationRule } from '../utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule[]>>;
  onSubmit?: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string[]>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: unknown) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for form state management with validation
 */
export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationRules = {} as Partial<Record<keyof T, ValidationRule[]>>,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a single field value
  const setValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValuesState(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]?.length > 0) {
        setErrors(prev => ({ ...prev, [field]: [] }));
      }
    },
    [errors]
  );

  // Set multiple field values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set error for a specific field
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: [error] }));
  }, []);

  // Clear error for a specific field
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: [] }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string[]>);
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): boolean => {
      const fieldRules = validationRules[field];
      if (!fieldRules) return true;

      const result = validateForm({ [field]: values[field] }, { [field]: fieldRules });
      const fieldResult = result[field as string];

      setErrors(prev => ({ ...prev, [field]: fieldResult.errors }));
      return fieldResult.isValid;
    },
    [values, validationRules]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    if (Object.keys(validationRules).length === 0) return true;

    const results = validateForm(values, validationRules as Record<string, ValidationRule[]>);
    const newErrors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;

    for (const [field, result] of Object.entries(results)) {
      newErrors[field as keyof T] = result.errors;
    }

    setErrors(newErrors);
    return isFormValid(results);
  }, [values, validationRules]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (isSubmitting) return;

      const isFormValidResult = validateAll();
      if (!isFormValidResult || !onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit, isSubmitting]
  );

  // Reset form to initial values
  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({} as Record<keyof T, string[]>);
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.values(errors).every(fieldErrors => fieldErrors.length === 0);

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    validateField,
    validateAll,
    handleSubmit,
    reset,
  };
};

export default useForm;
