import type { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Page content component that provides consistent content area styling
 * Includes configurable padding and background
 */
const PageContent = ({ children, className = '', padding = 'md' }: PageContentProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default PageContent;
