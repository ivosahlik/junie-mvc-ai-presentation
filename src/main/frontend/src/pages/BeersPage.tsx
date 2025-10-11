import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';

/**
 * Beers page component
 * Displays a list of beers and provides functionality to manage them
 */
const BeersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beer Management</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Add New Beer
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beer Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Name</th>
                  <th className="p-2 text-left font-medium">Style</th>
                  <th className="p-2 text-left font-medium">UPC</th>
                  <th className="p-2 text-left font-medium">Price</th>
                  <th className="p-2 text-left font-medium">Quantity</th>
                  <th className="p-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Mango Bobs</td>
                  <td className="p-2">IPA</td>
                  <td className="p-2">0631234200036</td>
                  <td className="p-2">$12.99</td>
                  <td className="p-2">100</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        Edit
                      </button>
                      <button className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Galaxy Cat</td>
                  <td className="p-2">PALE_ALE</td>
                  <td className="p-2">0631234300019</td>
                  <td className="p-2">$11.99</td>
                  <td className="p-2">75</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                        Edit
                      </button>
                      <button className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">
                        Delete
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

export default BeersPage;
