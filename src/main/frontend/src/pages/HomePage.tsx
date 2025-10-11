import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui';

/**
 * Home page component
 * Displays a welcome message and overview of the application
 */
const HomePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Beer Service</h1>
      <p className="text-muted-foreground">
        Manage your beer inventory, customers, and orders with ease.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Beer Management</CardTitle>
            <CardDescription>Manage your beer inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View, create, update, and delete beers in your inventory.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>Manage your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View, create, update, and delete customer information.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beer Order Management</CardTitle>
            <CardDescription>Manage beer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View, create, update, and track beer orders and shipments.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
