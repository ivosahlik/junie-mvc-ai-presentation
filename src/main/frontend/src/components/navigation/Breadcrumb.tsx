import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on the current route
 */
const Breadcrumb: React.FC = () => {
  const location = useLocation();

  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/',
    });

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Generate human-readable labels
      let label = segment;
      switch (segment) {
        case 'beers':
          label = 'Beers';
          break;
        case 'customers':
          label = 'Customers';
          break;
        case 'beer-orders':
          label = 'Beer Orders';
          break;
        case 'new':
          label = 'New';
          break;
        case 'edit':
          label = 'Edit';
          break;
        default:
          // For IDs, check if it's a number and show as ID
          if (/^\d+$/.test(segment)) {
            // Determine the type based on the previous segment
            const prevSegment = pathSegments[index - 1];
            if (prevSegment === 'beers') {
              label = `Beer #${segment}`;
            } else if (prevSegment === 'customers') {
              label = `Customer #${segment}`;
            } else if (prevSegment === 'beer-orders') {
              label = `Order #${segment}`;
            } else {
              label = `#${segment}`;
            }
          } else {
            // Capitalize first letter for other segments
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
          break;
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}

          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900">
              {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-gray-900 transition-colors flex items-center"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
