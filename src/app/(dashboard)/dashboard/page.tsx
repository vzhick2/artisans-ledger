'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateDashboardMetrics } from '@/lib/sample-data';
import { DollarSign, ShoppingCart, FlaskConical, TrendingUp, AlertTriangle, Package } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Memoize expensive calculations
  const metrics = useMemo(() => calculateDashboardMetrics(), []);
  const lastUpdated = useMemo(() => new Date().toLocaleString(), []);

  // Simulate initial loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your inventory.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Inventory Value"
          value={`$${metrics.inventoryValue.toFixed(2)}`}
          description="Total current inventory"
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard 
          title="Open Purchase Orders"
          value={metrics.openPurchaseOrders.toString()}
          description="Pending orders"
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <MetricCard 
          title="Batches This Month"
          value={metrics.batchesThisMonth.toString()}
          description="Production runs"
          icon={FlaskConical}
          iconColor="text-purple-600"
        />
        <MetricCard 
          title="Average Yield"
          value={`${metrics.avgYieldPercentage.toFixed(1)}%`}
          description="Production efficiency"
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Action Center */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Action Center
          </CardTitle>
          <CardDescription>
            Items that need your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.outOfStockItems.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Out of Stock ({metrics.outOfStockItems.length})
                </h4>
                <div className="space-y-2">
                  {metrics.outOfStockItems.map((item) => (
                    <div key={item.itemId} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Package className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {item.SKU}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="destructive">Out of Stock</Badge>
                        <Button size="sm" variant="outline" onClick={() => router.push('/purchases')}>
                          Order Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metrics.lowStockItems.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  Low Stock ({metrics.lowStockItems.length})
                </h4>
                <div className="space-y-2">
                  {metrics.lowStockItems.map((item) => (
                    <div key={item.itemId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Package className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.currentQuantity} {item.inventoryUnit} left (reorder at {item.reorderPoint})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary">Low Stock</Badge>
                        <Button size="sm" variant="outline" onClick={() => router.push('/purchases')}>
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metrics.outOfStockItems.length === 0 && metrics.lowStockItems.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-green-600 dark:text-green-400 mb-1">All Good!</h3>
                <p className="text-sm text-muted-foreground">All items are well-stocked.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>
            Overview of current inventory health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard
              title="In Stock"
              count={metrics.inStockItems.length}
              color="green"
              icon={Package}
              onClick={() => router.push('/items?status=in-stock')}
            />
            <StatusCard
              title="Need Reorder"
              count={metrics.lowStockItems.length}
              color="orange"
              icon={AlertTriangle}
              onClick={() => router.push('/items?status=low-stock')}
            />
            <StatusCard
              title="Out of Stock"
              count={metrics.outOfStockItems.length}
              color="red"
              icon={Package}
              onClick={() => router.push('/items?status=out-of-stock')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Components
function MetricCard({ title, value, description, icon: Icon, iconColor }: {
  title: string;
  value: string;
  description: string;
  icon: any;
  iconColor: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusCard({ title, count, color, icon: Icon, onClick }: {
  title: string;
  count: number;
  color: 'green' | 'orange' | 'red';
  icon: any;
  onClick: () => void;
}) {
  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/10',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      number: 'text-green-700 dark:text-green-300',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/10',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      number: 'text-orange-700 dark:text-orange-300',
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/10',
      hover: 'hover:bg-red-100 dark:hover:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      number: 'text-red-700 dark:text-red-300',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
    },
  };

  const classes = colorClasses[color];

  return (
    <div 
      className={`p-4 ${classes.bg} ${classes.hover} rounded-lg cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${classes.text}`}>{title}</p>
          <p className={`text-2xl font-bold ${classes.number}`}>{count}</p>
        </div>
        <div className={`h-8 w-8 ${classes.iconBg} rounded-full flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${classes.text}`} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>

      {/* Inventory Status */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 mt-2" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
