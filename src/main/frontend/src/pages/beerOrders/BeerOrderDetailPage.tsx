import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@components/ui';

// Local interfaces for order data
interface OrderLineItem {
  id: number;
  beerId: number;
  beerName: string;
  beerStyle: string;
  upc: string;
  orderQuantity: number;
  price: number;
}

interface OrderShipment {
  id: number;
  shipmentDate: string;
  carrier: string;
  trackingNumber: string;
}

interface OrderDetail {
  id: number;
  customerRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdDate: string;
  updateDate: string;
  status: string;
  paymentAmount: number;
  lineItems: OrderLineItem[];
  shipments: OrderShipment[];
}

/**
 * Beer Order Detail page component
 * Displays detailed information about a specific beer order
 */
const BeerOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Simulate fetching beer order data
  useEffect(() => {
    // In a real application, you would fetch the beer order data from the API
    // For now, we'll use mock data
    const mockOrder = {
      id: Number(orderId),
      customerRef: 'CUST-123',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '555-123-4567',
      createdDate: '2023-01-01T12:00:00Z',
      updateDate: '2023-01-02T14:30:00Z',
      status: 'COMPLETED',
      paymentAmount: 129.99,
      lineItems: [
        {
          id: 1,
          beerId: 1,
          beerName: 'Mango Bobs',
          beerStyle: 'IPA',
          upc: '0631234200036',
          orderQuantity: 2,
          price: 12.99,
        },
        {
          id: 2,
          beerId: 2,
          beerName: 'Galaxy Cat',
          beerStyle: 'PALE_ALE',
          upc: '0631234300019',
          orderQuantity: 3,
          price: 11.99,
        },
        {
          id: 3,
          beerId: 3,
          beerName: 'Pinball Porter',
          beerStyle: 'PORTER',
          upc: '0083783375213',
          orderQuantity: 4,
          price: 13.99,
        },
      ],
      shipments: [
        {
          id: 1,
          shipmentDate: '2023-01-03T10:00:00Z',
          carrier: 'FedEx',
          trackingNumber: '123456789',
        },
      ],
    };

    // Simulate API call delay
    const timer = setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [orderId]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToList = () => {
    navigate('/beer-orders');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <p className="text-lg">Order not found.</p>
        <button
          onClick={handleBackToList}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(order.createdDate).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBackToList}
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
          >
            Back to Orders
          </button>
          <button
            onClick={() => navigate(`/beer-orders/${orderId}/edit`)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Edit Order
          </button>
        </div>
      </div>

      <div className="rounded-md border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Status</h2>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Total Amount</h2>
            <p className="text-2xl font-bold">${order.paymentAmount.toFixed(2)}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Customer</h2>
            <p>{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerRef}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium">Customer Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Name:</span>
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Reference:</span>
                      <span>{order.customerRef}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Email:</span>
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Phone:</span>
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Order Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Order ID:</span>
                      <span>{order.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Created Date:</span>
                      <span>{new Date(order.createdDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Last Updated:</span>
                      <span>{new Date(order.updateDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Item</th>
                      <th className="p-2 text-left font-medium">Beer</th>
                      <th className="p-2 text-left font-medium">Style</th>
                      <th className="p-2 text-left font-medium">UPC</th>
                      <th className="p-2 text-left font-medium">Quantity</th>
                      <th className="p-2 text-left font-medium">Price</th>
                      <th className="p-2 text-left font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.lineItems.map((item: OrderLineItem) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.beerName}</td>
                        <td className="p-2">{item.beerStyle}</td>
                        <td className="p-2">{item.upc}</td>
                        <td className="p-2">{item.orderQuantity}</td>
                        <td className="p-2">${item.price.toFixed(2)}</td>
                        <td className="p-2">${(item.price * item.orderQuantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td colSpan={6} className="p-2 text-right">
                        Total:
                      </td>
                      <td className="p-2">${order.paymentAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipments.length > 0 ? (
                <div className="space-y-4">
                  {order.shipments.map((shipment: OrderShipment) => (
                    <div key={shipment.id} className="rounded-md border p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <h3 className="font-medium">Shipment ID</h3>
                          <p>{shipment.id}</p>
                        </div>
                        <div>
                          <h3 className="font-medium">Shipment Date</h3>
                          <p>{new Date(shipment.shipmentDate).toLocaleString()}</p>
                        </div>
                        <div>
                          <h3 className="font-medium">Carrier</h3>
                          <p>{shipment.carrier}</p>
                        </div>
                        <div>
                          <h3 className="font-medium">Tracking Number</h3>
                          <p>{shipment.trackingNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-lg text-muted-foreground">
                    No shipments found for this order.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => navigate(`/beer-orders/${orderId}/shipments/new`)}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  Add Shipment
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeerOrderDetailPage;
