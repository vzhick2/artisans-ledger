'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  ChefHat,
  Truck,
  ShoppingCart,
  FlaskConical,
  Search,
  TrendingUp,
  BookOpen,
  Settings,
  Home,
  X,
  Menu
} from 'lucide-react';

// Move navigation outside component to prevent recreation on every render
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Recipes', href: '/recipes', icon: ChefHat },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Batches', href: '/batches', icon: FlaskConical },
  { name: 'Spot Checks', href: '/spot-checks', icon: Search },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Ledger', href: '/ledger', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

// Memoized navigation item component
const NavigationItem = memo(({ item, isActive, onClick }: {
  item: typeof navigation[number];
  isActive: boolean;
  onClick?: () => void;
}) => {
  const router = useRouter();

  const handleMouseEnter = useCallback(() => {
    // Pre-prefetch the route on hover for better performance
    router.prefetch(item.href);
  }, [router, item.href]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Link
      href={item.href}
      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 min-h-[48px] ${isActive
          ? "bg-primary/10 text-primary border-l-4 border-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <item.icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
        }`} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
});

NavigationItem.displayName = 'NavigationItem';

function SidebarComponent({ className, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Handle swipe to close on mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const deltaX = currentX - startX;

      // If swiping left more than 50px, close the sidebar
      if (deltaX < -50) {
        onClose?.();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [onClose]);

  // Create navigation items with better performance
  const navigationItems = useMemo(() => {
    return navigation.map((item) => (
      <NavigationItem
        key={item.name}
        item={item}
        isActive={pathname === item.href}
        onClick={onClose}
      />
    ));
  }, [pathname, onClose]);

  return (
    <>
      {/* Mobile overlay with improved backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r z-50",
          // Desktop styles - always visible, fixed position
          "lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:translate-x-0 lg:transition-none lg:block",
          // Mobile styles - slide in from left with smooth animation
          isOpen
            ? "fixed inset-y-0 left-0 w-72 transform translate-x-0 transition-transform duration-300 ease-out shadow-2xl"
            : "fixed inset-y-0 left-0 w-72 transform -translate-x-full transition-transform duration-300 ease-in",
          className
        )}
        onTouchStart={handleTouchStart}
      >
        {/* Header with improved mobile design */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold truncate">
              Artisan&apos;s Ledger
            </h1>
          </div>
          {/* Enhanced close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigationItems}
        </nav>

        {/* Mobile footer with user info placeholder */}
        <div className="lg:hidden px-4 py-3 border-t bg-background/50 backdrop-blur">
          <div className="text-xs text-muted-foreground text-center">
            Phase 1 - UI Prototype
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Mobile Header Component
const MobileHamburger = memo(({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <button
      onClick={onMenuClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-background/80 backdrop-blur-sm border rounded-xl shadow-lg hover:bg-accent transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center"
      aria-label="Open navigation menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
});

MobileHamburger.displayName = 'MobileHamburger';

// Main Sidebar component with mobile state management
function SidebarWithMobile({ className }: { className?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Close mobile menu on route change
  const pathname = usePathname();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <MobileHamburger onMenuClick={handleMenuClick} />
      <SidebarComponent
        className={className}
        isOpen={isMobileOpen}
        onClose={handleClose}
      />
    </>
  );
}

// Memoize the sidebar to prevent unnecessary re-renders
export const Sidebar = memo(SidebarWithMobile);
