import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Package, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import { TabNavigation } from '@components/navigation';
import { LoadingSpinner } from '@components/dialogs';
import { Button } from '@components/ui';
import { useToast, useConfirmationDialog, useTabs } from '../../hooks';
import beerService from '../../services/beerService';
import type { BeerDto } from '../../api';
import type { Tab } from '@components/navigation';

/**
 * Beer Detail page component
 * Displays detailed information about a specific beer with tabs
 */
const BeerDetailPage: React.FC = () => {
  const { beerId } = useParams<{ beerId: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { confirmDelete } = useConfirmationDialog();

  const [beer, setBeer] = useState<BeerDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab management
  const tabIds = ['details', 'inventory', 'history'];
  const { activeTab, changeTab } = useTabs(tabIds);

  // Load beer data
  const loadBeer = useCallback(async () => {
    if (!beerId) return;

    setLoading(true);
    try {
      const response = await beerService.getBeerById(Number(beerId));
      setBeer(response);
    } catch (err) {
      error('Failed to load beer details');
      console.error('Error loading beer:', err);
    } finally {
      setLoading(false);
    }
  }, [beerId, error]);

  useEffect(() => {
    loadBeer();
  }, [loadBeer]);

  // Handle beer deletion
  const handleDeleteBeer = async () => {
    if (!beer) return;

    confirmDelete(beer.beerName || 'this beer', async () => {
      try {
        await beerService.deleteBeer(beer.id!);
        success(`Beer "${beer.beerName}" deleted successfully`);
        navigate('/beers');
      } catch (err) {
        error('Failed to delete beer');
        console.error('Error deleting beer:', err);
      }
    });
  };

  // Render beer details tab
  const renderDetailsTab = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Basic Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Beer Name:</span>
            <span className="font-semibold">{beer?.beerName || '-'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Style:</span>
            <span>{beer?.beerStyle || '-'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">UPC:</span>
            <span className="font-mono text-sm">{beer?.upc || '-'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Version:</span>
            <span>{beer?.version || '-'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing & Inventory
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Price:</span>
            <span className="font-semibold text-green-600">
              {beer?.price ? `$${Number(beer.price).toFixed(2)}` : '-'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-gray-600">Quantity on Hand:</span>
            <span className="font-semibold">{beer?.quantityOnHand?.toLocaleString() || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render inventory tab
  const renderInventoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Inventory Management
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {beer?.quantityOnHand?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-blue-600">Units in Stock</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {beer?.price
              ? `$${(Number(beer.price) * (beer.quantityOnHand || 0)).toFixed(2)}`
              : '$0.00'}
          </div>
          <div className="text-sm text-green-600">Total Value</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {beer?.quantityOnHand && beer.quantityOnHand < 50 ? 'Low' : 'Good'}
          </div>
          <div className="text-sm text-yellow-600">Stock Status</div>
        </div>
      </div>
    </div>
  );

  // Render history tab
  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Beer History
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium text-gray-600">Created Date:</span>
          <span>{beer?.createdDate ? new Date(beer.createdDate).toLocaleString() : '-'}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium text-gray-600">Last Updated:</span>
          <span>{beer?.updateDate ? new Date(beer.updateDate).toLocaleString() : '-'}</span>
        </div>
      </div>
    </div>
  );

  // Define tabs
  const tabs: Tab[] = [
    {
      id: 'details',
      label: 'Details',
      icon: Package,
      content: renderDetailsTab(),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: BarChart3,
      content: renderInventoryTab(),
    },
    {
      id: 'history',
      label: 'History',
      icon: Calendar,
      content: renderHistoryTab(),
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" message="Loading beer details..." centered />
      </PageContainer>
    );
  }

  if (!beer) {
    return (
      <PageContainer>
        <PageContent>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900">Beer not found</h2>
            <p className="text-gray-600 mt-2">The beer you're looking for doesn't exist.</p>
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
        title={beer.beerName || 'Beer Details'}
        subtitle={`${beer.beerStyle || 'Unknown Style'} • ID: ${beer.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/beers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => navigate(`/beers/${beer.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDeleteBeer}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <PageContent>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={changeTab}
          variant="underline"
        />
      </PageContent>
    </PageContainer>
  );
};

export default BeerDetailPage;
