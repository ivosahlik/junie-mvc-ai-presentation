import { Button } from '../ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Standalone pagination component
 * Provides navigation controls for paginated content
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 7,
  className = '',
  size = 'md',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-12 w-12 text-base';
      default:
        return 'h-10 w-10 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  // Calculate which page numbers to show
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    pages.push(1);

    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if we're near the beginning
    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const sizeClasses = getSizeClasses();
  const iconSize = getIconSize();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
      {/* First page button */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          className={sizeClasses}
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Go to first page"
        >
          <ChevronsLeft className={iconSize} />
        </Button>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          className={sizeClasses}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={iconSize} />
        </Button>
      )}

      {/* Page number buttons */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <div
              key={`ellipsis-${index}`}
              className={`flex items-center justify-center ${sizeClasses}`}
            >
              <MoreHorizontal className={iconSize} />
            </div>
          );
        }

        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={sizeClasses}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      {/* Next page button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          className={sizeClasses}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Go to next page"
        >
          <ChevronRight className={iconSize} />
        </Button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          className={sizeClasses}
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Go to last page"
        >
          <ChevronsRight className={iconSize} />
        </Button>
      )}
    </nav>
  );
};

export default Pagination;
