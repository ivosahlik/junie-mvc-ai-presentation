import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import {
  FormWrapper,
  FormField,
  FormActions,
  CurrencyInput,
  NumberInput,
  SelectInput,
} from '@components/forms';
import { Input, Button } from '@components/ui';
import { LoadingSpinner } from '@components/dialogs';
import { useForm, useToast } from '../../hooks';
import { beerValidationRules } from '../../utils/validation';
import beerService from '../../services/beerService';
import type { BeerDto } from '../../api';

interface BeerFormData extends Record<string, unknown> {
  beerName: string;
  beerStyle: string;
  upc: string;
  price: number | undefined;
  quantityOnHand: number | undefined;
}

/**
 * Beer Edit page component
 * Allows users to edit an existing beer with validation and error handling
 */
const BeerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { beerId } = useParams<{ beerId: string }>();
  const { success, error } = useToast();
  const [initialLoading, setInitialLoading] = useState(true);
  const [beer, setBeer] = useState<BeerDto | null>(null);

  const initialValues: BeerFormData = {
    beerName: '',
    beerStyle: '',
    upc: '',
    price: undefined,
    quantityOnHand: undefined,
  };

  const { values, errors, isValid, isSubmitting, setValue, setValues, handleSubmit } = useForm({
    initialValues,
    validationRules: {
      beerName: beerValidationRules.beerName,
      beerStyle: beerValidationRules.beerStyle,
      price: beerValidationRules.price,
      quantityOnHand: beerValidationRules.quantityOnHand,
    },
    onSubmit: async (formData: BeerFormData) => {
      if (!beer) return;

      try {
        const beerData: Omit<BeerDto, 'id' | 'version' | 'createdDate' | 'updateDate'> = {
          beerName: formData.beerName,
          beerStyle: formData.beerStyle,
          upc: formData.upc || '',
          price: formData.price || 0,
          quantityOnHand: formData.quantityOnHand || 0,
          description: beer?.description,
        };

        const updatedBeer = await beerService.updateBeer(beer.id!, beerData);

        // Optimistic update - update local state immediately
        setBeer(updatedBeer);

        success(`Beer "${updatedBeer.beerName}" updated successfully`);
        navigate(`/beers/${updatedBeer.id}`);
      } catch (err) {
        error('Failed to update beer. Please try again.');
        console.error('Error updating beer:', err);
      }
    },
  });

  // Load beer data on component mount
  useEffect(() => {
    const loadBeer = async () => {
      if (!beerId) {
        error('Beer ID is required');
        navigate('/beers');
        return;
      }

      setInitialLoading(true);
      try {
        const beerData = await beerService.getBeerById(Number(beerId));
        setBeer(beerData);

        // Pre-populate form with existing beer data
        setValues({
          beerName: beerData.beerName || '',
          beerStyle: beerData.beerStyle || '',
          upc: beerData.upc || '',
          price: beerData.price,
          quantityOnHand: beerData.quantityOnHand,
        });
      } catch (err) {
        error('Failed to load beer data');
        console.error('Error loading beer:', err);
        navigate('/beers');
      } finally {
        setInitialLoading(false);
      }
    };

    loadBeer();
  }, [beerId, navigate, error, setValues]);

  const handleCancel = () => {
    navigate(`/beers/${beerId}`);
  };

  // Beer style options
  const beerStyleOptions = [
    { value: 'IPA', label: 'IPA' },
    { value: 'Lager', label: 'Lager' },
    { value: 'Stout', label: 'Stout' },
    { value: 'Porter', label: 'Porter' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Pilsner', label: 'Pilsner' },
    { value: 'Ale', label: 'Ale' },
    { value: 'Pale Ale', label: 'Pale Ale' },
  ];

  if (initialLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" message="Loading beer data..." centered />
      </PageContainer>
    );
  }

  if (!beer) {
    return (
      <PageContainer>
        <PageContent>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900">Beer not found</h2>
            <p className="text-gray-600 mt-2">The beer you're trying to edit doesn't exist.</p>
            <Button onClick={() => navigate('/beers')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Beers
            </Button>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Beer"
        subtitle={`Update "${beer.beerName}" information`}
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        }
      />

      <PageContent>
        <FormWrapper onSubmit={handleSubmit} isLoading={isSubmitting}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Beer Name */}
            <FormField label="Beer Name" required error={errors.beerName?.[0]} htmlFor="beerName">
              <Input
                id="beerName"
                placeholder="Enter beer name"
                value={values.beerName}
                onChange={e => setValue('beerName', e.target.value)}
              />
            </FormField>

            {/* Beer Style */}
            <FormField
              label="Beer Style"
              required
              error={errors.beerStyle?.[0]}
              htmlFor="beerStyle"
            >
              <SelectInput
                value={values.beerStyle}
                onChange={value => setValue('beerStyle', value)}
                options={beerStyleOptions}
                placeholder="Select a beer style"
              />
            </FormField>

            {/* UPC */}
            <FormField label="UPC" helpText="Universal Product Code (optional)" htmlFor="upc">
              <Input
                id="upc"
                placeholder="Enter UPC"
                value={values.upc}
                onChange={e => setValue('upc', e.target.value)}
              />
            </FormField>

            {/* Price */}
            <FormField label="Price" required error={errors.price?.[0]} htmlFor="price">
              <CurrencyInput
                id="price"
                value={values.price}
                onChange={value => setValue('price', value)}
                placeholder="0.00"
                min={0}
              />
            </FormField>

            {/* Quantity on Hand */}
            <FormField
              label="Quantity on Hand"
              helpText="Current inventory count"
              error={errors.quantityOnHand?.[0]}
              htmlFor="quantityOnHand"
            >
              <NumberInput
                id="quantityOnHand"
                value={values.quantityOnHand}
                onChange={value => setValue('quantityOnHand', value)}
                placeholder="0"
                min={0}
                allowDecimals={false}
                allowNegative={false}
              />
            </FormField>
          </div>

          <FormActions
            submitLabel="Update Beer"
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

export default BeerEditPage;
