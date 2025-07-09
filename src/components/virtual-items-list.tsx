'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '@/lib/sample-data';
import { AlertTriangle, Archive, CheckCircle, Edit, Eye, Package } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface VirtualScrollProps {
  items: Item[];
  itemHeight: number;
  containerHeight: number;
  onItemClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onArchiveClick?: (item: Item) => void;
  onViewClick?: (item: Item) => void;
}

// Virtual scrolling hook for performance with large lists
function useVirtualScroll({
  items,
  itemHeight,
  containerHeight,
}: {
  items: Item[];
  itemHeight: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5); // 5 item buffer
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 5
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
}

// Optimized Item Card component
const VirtualItemCard = ({ 
  item, 
  onEdit, 
  onArchive, 
  onView,
  onClick 
}: {
  item: Item;
  onEdit?: (item: Item) => void;
  onArchive?: (item: Item) => void;
  onView?: (item: Item) => void;
  onClick?: (item: Item) => void;
}) => {
  // Memoized status calculations
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

  // Memoized event handlers
  const handleClick = useCallback(() => onClick?.(item), [onClick, item]);
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  }, [onEdit, item]);
  const handleArchive = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive?.(item);
  }, [onArchive, item]);
  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(item);
  }, [onView, item]);

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer mb-2"
      onClick={handleClick}
      style={{ minHeight: '100px' }} // Ensure consistent height
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {statusInfo.icon}
            <Package className="h-4 w-4 text-blue-500" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-medium truncate">
                {item.name}
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
                onClick={handleView}
                aria-label={`View ${item.name} details`}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                aria-label={`Edit ${item.name}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleArchive}
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
        </div>
      </CardContent>
    </Card>
  );
};

// Virtual scrolling container component
export default function VirtualItemsList({
  items,
  itemHeight = 120,
  containerHeight = 600,
  onItemClick,
  onEditClick,
  onArchiveClick,
  onViewClick,
}: VirtualScrollProps) {
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  } = useVirtualScroll({
    items,
    itemHeight,
    containerHeight,
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {visibleItems.length} of {items.length} items
        </span>
        <span>
          Items {startIndex + 1}-{Math.min(endIndex + 1, items.length)} of {items.length}
        </span>
      </div>

      {/* Virtual Scroll Container */}
      <div
        className="relative overflow-auto border rounded-lg"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        {/* Total height spacer */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* Visible items */}
          <div
            style={{
              position: 'absolute',
              top: `${offsetY}px`,
              left: 0,
              right: 0,
            }}
          >
            <div className="p-4">
              {visibleItems.map((item) => (
                <VirtualItemCard
                  key={item.itemId}
                  item={item}
                  onClick={onItemClick}
                  onEdit={onEditClick}
                  onArchive={onArchiveClick}
                  onView={onViewClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground">
          Virtual scroll active: Rendering {visibleItems.length} of {items.length} items
        </div>
      )}
    </div>
  );
}

// Export a simplified version for smaller lists
export function SimpleItemsList({
  items,
  onItemClick,
  onEditClick,
  onArchiveClick,
  onViewClick,
}: Omit<VirtualScrollProps, 'itemHeight' | 'containerHeight'>) {
  // Use virtual scrolling for large lists, simple rendering for small ones
  if (items.length > 50) {
    return (
      <VirtualItemsList
        items={items}
        itemHeight={120}
        containerHeight={600}
        onItemClick={onItemClick}
        onEditClick={onEditClick}
        onArchiveClick={onArchiveClick}
        onViewClick={onViewClick}
      />
    );
  }

  // Simple rendering for small lists
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Showing all {items.length} items
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <VirtualItemCard
            key={item.itemId}
            item={item}
            onClick={onItemClick}
            onEdit={onEditClick}
            onArchive={onArchiveClick}
            onView={onViewClick}
          />
        ))}
      </div>
    </div>
  );
}
