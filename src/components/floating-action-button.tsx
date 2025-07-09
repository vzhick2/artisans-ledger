'use client';

import { FlaskConical, Package, Plus, Search, ShoppingCart, TrendingUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';

const FloatingActionButton = memo(() => {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleAction = useCallback((action: string) => {
    setIsExpanded(false);

    switch (action) {
      case 'add-item':
        router.push('/items/new');
        break;
      case 'log-batch':
        router.push('/batches/new');
        break;
      case 'new-purchase':
        router.push('/purchases/new');
        break;
      case 'spot-check':
        router.push('/spot-checks/new');
        break;
      case 'log-sales':
        router.push('/sales/new');
        break;
      default:
        // Fallback to most common action
        router.push('/items/new');
    }
  }, [router]);

  // Get contextual actions based on current page (blueprint-aligned)
  const getQuickActions = () => {
    // Core actions mentioned in the blueprint Action Center
    const coreActions = [
      { id: 'add-item', label: 'Add Item', icon: Package },
      { id: 'new-purchase', label: 'New Purchase', icon: ShoppingCart },
      { id: 'log-batch', label: 'Log Batch', icon: FlaskConical },
      { id: 'spot-check', label: 'Spot Check', icon: Search },
      { id: 'log-sales', label: 'Log Sales', icon: TrendingUp },
    ];

    // Context-aware ordering based on current page
    if (pathname.includes('/items')) {
      return [coreActions[0]!, coreActions[2]!, coreActions[1]!, coreActions[3]!]; // Add Item first
    } else if (pathname.includes('/batches')) {
      return [coreActions[2]!, coreActions[0]!, coreActions[1]!, coreActions[3]!]; // Log Batch first
    } else if (pathname.includes('/purchases')) {
      return [coreActions[1]!, coreActions[0]!, coreActions[2]!, coreActions[3]!]; // New Purchase first
    } else if (pathname.includes('/sales')) {
      return [coreActions[4]!, coreActions[0]!, coreActions[1]!, coreActions[2]!]; // Log Sales first
    } else {
      return coreActions.slice(0, 4); // Default: first 4 actions
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Blueprint-aligned Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="flex flex-col items-end gap-3">
          {/* Quick Actions (aligned with blueprint Action Center) */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
              {getQuickActions().map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 bg-background border text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px] hover:bg-accent"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={toggleExpanded}
            className={`p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-h-[56px] min-w-[56px] flex items-center justify-center ${
              isExpanded ? 'rotate-45' : 'hover:scale-105'
            }`}
            aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton };
