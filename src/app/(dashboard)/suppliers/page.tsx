'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { sampleSuppliers, samplePurchases, getSupplierById } from '@/lib/sample-data';
import { 
  Truck, 
  Plus, 
  Edit, 
  Archive, 
  ExternalLink,
  Phone,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

export default function Suppliers() {
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  
  const getSupplierStats = (supplierId: string) => {
    const purchases = samplePurchases.filter(p => p.supplierId === supplierId);
    const totalSpent = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
    const lastPurchase = purchases.sort((a, b) => 
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    )[0];
    
    return {
      totalPurchases: purchases.length,
      totalSpent,
      lastPurchaseDate: lastPurchase?.purchaseDate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
        <Button 
          onClick={() => setShowNewSupplier(!showNewSupplier)}
          aria-label={showNewSupplier ? 'Cancel adding supplier' : 'Add new supplier'}
        >
          <Plus className="h-4 w-4 mr-2" />
          {showNewSupplier ? 'Cancel' : 'Add Supplier'}
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
          <CardDescription>
            Manage your suppliers and view purchase history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSuppliers.map((supplier) => {
                const stats = getSupplierStats(supplier.supplierId);
                return (
                  <TableRow key={supplier.supplierId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          {supplier.storeUrl && (
                            <a 
                              href={supplier.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{stats.totalPurchases}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium">${stats.totalSpent.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {stats.lastPurchaseDate 
                          ? stats.lastPurchaseDate.toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.isArchived ? "secondary" : "default"}>
                        {supplier.isArchived ? 'Archived' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          aria-label={`Edit ${supplier.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          aria-label={`Archive ${supplier.name}`}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sampleSuppliers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No suppliers found. Add your first supplier to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
