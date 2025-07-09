import { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export interface Hotkey {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export function useHotkeys(onOpenCommandPalette?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Global hotkeys
  const globalHotkeys: Hotkey[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        if (onOpenCommandPalette) {
          onOpenCommandPalette();
        } else {
          // Focus search if available, otherwise show quick nav
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          } else {
            toast({
              title: "Command Palette",
              description: "Press Ctrl+K to open the command palette for quick navigation",
            });
          }
        }
      },
      description: 'Open command palette',
      category: 'Navigation'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        const currentPath = pathname.split('/').slice(0, -1).join('/');
        const newPath = currentPath + '/new';
        
        // Check if we're in a section that supports "new"
        const supportedSections = ['/items', '/suppliers', '/purchases', '/batches', '/spot-checks', '/sales', '/recipes'];
        const isSupported = supportedSections.some(section => pathname.startsWith(section));
        
        if (isSupported) {
          router.push(newPath);
        } else {
          toast({
            title: "Quick Create",
            description: "New item creation available in Items, Suppliers, Purchases, and other data sections",
          });
        }
      },
      description: 'Create new item',
      category: 'Actions'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => router.push('/dashboard'),
      description: 'Go to dashboard',
      category: 'Navigation'
    },
    {
      key: 'i',
      ctrlKey: true,
      action: () => router.push('/items'),
      description: 'Go to items',
      category: 'Navigation'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => router.push('/purchases'),
      description: 'Go to purchases',
      category: 'Navigation'
    },
    {
      key: 'b',
      ctrlKey: true,
      action: () => router.push('/batches'),
      description: 'Go to batches',
      category: 'Navigation'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => router.push('/sales'),
      description: 'Go to sales',
      category: 'Navigation'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals, dropdowns, etc.
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
        
        // Close mobile menu if open
        const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black\\/60');
        if (mobileMenuOverlay) {
          (mobileMenuOverlay as HTMLElement).click();
        }
        
        setShowHelpModal(false);
      },
      description: 'Close modals/menus',
      category: 'Actions'
    },
    {
      key: '?',
      action: () => setShowHelpModal(true),
      description: 'Show keyboard shortcuts',
      category: 'Help'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger hotkeys when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return;
    }

    const hotkey = globalHotkeys.find(hk => {
      return hk.key === event.key &&
             !!hk.ctrlKey === event.ctrlKey &&
             !!hk.altKey === event.altKey &&
             !!hk.shiftKey === event.shiftKey;
    });

    if (hotkey) {
      event.preventDefault();
      hotkey.action();
    }
  }, [globalHotkeys, pathname, router]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    hotkeys: globalHotkeys,
    showHelpModal,
    setShowHelpModal
  };
}

export function useFormHotkeys(onSubmit: () => void, onReset?: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only work within forms
      if (!event.target || !(event.target as Element).closest('form')) {
        return;
      }

      // Ctrl+Enter to submit
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        onSubmit();
      }

      // Ctrl+R to reset (if provided)
      if (event.ctrlKey && event.key === 'r' && onReset) {
        event.preventDefault();
        onReset();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit, onReset]);
}
