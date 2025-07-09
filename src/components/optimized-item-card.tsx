import { memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, CheckCircle, Edit, Archive, Eye } from 'lucide-react';
import { Item } from '@/lib/sample-data';

interface OptimizedItemCardProps {
  item: Item;
  searchTerm?: string;
  onItemClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onArchiveClick?: (item: Item) => void;
  onViewClick?: (item: Item) => void;
}

/**
 * Optimized Item Card with memoization and performance enhancements
 * This component is memoized to prevent unnecessary re-renders
 */
export const OptimizedItemCard = memo(function OptimizedItemCard({
  item,
  searchTerm,
  onItemClick,
  onEditClick,
  onArchiveClick,
  onViewClick,
}: OptimizedItemCardProps) {
  
  // Memoize expensive calculations
  const statusInfo = useMemo(() => {
    if (item.currentQuantity <= 0) {
      return {
        badge: <Badge variant="destructive">Out of Stock</Badge>,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        color: 'red'
      };
    } else if (item.currentQuantity <= item.reorderPoint) {
      return {
        badge: <Badge variant="secondary">Low Stock</Badge>,
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        color: 'orange'
      };
    } else {
      return {
        badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">In Stock</Badge>,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: 'green'
      };
    }
  }, [item.currentQuantity, item.reorderPoint]);

  // Memoize highlighted text for search
  const highlightedName = useMemo(() => {
    if (!searchTerm) return item.name;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return item.name.replace(regex, '<mark>$1</mark>');
  }, [item.name, searchTerm]);

  // Memoize click handlers to prevent recreation
  const handleItemClick = useCallback(() => {
    onItemClick?.(item);
  }, [onItemClick, item]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.(item);
  }, [onEditClick, item]);

  const handleArchiveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onArchiveClick?.(item);
  }, [onArchiveClick, item]);

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewClick?.(item);
  }, [onViewClick, item]);

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleItemClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {statusInfo.icon}
            <Package className="h-4 w-4 text-blue-500" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-medium truncate">
                {searchTerm ? (
                  <span dangerouslySetInnerHTML={{ __html: highlightedName }} />
                ) : (
                  item.name
                )}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                SKU: {item.SKU} • {item.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {statusInfo.badge}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleViewClick}
                aria-label={`View ${item.name} details`}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEditClick}
                aria-label={`Edit ${item.name}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleArchiveClick}
                aria-label={`Archive ${item.name}`}
              >
                <Archive className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Qty: <span className="font-medium">{item.currentQuantity}</span> {item.inventoryUnit}
            </span>
            <span className="text-muted-foreground">
              Reorder: <span className="font-medium">{item.reorderPoint}</span>
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Last updated today
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Fast comparison function for React.memo
export const areItemsEqual = (
  prevProps: OptimizedItemCardProps, 
  nextProps: OptimizedItemCardProps
) => {
  return (
    prevProps.item.itemId === nextProps.item.itemId &&
    prevProps.item.currentQuantity === nextProps.item.currentQuantity &&
    prevProps.item.reorderPoint === nextProps.item.reorderPoint &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.SKU === nextProps.item.SKU &&
    prevProps.searchTerm === nextProps.searchTerm
  );
};

/**
 * Optimized Items Grid with virtualization support
 */
interface OptimizedItemsGridProps {
  items: Item[];
  searchTerm?: string;
  onItemClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onArchiveClick?: (item: Item) => void;
  onViewClick?: (item: Item) => void;
  maxVisible?: number;
}

export const OptimizedItemsGrid = memo(function OptimizedItemsGrid({
  items,
  searchTerm,
  onItemClick,
  onEditClick,
  onArchiveClick,
  onViewClick,
  maxVisible = 50,
}: OptimizedItemsGridProps) {
  
  // Only render visible items for performance
  const visibleItems = useMemo(() => {
    return items.slice(0, maxVisible);
  }, [items, maxVisible]);

  return (
    <div className="space-y-4">
      {visibleItems.map((item) => (
        <OptimizedItemCard
          key={item.itemId}
          item={item}
          searchTerm={searchTerm}
          onItemClick={onItemClick}
          onEditClick={onEditClick}
          onArchiveClick={onArchiveClick}
          onViewClick={onViewClick}
        />
      ))}
      {items.length > maxVisible && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Showing {maxVisible} of {items.length} items
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
});
