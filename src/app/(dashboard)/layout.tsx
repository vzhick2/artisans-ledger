'use client';

import { Sidebar } from '@/components/sidebar';
import { FloatingActionButton } from '@/components/floating-action-button';
import { memo, Suspense } from 'react';

// Loading component for better UX
const Loading = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

function AppLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content area with enhanced mobile/desktop spacing */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6 pt-20 lg:pt-6 min-h-0">
          <div className="max-w-full mx-auto">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
      
      {/* Floating action button for mobile */}
      <FloatingActionButton />
    </div>
  );
}

// Memoize the layout to prevent unnecessary re-renders
export default memo(AppLayoutComponent);
