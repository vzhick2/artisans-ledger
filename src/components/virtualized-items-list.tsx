'use client';

import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { useVirtualScroll } from '@/hooks/use-performance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, AlertTriangle, CheckCircle, Edit, Archive, Eye } from 'lucide-react';
import { Item } from '@/lib/sample-data';

interface VirtualizedItemsListProps {
  items: Item[];
  searchTerm?: string;
  typeFilter?: string;
  statusFilter?: string;
  onItemClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onArchiveClick?: (item: Item) => void;
  onViewClick?: (item: Item) => void;
}

const ITEM_HEIGHT = 120; // Height of each item card in pixels
const CONTAINER_HEIGHT = 600; // Max height of the container

export function VirtualizedItemsList({
  items,
  searchTerm = '',
  typeFilter = 'all',
  statusFilter = 'all',
  onItemClick,
  onEditClick,
  onArchiveClick,
  onViewClick,
}: VirtualizedItemsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(CONTAINER_HEIGHT);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.SKU.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in-stock' && item.currentQuantity > item.reorderPoint) ||
        (statusFilter === 'low-stock' && item.currentQuantity <= item.reorderPoint && item.currentQuantity > 0) ||
        (statusFilter === 'out-of-stock' && item.currentQuantity <= 0);

      return matchesSearch && matchesType && matchesStatus && !item.isArchived;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);

  // Set up virtual scrolling
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  } = useVirtualScroll({
    items: filteredItems,
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: 3,
  });

  // Update container height based on actual container size
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerHeight(Math.min(entry.contentRect.height, CONTAINER_HEIGHT));
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
    return undefined;
  }, []);

  // Memoized item renderers
  const getStatusBadge = useCallback((item: Item) => {
    if (item.currentQuantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.currentQuantity <= item.reorderPoint) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">In Stock</Badge>;
    }
  }, []);

  const getStatusIcon = useCallback((item: Item) => {
    if (item.currentQuantity <= 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else if (item.currentQuantity <= item.reorderPoint) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  }, []);

  const getTypeIcon = useCallback((_type: string) => {
    return <Package className="h-4 w-4 text-blue-500" />;
  }, []);

  // Render individual item
  const renderItem = useCallback((item: Item, _index: number) => {
    return (
      <Card
        key={item.itemId}
        className="flex-shrink-0 hover:shadow-md transition-shadow cursor-pointer"
        style={{
          height: `${ITEM_HEIGHT - 8}px`, // Account for margins
          marginBottom: '8px',
        }}
        onClick={() => onItemClick?.(item)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {getStatusIcon(item)}
              {getTypeIcon(item.type)}
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
              {getStatusBadge(item)}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewClick?.(item);
                  }}
                  aria-label={`View ${item.name} details`}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.(item);
                  }}
                  aria-label={`Edit ${item.name}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveClick?.(item);
                  }}
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
                ${(item as any).averageCost ? (item as any).averageCost.toFixed(2) : '0.00'} avg cost
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [getStatusBadge, getStatusIcon, getTypeIcon, onItemClick, onEditClick, onArchiveClick, onViewClick]);

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No items found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {visibleItems.length} of {filteredItems.length} items
        </span>
        <span>
          Items {startIndex + 1}-{Math.min(endIndex + 1, filteredItems.length)} of {filteredItems.length}
        </span>
      </div>

      {/* Virtualized List Container */}
      <div
        ref={containerRef}
        className="relative overflow-auto border rounded-lg"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        {/* Total height container */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* Visible items container */}
          <div
            style={{
              position: 'absolute',
              top: `${offsetY}px`,
              left: 0,
              right: 0,
            }}
          >
            <div className="p-4 space-y-2">
              {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading state for better UX */}
      {visibleItems.length === 0 && filteredItems.length > 0 && (
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <div className="ml-auto">
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
