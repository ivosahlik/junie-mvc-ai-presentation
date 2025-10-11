import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import { FormWrapper, FormField, FormActions } from '@components/forms';
import { Input } from '@components/ui';
import { Button } from '@components/ui';
import { useForm, useToast } from '../../hooks';
import { validationRules } from '../../utils/validation';
import beerOrderService from '../../services/beerOrderService';
import type { BeerOrderShipmentDto } from '../../types/beerOrder';

interface ShipmentFormData extends Record<string, unknown> {
  shipmentDate: string;
  carrier: string;
  trackingNumber: string;
}

/**
 * Beer Order Shipment Create page component
 * Allows users to create a new shipment for a beer order
 */
const BeerOrderShipmentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { success, error } = useToast();

  const initialValues: ShipmentFormData = {
    shipmentDate: new Date().toISOString().slice(0, 16), // Current date/time in YYYY-MM-DDTHH:MM format
    carrier: '',
    trackingNumber: '',
  };

  const { values, errors, isValid, isSubmitting, setValue, handleSubmit } = useForm({
    initialValues,
    validationRules: {
      shipmentDate: [validationRules.required('Shipment date is required')],
      carrier: [
        validationRules.required('Carrier is required'),
        validationRules.minLength(2, 'Carrier must be at least 2 characters'),
      ],
      trackingNumber: [
        validationRules.required('Tracking number is required'),
        validationRules.minLength(3, 'Tracking number must be at least 3 characters'),
      ],
    },
    onSubmit: async (formData: ShipmentFormData) => {
      if (!orderId) {
        error('Order ID is missing');
        return;
      }

      try {
        const shipmentData: Omit<
          BeerOrderShipmentDto,
          'id' | 'version' | 'createdDate' | 'updateDate'
        > = {
          shipmentDate: formData.shipmentDate,
          carrier: formData.carrier,
          trackingNumber: formData.trackingNumber,
        };

        await beerOrderService.createBeerOrderShipment(parseInt(orderId), shipmentData);
        success('Shipment created successfully');
        navigate(`/beer-orders/${orderId}`);
      } catch (err) {
        error('Failed to create shipment. Please try again.');
        console.error('Error creating shipment:', err);
      }
    },
  });

  const handleCancel = () => {
    navigate(`/beer-orders/${orderId}`);
  };

  // Common carrier options
  const carrierOptions = ['FedEx', 'UPS', 'USPS', 'DHL', 'Amazon Logistics', 'OnTrac', 'Other'];

  return (
    <PageContainer>
      <PageHeader
        title={`Create Shipment for Order #${orderId}`}
        subtitle="Add a new shipment to track delivery"
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Button>
        }
      />

      <PageContent>
        <FormWrapper onSubmit={handleSubmit} isLoading={isSubmitting}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Shipment Date */}
            <FormField
              label="Shipment Date"
              required
              error={errors.shipmentDate?.[0]}
              htmlFor="shipmentDate"
            >
              <Input
                id="shipmentDate"
                type="datetime-local"
                value={values.shipmentDate}
                onChange={e => setValue('shipmentDate', e.target.value)}
              />
            </FormField>

            {/* Carrier */}
            <FormField label="Carrier" required error={errors.carrier?.[0]} htmlFor="carrier">
              <div className="space-y-2">
                <Input
                  id="carrier"
                  placeholder="Enter carrier name"
                  value={values.carrier}
                  onChange={e => setValue('carrier', e.target.value)}
                  list="carrier-options"
                />
                <datalist id="carrier-options">
                  {carrierOptions.map(carrier => (
                    <option key={carrier} value={carrier} />
                  ))}
                </datalist>
              </div>
            </FormField>

            {/* Tracking Number */}
            <FormField
              label="Tracking Number"
              required
              error={errors.trackingNumber?.[0]}
              htmlFor="trackingNumber"
              className="md:col-span-2"
            >
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={values.trackingNumber}
                onChange={e => setValue('trackingNumber', e.target.value)}
              />
            </FormField>
          </div>

          <FormActions
            submitLabel="Create Shipment"
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

export default BeerOrderShipmentCreatePage;
