import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import {
  FormWrapper,
  FormField,
  FormActions,
  CurrencyInput,
  NumberInput,
  SelectInput,
  ImageUpload,
} from '@components/forms';
import { Input } from '@components/ui';
import { Button } from '@components/ui';
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
  imageUrl: string | undefined;
}

/**
 * Beer Create page component
 * Allows users to create a new beer with validation and error handling
 */
const BeerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const initialValues: BeerFormData = {
    beerName: '',
    beerStyle: '',
    upc: '',
    price: undefined,
    quantityOnHand: undefined,
    imageUrl: undefined,
  };

  const { values, errors, isValid, isSubmitting, setValue, handleSubmit } = useForm({
    initialValues,
    validationRules: {
      beerName: beerValidationRules.beerName,
      beerStyle: beerValidationRules.beerStyle,
      price: beerValidationRules.price,
      quantityOnHand: beerValidationRules.quantityOnHand,
    },
    onSubmit: async (formData: BeerFormData) => {
      try {
        const beerData: Omit<BeerDto, 'id' | 'version' | 'createdDate' | 'updateDate'> = {
          beerName: formData.beerName,
          beerStyle: formData.beerStyle,
          upc: formData.upc || '',
          price: formData.price || 0,
          quantityOnHand: formData.quantityOnHand || 0,
          description: undefined,
        };

        const createdBeer = await beerService.createBeer(beerData);
        success(`Beer "${createdBeer.beerName}" created successfully`);
        navigate(`/beers/${createdBeer.id}`);
      } catch (err) {
        error('Failed to create beer. Please try again.');
        console.error('Error creating beer:', err);
      }
    },
  });

  const handleCancel = () => {
    navigate('/beers');
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

  return (
    <PageContainer>
      <PageHeader
        title="Create New Beer"
        subtitle="Add a new beer to your inventory"
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Beers
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

          {/* Beer Image */}
          <FormField
            label="Beer Image"
            helpText="Upload an image for this beer (optional)"
            htmlFor="imageUrl"
          >
            <ImageUpload
              value={values.imageUrl}
              onChange={value => setValue('imageUrl', value)}
              placeholder="Upload beer image"
            />
          </FormField>

          <FormActions
            submitLabel="Create Beer"
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

export default BeerCreatePage;
