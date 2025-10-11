import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui';

// Local interfaces for form data
interface CustomerOption {
  id: number;
  name: string;
  email: string;
}

interface BeerOption {
  id: number;
  name: string;
  style: string;
  price: number;
  quantityOnHand: number;
}

interface LineItem {
  id: number;
  beerId: string | number;
  beerName: string;
  quantity: number;
  price: number;
}

/**
 * Beer Order Edit page component
 * Allows users to edit an existing beer order
 */
const BeerOrderEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [beers, setBeers] = useState<BeerOption[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerRef, setCustomerRef] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Simulate fetching order, customers, and beers data
  useEffect(() => {
    // In a real application, you would fetch the order, customers, and beers data from the API
    // For now, we'll use mock data
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    ];

    const mockBeers = [
      { id: 1, name: 'Mango Bobs', style: 'IPA', price: 12.99, quantityOnHand: 100 },
      { id: 2, name: 'Galaxy Cat', style: 'PALE_ALE', price: 11.99, quantityOnHand: 75 },
      { id: 3, name: 'Pinball Porter', style: 'PORTER', price: 13.99, quantityOnHand: 50 },
      { id: 4, name: 'Pumpkin Ale', style: 'ALE', price: 10.99, quantityOnHand: 120 },
    ];

    // Mock order data
    const mockOrder = {
      id: Number(orderId),
      customerId: 1,
      customerRef: 'CUST-1-1234',
      status: 'NEW',
      lineItems: [
        { id: 1, beerId: 1, beerName: 'Mango Bobs', quantity: 2, price: 12.99 },
        { id: 2, beerId: 3, beerName: 'Pinball Porter', quantity: 1, price: 13.99 },
      ],
    };

    // Simulate API call delay
    const timer = setTimeout(() => {
      setCustomers(mockCustomers);
      setBeers(mockBeers);
      setSelectedCustomerId(mockOrder.customerId.toString());
      setCustomerRef(mockOrder.customerRef);
      setOrderStatus(mockOrder.status);
      setLineItems(mockOrder.lineItems);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [orderId]);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);

    // In a real app, you might want to update the customer reference when changing customers
    // For this example, we'll keep the existing reference
  };

  const handleBeerChange = (beerId: string, index: number) => {
    const beer = beers.find(b => b.id.toString() === beerId);

    if (beer) {
      const updatedLineItems = [...lineItems];
      updatedLineItems[index] = {
        ...updatedLineItems[index],
        beerId: beer.id,
        beerName: beer.name,
        price: beer.price,
      };
      setLineItems(updatedLineItems);
    }
  };

  const handleQuantityChange = (quantity: string, index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      quantity: parseInt(quantity) || 0,
    };
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), beerId: '', beerName: '', quantity: 1, price: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      const updatedLineItems = lineItems.filter((_, i) => i !== index);
      setLineItems(updatedLineItems);
    }
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId || lineItems.some(item => !item.beerId)) {
      alert('Please select a customer and beer for each line item');
      return;
    }

    setSubmitting(true);

    // In a real application, you would submit the updated order data to the API
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setSubmitting(false);
      navigate(`/beer-orders/${orderId}`);
    }, 1000);
  };

  const handleCancel = () => {
    navigate(`/beer-orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg">Loading order data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Beer Order #{orderId}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomerId} onValueChange={handleCustomerChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerRef">Customer Reference</Label>
                <Input
                  id="customerRef"
                  value={customerRef}
                  onChange={e => setCustomerRef(e.target.value)}
                  placeholder="Customer reference"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="grid gap-4 rounded-md border p-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor={`beer-${index}`}>Beer</Label>
                    <Select
                      value={item.beerId.toString()}
                      onValueChange={value => handleBeerChange(value, index)}
                      required
                    >
                      <SelectTrigger id={`beer-${index}`}>
                        <SelectValue placeholder="Select a beer" />
                      </SelectTrigger>
                      <SelectContent>
                        {beers.map(beer => (
                          <SelectItem key={beer.id} value={beer.id.toString()}>
                            {beer.name} ({beer.style})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(e.target.value, index)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtotal</Label>
                    <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  {lineItems.length > 1 && (
                    <div className="flex items-end md:col-span-4">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="rounded-md bg-red-500 px-3 py-2 text-sm text-white"
                      >
                        Remove Item
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={addLineItem}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  Add Item
                </button>
                <div className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            disabled={submitting}
          >
            {submitting ? 'Updating Order...' : 'Update Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeerOrderEditPage;
