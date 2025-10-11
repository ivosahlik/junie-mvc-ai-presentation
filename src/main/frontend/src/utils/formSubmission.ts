import { AxiosError } from 'axios';

/**
 * Form submission utilities
 * Handles API calls, loading states, error handling, and success notifications
 */

export interface SubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface SubmissionOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorMessage?: boolean;
  redirectOnSuccess?: string;
}

/**
 * Handles form submission with proper error handling and loading states
 */
export const handleFormSubmission = async <T = unknown>(
  submitFunction: () => Promise<T>,
  options: SubmissionOptions = {}
): Promise<SubmissionResult<T>> => {
  const {
    showSuccessMessage = true,
    successMessage = 'Operation completed successfully',
    showErrorMessage = true,
  } = options;

  try {
    const data = await submitFunction();

    if (showSuccessMessage) {
      // In a real app, this would use a toast notification system
      console.log(successMessage);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Form submission error:', error);

    const result: SubmissionResult<T> = {
      success: false,
    };

    if (error instanceof AxiosError) {
      // Handle API errors
      if (error.response?.status === 400 && error.response.data?.fieldErrors) {
        // Handle validation errors from the backend
        result.fieldErrors = error.response.data.fieldErrors;
        result.error = 'Please correct the errors below';
      } else if (error.response?.data?.message) {
        result.error = error.response.data.message;
      } else if (error.response?.status === 404) {
        result.error = 'Resource not found';
      } else if (error.response?.status === 403) {
        result.error = 'You do not have permission to perform this action';
      } else if (error.response?.status === 401) {
        result.error = 'You must be logged in to perform this action';
      } else if (error.response?.status && error.response.status >= 500) {
        result.error = 'Server error. Please try again later';
      } else {
        result.error = 'An unexpected error occurred';
      }
    } else if (error instanceof Error) {
      result.error = error.message;
    } else {
      result.error = 'An unexpected error occurred';
    }

    if (showErrorMessage && result.error) {
      // In a real app, this would use a toast notification system
      console.error(result.error);
    }

    return result;
  }
};

/**
 * Creates a submission handler for CRUD operations
 */
export const createSubmissionHandler = <TData, TResult = unknown>(
  apiCall: (data: TData) => Promise<TResult>,
  options: SubmissionOptions = {}
) => {
  return async (data: TData): Promise<SubmissionResult<TResult>> => {
    return handleFormSubmission(() => apiCall(data), options);
  };
};

/**
 * Handles file upload submissions
 */
export const handleFileUpload = async (
  file: File,
  uploadFunction: (file: File) => Promise<unknown>,
  options: SubmissionOptions = {}
): Promise<SubmissionResult> => {
  // Validate file before upload
  if (!file) {
    return {
      success: false,
      error: 'No file selected',
    };
  }

  // Add file size validation (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File size must be less than 10MB',
    };
  }

  return handleFormSubmission(() => uploadFunction(file), {
    successMessage: 'File uploaded successfully',
    ...options,
  });
};

/**
 * Handles batch operations (multiple items)
 */
export const handleBatchSubmission = async <T>(
  items: T[],
  batchFunction: (items: T[]) => Promise<unknown>,
  options: SubmissionOptions = {}
): Promise<SubmissionResult> => {
  if (items.length === 0) {
    return {
      success: false,
      error: 'No items selected',
    };
  }

  return handleFormSubmission(() => batchFunction(items), {
    successMessage: `Successfully processed ${items.length} item(s)`,
    ...options,
  });
};

/**
 * Utility to extract field errors from API response
 */
export const extractFieldErrors = (error: unknown): Record<string, string[]> => {
  if (error instanceof AxiosError && error.response?.data?.fieldErrors) {
    return error.response.data.fieldErrors;
  }
  return {};
};

/**
 * Utility to check if an error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    error.response?.status === 400 &&
    error.response.data?.fieldErrors
  );
};

/**
 * Utility to format error messages for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.status === 404) {
      return 'Resource not found';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action';
    }
    if (error.response?.status === 401) {
      return 'You must be logged in to perform this action';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Server error. Please try again later';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
