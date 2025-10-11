import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';

/**
 * Customers page component
 * Displays a list of customers and provides functionality to manage them
 */
const CustomersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Add New Customer
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Name</th>
                  <th className="p-2 text-left font-medium">Email</th>
                  <th className="p-2 text-left font-medium">Phone</th>
                  <th className="p-2 text-left font-medium">City</th>
                  <th className="p-2 text-left font-medium">State</th>
                  <th className="p-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">John Doe</td>
                  <td className="p-2">john.doe@example.com</td>
                  <td className="p-2">555-123-4567</td>
                  <td className="p-2">Springfield</td>
                  <td className="p-2">IL</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        Edit
                      </button>
                      <button className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">
                        Delete
                      </button>
                      <button className="rounded-md bg-green-500 px-2 py-1 text-xs text-white">
                        Orders
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">jane.smith@example.com</td>
                  <td className="p-2">555-987-6543</td>
                  <td className="p-2">Shelbyville</td>
                  <td className="p-2">IL</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        Edit
                      </button>
                      <button className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">
                        Delete
                      </button>
                      <button className="rounded-md bg-green-500 px-2 py-1 text-xs text-white">
                        Orders
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

export default CustomersPage;
