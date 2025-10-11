import type { ReactNode } from 'react';
import Breadcrumb from '../navigation/Breadcrumb';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showBreadcrumb?: boolean;
}

/**
 * Page container component that provides consistent layout for pages
 * Includes optional breadcrumb navigation and consistent spacing
 */
const PageContainer = ({ children, className = '', showBreadcrumb = true }: PageContainerProps) => {
  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {showBreadcrumb && <Breadcrumb />}
      {children}
    </div>
  );
};

export default PageContainer;
