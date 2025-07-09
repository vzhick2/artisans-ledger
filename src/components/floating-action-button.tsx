'use client';

import { memo, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Package, FlaskConical, ShoppingCart, Search, TrendingUp, ChefHat, Truck } from 'lucide-react';

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton = memo(({ className }: FloatingActionButtonProps) => {
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
      case 'add-recipe':
        router.push('/recipes/new');
        break;
      case 'add-supplier':
        router.push('/suppliers/new');
        break;
    }
  }, [router]);

  // Close FAB when clicking outside
  const handleBackdropClick = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Get contextual actions based on current page
  const getQuickActions = () => {
    const allActions = [
      { id: 'add-item', label: 'Add Item', icon: Package },
      { id: 'log-batch', label: 'Log Batch', icon: FlaskConical },
      { id: 'new-purchase', label: 'New Purchase', icon: ShoppingCart },
      { id: 'spot-check', label: 'Spot Check', icon: Search },
      { id: 'log-sales', label: 'Log Sales', icon: TrendingUp },
      { id: 'add-recipe', label: 'Add Recipe', icon: ChefHat },
      { id: 'add-supplier', label: 'Add Supplier', icon: Truck },
    ];

    // Show most relevant actions first based on current page
    if (pathname.includes('/items')) {
      return [allActions[0], allActions[1], allActions[2], allActions[3]]; // Add Item, Log Batch, Purchase, Spot Check
    } else if (pathname.includes('/batches')) {
      return [allActions[1], allActions[0], allActions[5], allActions[2]]; // Log Batch, Add Item, Add Recipe, Purchase
    } else if (pathname.includes('/purchases')) {
      return [allActions[2], allActions[0], allActions[6], allActions[1]]; // Purchase, Add Item, Add Supplier, Log Batch
    } else if (pathname.includes('/recipes')) {
      return [allActions[5], allActions[1], allActions[0], allActions[2]]; // Add Recipe, Log Batch, Add Item, Purchase
    } else {
      return allActions.slice(0, 4); // Default: first 4 actions
    }
  };

  return (
    <>
      {/* Enhanced backdrop with blur */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="flex flex-col items-end gap-3">
          {/* Expanded Action Buttons with animation */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-300">
              {getQuickActions().map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 bg-background/95 backdrop-blur-sm border text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px] min-h-[48px] hover:bg-accent"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main FAB with improved design */}
          <button
            onClick={toggleExpanded}
            className={`p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px] min-w-[56px] flex items-center justify-center ${isExpanded ? 'rotate-45 scale-110' : 'hover:scale-105'
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
