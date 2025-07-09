'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Item, sampleItems } from '@/lib/sample-data';
import {
    AlertTriangle,
    Archive,
    CheckCircle,
    Edit,
    Eye,
    Package,
    Plus,
    Search
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

// Memoized components for better performance
const ItemCard = memo(({ item, onEdit, onArchive, onView }: {
  item: Item;
  onEdit: (item: Item) => void;
  onArchive: (item: Item) => void;
  onView: (item: Item) => void;
}) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {getStatusIcon(item)}
            <Package className="h-4 w-4 text-blue-500" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-medium truncate">{item.name}</CardTitle>
              <p className="text-xs text-muted-foreground">SKU: {item.SKU} • {item.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getStatusBadge(item)}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(item)}
                aria-label={`View ${item.name} details`}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.name}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onArchive(item)}
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
});

ItemCard.displayName = 'ItemCard';

export default function Items() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Handle URL query parameters
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  // Debounce search term to reduce filtering frequency
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // Memoize the filtered items to prevent unnecessary recalculations
  const filteredItems = useMemo(() => {
    return sampleItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.SKU.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in-stock' && item.currentQuantity > item.reorderPoint) ||
        (statusFilter === 'low-stock' && item.currentQuantity <= item.reorderPoint && item.currentQuantity > 0) ||
        (statusFilter === 'out-of-stock' && item.currentQuantity <= 0);

      return matchesSearch && matchesType && matchesStatus && !item.isArchived;
    });
  }, [debouncedSearchTerm, typeFilter, statusFilter]);

  // Memoize the badge and icon functions to prevent recreating them on every render
  const getStatusBadge = useCallback((item: Item) => {
    if (item.currentQuantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.currentQuantity <= item.reorderPoint) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">In Stock</Badge>;
    }
  }, []);

  const getStatusIcon = useCallback((item: Item) => {
    if (item.currentQuantity <= 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else if (item.currentQuantity <= item.reorderPoint) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Items</h1>
        <Button 
          onClick={() => router.push('/items/new')}
          aria-label="Add new item to inventory"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find items by name, SKU, or filter by type and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search items by name or SKU"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter items by type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ingredient">Ingredients</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="product">Products</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter items by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Table - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({filteredItems.length})</CardTitle>
          <CardDescription>
            Manage your inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.itemId}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getStatusIcon(item)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{item.SKU}</p>
                    </div>
                  </div>
                  {getStatusBadge(item)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{item.currentQuantity} {item.inventoryUnit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit Cost</p>
                    <p className="font-medium">${item.weightedAverageCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <Badge variant="outline" className="capitalize text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reorder Point</p>
                    <p className="font-medium">{item.reorderPoint} {item.inventoryUnit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Counted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.itemId} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedItem(item)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item)}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.SKU}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{item.currentQuantity}</span>
                        <span className="text-sm text-muted-foreground">{item.inventoryUnit}</span>
                      </div>
                    </TableCell>
                    <TableCell>${item.weightedAverageCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{item.reorderPoint}</span>
                        <span className="text-sm text-muted-foreground">{item.inventoryUnit}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.lastCountedDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          aria-label={`View details for ${item.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit item:', item.itemId);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Archive item:', item.itemId);
                        }}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Item Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedItem)}
                  {selectedItem.name}
                </SheetTitle>
                <SheetDescription>
                  {selectedItem.SKU} • {selectedItem.type}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Quantity</h4>
                    <p className="text-2xl font-bold">{selectedItem.currentQuantity} {selectedItem.inventoryUnit}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Weighted Average Cost</h4>
                    <p className="text-2xl font-bold">${selectedItem.weightedAverageCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Reorder Point</h4>
                    <p className="text-lg">{selectedItem.reorderPoint} {selectedItem.inventoryUnit}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Last Counted</h4>
                    <p className="text-lg">{selectedItem.lastCountedDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => console.log('Edit item:', selectedItem.itemId)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </Button>
                  <Button variant="outline" onClick={() => console.log('Archive item:', selectedItem.itemId)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
