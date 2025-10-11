/**
 * Form validation utilities
 * Provides common validation functions and error handling
 */

export interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single field against multiple rules
 */
export const validateField = (value: unknown, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates multiple fields
 */
export const validateForm = (
  data: Record<string, unknown>,
  rules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    results[field] = validateField(data[field], fieldRules);
  }

  return results;
};

/**
 * Checks if form validation results are all valid
 */
export const isFormValid = (results: Record<string, ValidationResult>): boolean => {
  return Object.values(results).every(result => result.isValid);
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: value => value !== null && value !== undefined && value !== '',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: value => !value || (typeof value === 'string' && value.length >= min),
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: value => !value || (typeof value === 'string' && value.length <= max),
    message: message || `Must be no more than ${max} characters`,
  }),

  email: (message = 'Must be a valid email address'): ValidationRule => ({
    validate: value =>
      !value || (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
    message,
  }),

  number: (message = 'Must be a valid number'): ValidationRule => ({
    validate: value => !value || !isNaN(Number(value)),
    message,
  }),

  positiveNumber: (message = 'Must be a positive number'): ValidationRule => ({
    validate: value => !value || (!isNaN(Number(value)) && Number(value) > 0),
    message,
  }),

  integer: (message = 'Must be a whole number'): ValidationRule => ({
    validate: value => !value || Number.isInteger(Number(value)),
    message,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: value => !value || Number(value) >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: value => !value || Number(value) <= max,
    message: message || `Must be no more than ${max}`,
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: value => !value || (typeof value === 'string' && regex.test(value)),
    message,
  }),

  custom: (validator: (value: unknown) => boolean, message: string): ValidationRule => ({
    validate: validator,
    message,
  }),
};

/**
 * Beer-specific validation rules
 */
export const beerValidationRules = {
  beerName: [
    validationRules.required('Beer name is required'),
    validationRules.minLength(2, 'Beer name must be at least 2 characters'),
    validationRules.maxLength(100, 'Beer name must be no more than 100 characters'),
  ],

  beerStyle: [validationRules.required('Beer style is required')],

  price: [
    validationRules.required('Price is required'),
    validationRules.positiveNumber('Price must be a positive number'),
  ],

  quantityOnHand: [
    validationRules.integer('Quantity must be a whole number'),
    validationRules.min(0, 'Quantity cannot be negative'),
  ],
};

/**
 * Customer-specific validation rules
 */
export const customerValidationRules = {
  customerName: [
    validationRules.required('Customer name is required'),
    validationRules.minLength(2, 'Customer name must be at least 2 characters'),
    validationRules.maxLength(100, 'Customer name must be no more than 100 characters'),
  ],

  email: [validationRules.email('Must be a valid email address')],
};
