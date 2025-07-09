'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { lazy, Suspense } from 'react';

// Lazy load heavy form components to reduce initial bundle size
const LazyItemForm = lazy(() => import('@/app/(dashboard)/items/new/page'));
const LazyPurchaseForm = lazy(() => import('@/app/(dashboard)/purchases/new/page'));
const LazyBatchForm = lazy(() => import('@/app/(dashboard)/batches/new/page'));
const LazyRecipeForm = lazy(() => import('@/app/(dashboard)/recipes/new/page'));
const LazySalesForm = lazy(() => import('@/app/(dashboard)/sales/new/page'));
const LazySupplierForm = lazy(() => import('@/app/(dashboard)/suppliers/new/page'));
const LazySpotCheckForm = lazy(() => import('@/app/(dashboard)/spot-checks/new/page'));

// Lazy load dashboard sections
const LazyReports = lazy(() => import('@/app/(dashboard)/reports/page'));

// Loading skeleton components
const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-48" />
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const ReportsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-9 w-28" />
    </div>
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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

// Wrapper components with Suspense for easy integration
export const LazyItemFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyItemForm />
  </Suspense>
);

export const LazyPurchaseFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyPurchaseForm />
  </Suspense>
);

export const LazyBatchFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyBatchForm />
  </Suspense>
);

export const LazyRecipeFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyRecipeForm />
  </Suspense>
);

export const LazySalesFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazySalesForm />
  </Suspense>
);

export const LazySupplierFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazySupplierForm />
  </Suspense>
);

export const LazySpotCheckFormWithSuspense = () => (
  <Suspense fallback={<FormSkeleton />}>
    <LazySpotCheckForm />
  </Suspense>
);

export const LazyReportsWithSuspense = () => (
  <Suspense fallback={<ReportsSkeleton />}>
    <LazyReports />
  </Suspense>
);

// Export all lazy components for easy importing
export {
    LazyBatchForm, LazyItemForm,
    LazyPurchaseForm, LazyRecipeForm, LazyReports, LazySalesForm, LazySpotCheckForm, LazySupplierForm
};

