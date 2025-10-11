import axios, { AxiosError } from 'axios';

/**
 * API Error Types
 */
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * API Error Interface
 */
export interface ApiError {
  type: ApiErrorType;
  status?: number;
  message: string;
  details?: unknown;
  originalError?: Error;
}

/**
 * Create a standardized API error from an Axios error
 */
export function handleApiError(error: unknown): ApiError {
  // Default error
  const apiError: ApiError = {
    type: ApiErrorType.UNKNOWN_ERROR,
    message: 'An unknown error occurred',
  };

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      apiError.type = ApiErrorType.TIMEOUT_ERROR;
      apiError.message = 'Request timed out. Please try again.';
    } else if (!axiosError.response) {
      apiError.type = ApiErrorType.NETWORK_ERROR;
      apiError.message = 'Network error. Please check your connection.';
    } else {
      // HTTP status code errors
      const status = axiosError.response.status;
      apiError.status = status;

      switch (true) {
        case status === 400:
          apiError.type = ApiErrorType.BAD_REQUEST;
          apiError.message = 'Invalid request. Please check your data.';
          apiError.details = axiosError.response.data;
          break;
        case status === 401:
          apiError.type = ApiErrorType.UNAUTHORIZED;
          apiError.message = 'Authentication required. Please log in.';
          break;
        case status === 403:
          apiError.type = ApiErrorType.FORBIDDEN;
          apiError.message = 'You do not have permission to access this resource.';
          break;
        case status === 404:
          apiError.type = ApiErrorType.NOT_FOUND;
          apiError.message = 'The requested resource was not found.';
          break;
        case status >= 500:
          apiError.type = ApiErrorType.SERVER_ERROR;
          apiError.message = 'Server error. Please try again later.';
          break;
        default:
          apiError.type = ApiErrorType.UNKNOWN_ERROR;
          apiError.message = `Error ${status}: ${axiosError.message}`;
      }
    }

    apiError.originalError = axiosError;
  } else if (error instanceof Error) {
    apiError.message = error.message;
    apiError.originalError = error;
  }

  // Log the error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', apiError);
  }

  return apiError;
}

/**
 * Display an error notification to the user
 * This can be integrated with a toast notification system
 */
export function showErrorNotification(error: ApiError): void {
  // This is a placeholder for a toast notification
  // In a real application, you would use a toast library like react-toastify
  console.error(`[Error Notification] ${error.message}`);

  // Example integration with a toast library:
  // toast.error(error.message, {
  //   position: "top-right",
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  // });
}

/**
 * Handle an API error and show a notification
 */
export function handleAndNotifyError(error: unknown): ApiError {
  const apiError = handleApiError(error);
  showErrorNotification(apiError);
  return apiError;
}
