'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  calculateDashboardMetrics, 
  sampleItems, 
  sampleBatches, 
  samplePurchases,
  sampleSuppliers 
} from '@/lib/sample-data';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Package, 
  DollarSign,
  FlaskConical,
  ShoppingCart,
  Truck
} from 'lucide-react';

export default function Reports() {
  const metrics = calculateDashboardMetrics();

  const inventoryByType = {
    ingredients: sampleItems.filter(i => i.type === 'ingredient').length,
    packaging: sampleItems.filter(i => i.type === 'packaging').length,
    products: sampleItems.filter(i => i.type === 'product').length,
  };

  const supplierStats = sampleSuppliers.map(supplier => {
    const purchases = samplePurchases.filter(p => p.supplierId === supplier.supplierId);
    const totalSpent = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
    return {
      name: supplier.name,
      purchases: purchases.length,
      totalSpent
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="margins">Margins</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleItems.length}</div>
                <p className="text-xs text-muted-foreground">Active items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.inventoryValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.outOfStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Items</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Breakdown by Type</CardTitle>
              <CardDescription>
                Distribution of items across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Ingredients</h4>
                    <Badge variant="outline">{inventoryByType.ingredients}</Badge>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Raw materials for production</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Packaging</h4>
                    <Badge variant="outline">{inventoryByType.packaging}</Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">Containers and labels</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Products</h4>
                    <Badge variant="outline">{inventoryByType.products}</Badge>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Finished goods ready for sale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleBatches.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgYieldPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Production efficiency</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.batchesThisMonth}</div>
                <p className="text-xs text-muted-foreground">Batches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleBatches.reduce((sum, b) => sum + b.qtyMade, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Units made</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleSuppliers.length}</div>
                <p className="text-xs text-muted-foreground">Active vendors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{samplePurchases.length}</div>
                <p className="text-xs text-muted-foreground">Orders placed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${samplePurchases.reduce((sum, p) => sum + p.grandTotal, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${samplePurchases.length > 0 
                    ? (samplePurchases.reduce((sum, p) => sum + p.grandTotal, 0) / samplePurchases.length).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Per order</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance</CardTitle>
              <CardDescription>
                Spending breakdown by supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierStats.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {supplier.purchases} purchases
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${supplier.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        ${supplier.purchases > 0 ? (supplier.totalSpent / supplier.purchases).toFixed(2) : '0.00'} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="margins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Margins</CardTitle>
              <CardDescription>
                Cost analysis and profitability by product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Margin analysis will be available once sales data is connected to cost tracking.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
