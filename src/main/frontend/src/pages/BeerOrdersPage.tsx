import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';

/**
 * Beer Orders page component
 * Displays a list of beer orders and provides functionality to manage them
 */
const BeerOrdersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beer Order Management</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Create New Order
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beer Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Order ID</th>
                  <th className="p-2 text-left font-medium">Customer</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Status</th>
                  <th className="p-2 text-left font-medium">Total</th>
                  <th className="p-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">1</td>
                  <td className="p-2">John Doe</td>
                  <td className="p-2">2023-01-01</td>
                  <td className="p-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      COMPLETE
                    </span>
                  </td>
                  <td className="p-2">$129.99</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        View
                      </button>
                      <button className="rounded-md bg-purple-500 px-2 py-1 text-xs text-white">
                        Shipments
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">2</td>
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">2023-01-02</td>
                  <td className="p-2">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      NEW
                    </span>
                  </td>
                  <td className="p-2">$59.95</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        View
                      </button>
                      <button className="rounded-md bg-orange-500 px-2 py-1 text-xs text-white">
                        Process
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeerOrdersPage;
