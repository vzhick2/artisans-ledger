'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver, useStableCallback, useStableMemo } from '@/hooks/use-performance';
import { calculateDashboardMetrics } from '@/lib/sample-data';
import {
    AlertTriangle,
    CheckCircle,
    DollarSign,
    FlaskConical,
    Package,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

// Lazy load heavy components
const LazyInventoryOverview = lazy(() => import('./dashboard-inventory-overview'));
const LazyQuickActions = lazy(() => import('./dashboard-quick-actions'));
const LazyRecentActivity = lazy(() => import('./dashboard-recent-activity'));

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

const DashboardSection = ({ title, children }: DashboardSectionProps) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hasIntersected ? children : <DashboardSectionSkeleton />}
    </div>
  );
};

const DashboardSectionSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const MetricsCard = ({ title, value, description, icon: Icon, trend, color = 'blue' }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  trend?: { value: number; label: string };
  color?: string;
}) => {
  const cardClass = useMemo(() => {
    const baseClass = 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1';
    return `${baseClass} ${color === 'green' ? 'hover:shadow-green-100' : 
                          color === 'red' ? 'hover:shadow-red-100' : 
                          'hover:shadow-blue-100'}`;
  }, [color]);

  return (
    <Card className={cardClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color === 'green' ? 'text-green-600' : 
                                    color === 'red' ? 'text-red-600' : 
                                    'text-blue-600'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`text-xs mt-1 flex items-center gap-1 ${
            trend.value > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-3 w-3" />
            {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActionCenterCard = ({ title, items, color, icon: Icon, actionLabel, onAction }: {
  title: string;
  items: any[];
  color: string;
  icon: React.ComponentType<any>;
  actionLabel: string;
  onAction: () => void;
}) => {
  const borderColorClass = useMemo(() => {
    switch (color) {
      case 'red': return 'border-red-200 dark:border-red-800';
      case 'orange': return 'border-orange-200 dark:border-orange-800';
      default: return 'border-gray-200 dark:border-gray-800';
    }
  }, [color]);

  const bgColorClass = useMemo(() => {
    switch (color) {
      case 'red': return 'bg-red-50 dark:bg-red-900/10';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/10';
      default: return 'bg-gray-50 dark:bg-gray-900/10';
    }
  }, [color]);

  const textColorClass = useMemo(() => {
    switch (color) {
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }, [color]);

  const iconColorClass = useMemo(() => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'orange': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  }, [color]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className={`font-medium ${textColorClass} flex items-center gap-2`}>
        <div className={`h-2 w-2 ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'} rounded-full`}></div>
        {title} ({items.length})
      </h4>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <div key={item.itemId} className={`flex items-center justify-between p-3 ${bgColorClass} rounded-lg border ${borderColorClass}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Icon className={`h-4 w-4 ${iconColorClass} flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.currentQuantity} {item.inventoryUnit} left
                  {item.reorderPoint && ` (reorder at ${item.reorderPoint})`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={color === 'red' ? 'destructive' : 'secondary'}>
                {color === 'red' ? 'Out of Stock' : 'Low Stock'}
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onAction}
                aria-label={`${actionLabel} ${item.name}`}
              >
                {actionLabel}
              </Button>
            </div>
          </div>
        ))}
        {items.length > 3 && (
          <div className="text-center py-2">
            <Button variant="ghost" size="sm" onClick={onAction}>
              View {items.length - 3} more items
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function OptimizedDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Memoize expensive calculations
  const metrics = useStableMemo(() => {
    try {
      return calculateDashboardMetrics();
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: [],
        outOfStockItems: [],
        recentBatches: 0,
        recentPurchases: 0,
        totalBatches: 0,
        totalPurchases: 0,
      };
    }
  }, []);

  // Memoized navigation handlers
  const handleReorderNavigation = useStableCallback(() => {
    router.push('/purchases');
  }, [router]);

  const handleItemsNavigation = useStableCallback(() => {
    router.push('/items');
  }, [router]);

  const handleBatchesNavigation = useStableCallback(() => {
    router.push('/batches');
  }, [router]);

  const handlePurchasesNavigation = useStableCallback(() => {
    router.push('/purchases');
  }, [router]);

  // Simulate initial loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleString());
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <DashboardSectionSkeleton />
        <DashboardSectionSkeleton />
      </div>
    );
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

      {/* Key Metrics */}
      <DashboardSection title="Key Metrics">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Items"
            value={metrics.totalItems}
            description="Active inventory"
            icon={Package}
            trend={{ value: 5, label: 'vs last month' }}
          />
          <MetricsCard
            title="Inventory Value"
            value={`$${metrics.totalValue.toFixed(2)}`}
            description="Total value on hand"
            icon={DollarSign}
            color="green"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <MetricsCard
            title="Recent Batches"
            value={metrics.recentBatches}
            description="Last 7 days"
            icon={FlaskConical}
            trend={{ value: -2, label: 'vs prev week' }}
          />
          <MetricsCard
            title="Recent Purchases"
            value={metrics.recentPurchases}
            description="Last 7 days"
            icon={ShoppingCart}
            color="blue"
            trend={{ value: 8, label: 'vs prev week' }}
          />
        </div>
      </DashboardSection>

      {/* Action Center */}
      <DashboardSection title="Action Center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.outOfStockItems.length === 0 && metrics.lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                <p className="text-muted-foreground">
                  All items are adequately stocked!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <ActionCenterCard
                  title="Out of Stock"
                  items={metrics.outOfStockItems}
                  color="red"
                  icon={Package}
                  actionLabel="Order Now"
                  onAction={handleReorderNavigation}
                />
                <ActionCenterCard
                  title="Low Stock"
                  items={metrics.lowStockItems}
                  color="orange"
                  icon={Package}
                  actionLabel="Reorder"
                  onAction={handleReorderNavigation}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <Suspense fallback={<DashboardSectionSkeleton />}>
          <LazyQuickActions />
        </Suspense>
      </DashboardSection>

      {/* Recent Activity */}
      <DashboardSection title="Recent Activity">
        <Suspense fallback={<DashboardSectionSkeleton />}>
          <LazyRecentActivity />
        </Suspense>
      </DashboardSection>

      {/* Inventory Overview */}
      <DashboardSection title="Inventory Overview">
        <Suspense fallback={<DashboardSectionSkeleton />}>
          <LazyInventoryOverview />
        </Suspense>
      </DashboardSection>
    </div>
  );
}
