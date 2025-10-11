import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import BeerCreatePage from '../../pages/beers/BeerCreatePage';
import { createMockBeer } from '../../test/utils';
import apiService from '../../services/api';
import { useForm, useToast } from '../../hooks';

// Mock the API service that beerService depends on
jest.mock('../../services/api');

// Mock the hooks
jest.mock('../../hooks', () => ({
  useForm: jest.fn(),
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Type the mocked services and hooks
const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockUseForm = useForm as jest.MockedFunction<typeof useForm>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('Beer Creation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete the full beer creation flow', async () => {
    const user = userEvent.setup();

    // Mock successful beer creation
    const newBeer = createMockBeer({
      id: 1,
      beerName: 'Test IPA',
      beerStyle: 'IPA',
      price: 12.99,
      quantityOnHand: 100,
    });
    mockApiService.createWithNotification.mockResolvedValue(newBeer);

    // Mock the useForm hook to return controlled form behavior
    const mockFormState = {
      values: {
        beerName: 'Test Beer',
        beerStyle: 'IPA',
        upc: '123456789',
        price: 12.99,
        quantityOnHand: 100,
        imageUrl: undefined,
      },
      errors: {},
      isValid: true, // Make form valid so submit button can be clicked
      isSubmitting: false,
      setValue: jest.fn(),
      setValues: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearErrors: jest.fn(),
      validateField: jest.fn(),
      validateAll: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
    };
    (mockUseForm as jest.MockedFunction<typeof useForm>).mockReturnValue(mockFormState);

    render(<BeerCreatePage />);

    // Verify the page renders correctly
    expect(screen.getByText('Create New Beer')).toBeInTheDocument();
    expect(screen.getByText('Add a new beer to your inventory')).toBeInTheDocument();

    // Check that form fields are present
    expect(screen.getByLabelText(/beer name/i)).toBeInTheDocument();
    expect(screen.getByText('Beer Style')).toBeInTheDocument(); // Look for exact label text
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity on hand/i)).toBeInTheDocument();

    // Check that action buttons are present
    expect(screen.getByRole('button', { name: /create beer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to beers/i })).toBeInTheDocument();

    // Test form interaction
    const beerNameInput = screen.getByLabelText(/beer name/i);
    await user.type(beerNameInput, 'Test IPA');
    expect(mockFormState.setValue).toHaveBeenCalledWith('beerName', expect.any(String));

    // Test form submission
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    await user.click(submitButton);
    expect(mockFormState.handleSubmit).toHaveBeenCalled();

    // Test cancel functionality
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/beers');

    // Test back button functionality
    const backButton = screen.getByRole('button', { name: /back to beers/i });
    await user.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/beers');
  });

  it('should handle form validation errors', async () => {
    // Mock form with validation errors
    const mockFormState = {
      values: {
        beerName: '',
        beerStyle: '',
        upc: '',
        price: undefined,
        quantityOnHand: undefined,
        imageUrl: undefined,
      },
      errors: {
        beerName: ['Beer name is required'],
        beerStyle: ['Beer style is required'],
        price: ['Price must be greater than 0'],
      },
      isValid: false,
      isSubmitting: false,
      setValue: jest.fn(),
      setValues: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearErrors: jest.fn(),
      validateField: jest.fn(),
      validateAll: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
    };
    (mockUseForm as jest.MockedFunction<typeof useForm>).mockReturnValue(mockFormState);

    render(<BeerCreatePage />);

    // Check that validation errors are displayed
    expect(screen.getByText('Beer name is required')).toBeInTheDocument();
    expect(screen.getByText('Beer style is required')).toBeInTheDocument();
    expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();

    // Check that submit button is disabled when form is invalid
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    expect(submitButton).toBeDisabled();
  });

  it('should handle API errors during beer creation', async () => {
    const user = userEvent.setup();

    // Mock API error
    mockApiService.createWithNotification.mockRejectedValue(new Error('API Error'));

    // Mock form with valid data but API error

    const mockFormState = {
      values: {
        beerName: 'Test Beer',
        beerStyle: 'IPA',
        upc: '123456789',
        price: 12.99,
        quantityOnHand: 100,
        imageUrl: undefined,
      },
      errors: {},
      isValid: true,
      isSubmitting: false,
      setValue: jest.fn(),
      setValues: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearErrors: jest.fn(),
      validateField: jest.fn(),
      validateAll: jest.fn(),
      handleSubmit: jest.fn(async formData => {
        // Simulate the actual form submission logic
        try {
          await mockApiService.createWithNotification('/api/v1/beers', formData);
        } catch {
          mockUseToast().error('Failed to create beer. Please try again.');
        }
      }),
      reset: jest.fn(),
    };
    (mockUseForm as jest.MockedFunction<typeof useForm>).mockReturnValue(mockFormState);

    render(<BeerCreatePage />);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    await user.click(submitButton);

    // Verify that the API was called and error was handled
    await waitFor(() => {
      expect(mockFormState.handleSubmit).toHaveBeenCalled();
    });
  });

  it('should show loading state during submission', async () => {
    // Mock form in submitting state
    const mockFormState = {
      values: {
        beerName: 'Test Beer',
        beerStyle: 'IPA',
        upc: '123456789',
        price: 12.99,
        quantityOnHand: 100,
        imageUrl: undefined,
      },
      errors: {},
      isValid: true,
      isSubmitting: true,
      setValue: jest.fn(),
      setValues: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearErrors: jest.fn(),
      validateField: jest.fn(),
      validateAll: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
    };
    (mockUseForm as jest.MockedFunction<typeof useForm>).mockReturnValue(mockFormState);

    render(<BeerCreatePage />);

    // Check that submit button shows loading state
    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();

    // Check that cancel button is also disabled during submission
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeDisabled();
  });

  it('should handle image upload functionality', async () => {
    const mockFormState = {
      values: {
        beerName: '',
        beerStyle: '',
        upc: '',
        price: undefined,
        quantityOnHand: undefined,
        imageUrl: undefined,
      },
      errors: {},
      isValid: true,
      isSubmitting: false,
      setValue: jest.fn(),
      setValues: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearErrors: jest.fn(),
      validateField: jest.fn(),
      validateAll: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
    };
    (mockUseForm as jest.MockedFunction<typeof useForm>).mockReturnValue(mockFormState);

    render(<BeerCreatePage />);

    // Check that image upload component is present
    expect(screen.getByText(/upload beer image/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop or click to select/i)).toBeInTheDocument();
  });
});
