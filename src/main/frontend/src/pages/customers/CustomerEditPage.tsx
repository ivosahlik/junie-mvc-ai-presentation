import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import { FormWrapper, FormField, FormActions } from '@components/forms';
import { Input, Button } from '@components/ui';
import { LoadingSpinner } from '@components/dialogs';
import { useForm, useToast } from '../../hooks';
import { customerValidationRules } from '../../utils/validation';
import customerService from '../../services/customerService';
import type { CustomerDto } from '../../types/customer';

interface CustomerFormData extends Record<string, unknown> {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

/**
 * Customer Edit page component
 * Allows users to edit an existing customer with validation and error handling
 */
const CustomerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { success, error } = useToast();
  const [initialLoading, setInitialLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerDto | null>(null);

  const initialValues: CustomerFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  };

  const { values, errors, isValid, isSubmitting, setValue, setValues, handleSubmit } = useForm({
    initialValues,
    validationRules: {
      name: customerValidationRules.customerName,
      email: customerValidationRules.email,
    },
    onSubmit: async (formData: CustomerFormData) => {
      if (!customer) return;

      try {
        const customerData: Omit<CustomerDto, 'id' | 'version' | 'createdDate' | 'updateDate'> = {
          name: formData.name,
          email: formData.email || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          beerOrders: customer.beerOrders, // Include existing beer orders
        };

        const updatedCustomer = await customerService.updateCustomer(customer.id!, customerData);

        // Optimistic update - update local state immediately
        setCustomer(updatedCustomer);

        success(`Customer "${updatedCustomer.name}" updated successfully`);
        navigate(`/customers/${updatedCustomer.id}`);
      } catch (err) {
        error('Failed to update customer. Please try again.');
        console.error('Error updating customer:', err);
      }
    },
  });

  // Load customer data on component mount
  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) {
        error('Customer ID is required');
        navigate('/customers');
        return;
      }

      setInitialLoading(true);
      try {
        const customerData = await customerService.getCustomerById(Number(customerId));
        setCustomer(customerData);

        // Pre-populate form with existing customer data
        setValues({
          name: customerData.name || '',
          email: customerData.email || '',
          phoneNumber: customerData.phoneNumber || '',
          addressLine1: customerData.addressLine1 || '',
          addressLine2: customerData.addressLine2 || '',
          city: customerData.city || '',
          state: customerData.state || '',
          postalCode: customerData.postalCode || '',
        });
      } catch (err) {
        error('Failed to load customer data');
        console.error('Error loading customer:', err);
        navigate('/customers');
      } finally {
        setInitialLoading(false);
      }
    };

    loadCustomer();
  }, [customerId, navigate, error, setValues]);

  const handleCancel = () => {
    navigate(`/customers/${customerId}`);
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" message="Loading customer data..." centered />
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <PageContent>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
            <p className="text-gray-600 mt-2">The customer you're trying to edit doesn't exist.</p>
            <Button onClick={() => navigate('/customers')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Customer"
        subtitle={`Update "${customer.name}" information`}
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        }
      />

      <PageContent>
        <FormWrapper onSubmit={handleSubmit} isLoading={isSubmitting}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  label="Customer Name"
                  required
                  error={errors.name?.[0]}
                  htmlFor="customerName"
                >
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={values.name}
                    onChange={e => setValue('name', e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Email"
                  error={errors.email?.[0]}
                  htmlFor="email"
                  helpText="Optional email address"
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={values.email}
                    onChange={e => setValue('email', e.target.value)}
                  />
                </FormField>

                <FormField label="Phone" htmlFor="phone" helpText="Optional phone number">
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={values.phoneNumber}
                    onChange={e => setValue('phoneNumber', e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Address Line 1" htmlFor="addressLine1" helpText="Street address">
                  <Input
                    id="addressLine1"
                    placeholder="Enter street address"
                    value={values.addressLine1}
                    onChange={e => setValue('addressLine1', e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Address Line 2"
                  htmlFor="addressLine2"
                  helpText="Apartment, suite, etc. (optional)"
                >
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc."
                    value={values.addressLine2}
                    onChange={e => setValue('addressLine2', e.target.value)}
                  />
                </FormField>

                <FormField label="City" htmlFor="city">
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={values.city}
                    onChange={e => setValue('city', e.target.value)}
                  />
                </FormField>

                <FormField label="State" htmlFor="state">
                  <Input
                    id="state"
                    placeholder="Enter state"
                    value={values.state}
                    onChange={e => setValue('state', e.target.value)}
                  />
                </FormField>

                <FormField label="Postal Code" htmlFor="postalCode">
                  <Input
                    id="postalCode"
                    placeholder="Enter postal code"
                    value={values.postalCode}
                    onChange={e => setValue('postalCode', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          <FormActions
            submitLabel="Update Customer"
            cancelLabel="Cancel"
            onCancel={handleCancel}
            isLoading={isSubmitting}
            submitDisabled={!isValid}
          />
        </FormWrapper>
      </PageContent>
    </PageContainer>
  );
};

export default CustomerEditPage;
