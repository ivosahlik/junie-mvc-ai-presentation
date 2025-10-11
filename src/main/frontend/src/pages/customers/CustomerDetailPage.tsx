import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui';
import { useToast, useConfirmationDialog } from '../../hooks';
import customerService from '../../services/customerService';
import type { CustomerDto, BeerOrderDto } from '../../api';

/**
 * Customer Detail page component
 * Displays detailed information about a specific customer with tabs
 */
const CustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { confirmDelete } = useConfirmationDialog();

  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Load customer data
  const loadCustomer = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      const response = await customerService.getCustomerById(Number(customerId));
      setCustomer(response);
    } catch (err) {
      error('Failed to load customer details');
      console.error('Error loading customer:', err);
    } finally {
      setLoading(false);
    }
  }, [customerId, error]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  // Handle customer deletion
  const handleDeleteCustomer = async () => {
    if (!customer) return;

    confirmDelete(customer.name || 'this customer', async () => {
      try {
        await customerService.deleteCustomer(customer.id!);
        success(`Customer "${customer.name}" deleted successfully`);
        navigate('/customers');
      } catch (err) {
        error('Failed to delete customer');
        console.error('Error deleting customer:', err);
      }
    });
  };

  // Handle view all orders
  const handleViewOrders = () => {
    navigate(`/beer-orders?customerId=${customer?.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg">Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/customers')}
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/customers/${customerId}/edit`)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="rounded-md bg-red-500 px-4 py-2 text-white"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Customer ID: {customer?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer?.createdDate ? new Date(customer.createdDate).toLocaleString() : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer?.updateDate ? new Date(customer.updateDate).toLocaleString() : '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer?.addressLine1}
                  {customer?.addressLine2 && (
                    <span>
                      <br />
                      {customer.addressLine2}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.state}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer?.postalCode}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beer Orders</CardTitle>
          <CardDescription>Recent orders placed by this customer</CardDescription>
        </CardHeader>
        <CardContent>
          {customer?.beerOrders && customer.beerOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Order ID</th>
                    <th className="p-2 text-left font-medium">Date</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Amount</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer?.beerOrders?.map((order: BeerOrderDto) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">
                        {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2">${order.paymentAmount.toFixed(2)}</td>
                      <td className="p-2">
                        <button
                          onClick={() => navigate(`/beer-orders/${order.id}`)}
                          className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No orders found for this customer.</p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleViewOrders}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              View All Orders
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
