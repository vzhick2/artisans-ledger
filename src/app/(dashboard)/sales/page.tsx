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
import { sampleSalesMonths, getItemById } from '@/lib/sample-data';
import { 
  TrendingUp, 
  Plus, 
  Package, 
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';

export default function Sales() {
  const [showNewSale, setShowNewSale] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
        <Button onClick={() => setShowNewSale(!showNewSale)}>
          <Plus className="h-4 w-4 mr-2" />
          {showNewSale ? 'Cancel' : 'Log Sales'}
        </Button>
      </div>

      {/* Sales Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleSalesMonths.length}</div>
            <p className="text-xs text-muted-foreground">Recorded months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleSalesMonths.reduce((sum, s) => sum + s.quantitySold, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sampleSalesMonths.map(s => s.itemId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Sales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleSalesMonths.length > 0 
                ? (sampleSalesMonths.reduce((sum, s) => sum + s.quantitySold, 0) / sampleSalesMonths.length).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Units per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>
            Monthly sales data for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Data Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSalesMonths.map((sale) => {
                const item = getItemById(sale.itemId);
                const monthName = new Date(sale.year, sale.month - 1).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                });
                
                return (
                  <TableRow key={sale.salesMonthId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{item?.name || 'Unknown Product'}</div>
                          <div className="text-sm text-muted-foreground">{item?.SKU}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {monthName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{sale.quantitySold}</span>
                        <span className="text-sm text-muted-foreground">
                          {item?.inventoryUnit || 'units'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize text-sm">
                        {sale.dataSource}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sampleSalesMonths.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sales data recorded yet. Start tracking your monthly sales.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
