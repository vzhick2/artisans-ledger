'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { lazy, Suspense } from 'react';

/**
 * Lazy-loaded components for better performance
 * These components are loaded on-demand to reduce initial bundle size
 */

// Command Palette - Heavy component with lots of data
export const LazyCommandPalette = lazy(() => 
  import('@/components/command-palette').then(module => ({ default: module.CommandPalette }))
);

// Keyboard Shortcuts Modal - Only loaded when needed
export const LazyKeyboardShortcutsModal = lazy(() => 
  import('@/components/keyboard-shortcuts-modal').then(module => ({ default: module.KeyboardShortcutsModal }))
);

// Charts and Reports - Heavy visualization components
export const LazyReportsCharts = lazy(() => 
  import('@/app/(dashboard)/reports/page').then(module => ({ default: module.default }))
);

// Form components - Heavy due to validation logic
export const LazyItemForm = lazy(() => 
  import('@/app/(dashboard)/items/new/page').then(module => ({ default: module.default }))
);

export const LazyPurchaseForm = lazy(() => 
  import('@/app/(dashboard)/purchases/new/page').then(module => ({ default: module.default }))
);

export const LazyBatchForm = lazy(() => 
  import('@/app/(dashboard)/batches/new/page').then(module => ({ default: module.default }))
);

export const LazyRecipeForm = lazy(() => 
  import('@/app/(dashboard)/recipes/new/page').then(module => ({ default: module.default }))
);

export const LazySalesForm = lazy(() => 
  import('@/app/(dashboard)/sales/new/page').then(module => ({ default: module.default }))
);

export const LazySupplierForm = lazy(() => 
  import('@/app/(dashboard)/suppliers/new/page').then(module => ({ default: module.default }))
);

export const LazySpotCheckForm = lazy(() => 
  import('@/app/(dashboard)/spot-checks/new/page').then(module => ({ default: module.default }))
);

/**
 * Loading components for better UX during lazy loading
 */
export const CommandPaletteLoading = () => (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-background rounded-lg border shadow-lg p-6 w-full max-w-md">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  </div>
);

export const FormLoading = () => (
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

export const ReportsLoading = () => (
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

/**
 * Wrapper components with Suspense for easy integration
 */
export const CommandPaletteWithSuspense = ({ isOpen, onCloseAction }: { isOpen: boolean; onCloseAction: () => void }) => (
  <Suspense fallback={<CommandPaletteLoading />}>
    <LazyCommandPalette isOpen={isOpen} onCloseAction={onCloseAction} />
  </Suspense>
);

export const KeyboardShortcutsModalWithSuspense = ({ isOpen, onCloseAction, hotkeys }: { isOpen: boolean; onCloseAction: () => void; hotkeys: any }) => (
  <Suspense fallback={null}>
    <LazyKeyboardShortcutsModal isOpen={isOpen} onClose={onCloseAction} hotkeys={hotkeys} />
  </Suspense>
);

export const FormWithSuspense = ({ component: Component }: { component: keyof typeof formComponents }) => {
  const FormComponent = formComponents[Component];
  return (
    <Suspense fallback={<FormLoading />}>
      <FormComponent />
    </Suspense>
  );
};

const formComponents = {
  item: LazyItemForm,
  purchase: LazyPurchaseForm,
  batch: LazyBatchForm,
  recipe: LazyRecipeForm,
  sales: LazySalesForm,
  supplier: LazySupplierForm,
  spotCheck: LazySpotCheckForm,
};

export const ReportsWithSuspense = () => (
  <Suspense fallback={<ReportsLoading />}>
    <LazyReportsCharts />
  </Suspense>
);
