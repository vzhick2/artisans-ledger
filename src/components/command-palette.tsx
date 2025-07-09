'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { sampleItems, sampleRecipes, sampleSuppliers } from '@/lib/sample-data';
import {
    BarChart3,
    BookOpen,
    ChefHat,
    Eye,
    FlaskConical,
    Home,
    Package,
    Plus,
    Search,
    Settings,
    ShoppingCart,
    TrendingUp,
    Truck
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
  keywords?: string[];
}

export function CommandPalette({ isOpen, onCloseAction }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigationCommands: Command[] = [
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'Go to main dashboard',
      icon: Home,
      action: () => router.push('/dashboard'),
      category: 'Navigation',
      keywords: ['home', 'main', 'overview']
    },
    {
      id: 'nav-items',
      label: 'Items',
      description: 'Manage inventory items',
      icon: Package,
      action: () => router.push('/items'),
      category: 'Navigation',
      keywords: ['inventory', 'products', 'ingredients']
    },
    {
      id: 'nav-recipes',
      label: 'Recipes',
      description: 'Manage product recipes',
      icon: ChefHat,
      action: () => router.push('/recipes'),
      category: 'Navigation',
      keywords: ['formulas', 'products', 'cooking']
    },
    {
      id: 'nav-suppliers',
      label: 'Suppliers',
      description: 'Manage suppliers',
      icon: Truck,
      action: () => router.push('/suppliers'),
      category: 'Navigation',
      keywords: ['vendors', 'providers']
    },
    {
      id: 'nav-purchases',
      label: 'Purchases',
      description: 'Log and track purchases',
      icon: ShoppingCart,
      action: () => router.push('/purchases'),
      category: 'Navigation',
      keywords: ['buying', 'orders', 'procurement']
    },
    {
      id: 'nav-batches',
      label: 'Batches',
      description: 'Production batches',
      icon: FlaskConical,
      action: () => router.push('/batches'),
      category: 'Navigation',
      keywords: ['production', 'manufacturing']
    },
    {
      id: 'nav-sales',
      label: 'Sales',
      description: 'Track sales data',
      icon: TrendingUp,
      action: () => router.push('/sales'),
      category: 'Navigation',
      keywords: ['revenue', 'orders', 'customers']
    },
    {
      id: 'nav-ledger',
      label: 'Ledger',
      description: 'Transaction history',
      icon: BookOpen,
      action: () => router.push('/ledger'),
      category: 'Navigation',
      keywords: ['transactions', 'history', 'audit']
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      description: 'Analytics and reports',
      icon: BarChart3,
      action: () => router.push('/reports'),
      category: 'Navigation',
      keywords: ['analytics', 'charts', 'insights']
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      description: 'Application settings',
      icon: Settings,
      action: () => router.push('/settings'),
      category: 'Navigation',
      keywords: ['preferences', 'configuration']
    }
  ];

  const actionCommands: Command[] = [
    {
      id: 'action-new-item',
      label: 'New Item',
      description: 'Create a new inventory item',
      icon: Plus,
      action: () => router.push('/items/new'),
      category: 'Actions',
      keywords: ['create', 'add', 'ingredient', 'product']
    },
    {
      id: 'action-new-supplier',
      label: 'New Supplier',
      description: 'Add a new supplier',
      icon: Plus,
      action: () => router.push('/suppliers/new'),
      category: 'Actions',
      keywords: ['create', 'add', 'vendor']
    },
    {
      id: 'action-new-purchase',
      label: 'Log Purchase',
      description: 'Record a new purchase',
      icon: Plus,
      action: () => router.push('/purchases/new'),
      category: 'Actions',
      keywords: ['create', 'add', 'buy', 'order']
    },
    {
      id: 'action-new-batch',
      label: 'New Batch',
      description: 'Start a production batch',
      icon: Plus,
      action: () => router.push('/batches/new'),
      category: 'Actions',
      keywords: ['create', 'produce', 'manufacture']
    },
    {
      id: 'action-new-recipe',
      label: 'New Recipe',
      description: 'Create a new recipe',
      icon: Plus,
      action: () => router.push('/recipes/new'),
      category: 'Actions',
      keywords: ['create', 'formula', 'formulation']
    },
    {
      id: 'action-spot-check',
      label: 'Spot Check',
      description: 'Perform inventory spot check',
      icon: Eye,
      action: () => router.push('/spot-checks/new'),
      category: 'Actions',
      keywords: ['count', 'verify', 'audit']
    },
    {
      id: 'action-log-sales',
      label: 'Log Sales',
      description: 'Record sales data',
      icon: Plus,
      action: () => router.push('/sales/new'),
      category: 'Actions',
      keywords: ['record', 'revenue', 'order']
    }
  ];

  // Dynamic data commands
  const dataCommands = useMemo(() => {
    const commands: Command[] = [];
    
    // Add top items
    sampleItems.slice(0, 5).forEach(item => {
      commands.push({
        id: `item-${item.itemId}`,
        label: item.name,
        description: `${item.type} • ${item.currentQuantity} ${item.inventoryUnit}`,
        icon: Package,
        action: () => {
          router.push(`/items?search=${encodeURIComponent(item.name)}`);
        },
        category: 'Items',
        keywords: [item.name, item.SKU, item.type]
      });
    });

    // Add suppliers
    sampleSuppliers.slice(0, 5).forEach(supplier => {
      commands.push({
        id: `supplier-${supplier.supplierId}`,
        label: supplier.name,
        description: `${supplier.phone || 'No phone'} • ${supplier.storeUrl || 'No website'}`,
        icon: Truck,
        action: () => {
          router.push(`/suppliers?search=${encodeURIComponent(supplier.name)}`);
        },
        category: 'Suppliers',
        keywords: [supplier.name, supplier.phone || '', supplier.storeUrl || '']
      });
    });

    // Add recipes
    sampleRecipes.slice(0, 5).forEach(recipe => {
      commands.push({
        id: `recipe-${recipe.recipeId}`,
        label: recipe.name,
        description: `Expected yield: ${recipe.expectedYield} units`,
        icon: ChefHat,
        action: () => {
          router.push(`/recipes?search=${encodeURIComponent(recipe.name)}`);
        },
        category: 'Recipes',
        keywords: [recipe.name, recipe.recipeId]
      });
    });

    return commands;
  }, [router]);

  const allCommands = [...navigationCommands, ...actionCommands, ...dataCommands];

  const filteredCommands = useMemo(() => {
    if (!query) return allCommands;
    
    const lowercaseQuery = query.toLowerCase();
    return allCommands.filter(command => {
      const searchableText = [
        command.label,
        command.description || '',
        ...(command.keywords || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowercaseQuery);
    });
  }, [query, allCommands]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onCloseAction();
      }
    }
  }, [filteredCommands, selectedIndex, onCloseAction]);

  const executeCommand = useCallback((command: Command) => {
    command.action();
    onCloseAction();
  }, [onCloseAction]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <DialogDescription className="sr-only">
            Quick navigation and search
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands, items, suppliers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto pb-6">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands], categoryIndex) => (
              <div key={category}>
                <div className="px-6 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </h3>
                </div>
                <div className="space-y-1 px-2">
                  {commands.map((command, commandIndex) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <Button
                        key={command.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-3 ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                        onClick={() => executeCommand(command)}
                      >
                        <command.icon className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{command.label}</div>
                          {command.description && (
                            <div className="text-sm text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {categoryIndex < Object.keys(groupedCommands).length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">↑↓</Badge>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">Enter</Badge>
                <span>select</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">Esc</Badge>
                <span>close</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">?</Badge>
              <span>shortcuts</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
