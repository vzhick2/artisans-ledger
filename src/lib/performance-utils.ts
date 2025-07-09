/**
 * Performance optimization utilities for the Artisan's Ledger application
 */

import { useMemo, useCallback, useRef, useEffect, useState, lazy, Suspense } from 'react';

/**
 * Debounced search hook with performance optimizations
 */
export function useOptimizedSearch(
  searchValue: string,
  delay: number = 300
): [string, (value: string) => void] {
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSearch = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedValue, updateSearch];
}

/**
 * Memoized filter function for items
 */
export const useItemFilters = (
  items: any[],
  searchTerm: string,
  typeFilter: string,
  statusFilter: string
) => {
  return useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.SKU.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in-stock' && item.currentQuantity > item.reorderPoint) ||
        (statusFilter === 'low-stock' && item.currentQuantity <= item.reorderPoint && item.currentQuantity > 0) ||
        (statusFilter === 'out-of-stock' && item.currentQuantity <= 0);

      return matchesSearch && matchesType && matchesStatus && !item.isArchived;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);
};

/**
 * Pagination hook with performance optimizations
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 20
) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
  };
}

/**
 * Optimized component state management
 */
export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  
  // Keep ref in sync with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;
      
      // Only update if state actually changed
      if (nextState !== prevState) {
        return nextState;
      }
      return prevState;
    });
  }, []);

  return [state, setOptimizedState, stateRef] as const;
}

/**
 * Bundle splitting and lazy loading utilities
 */
export function createLazyImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(importFn);
}

/**
 * Performance monitoring for development
 */
export function usePerformanceLogger(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef<number | undefined>(undefined);

  // Track render count
  renderCount.current++;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      startTime.current = performance.now();
      
      return () => {
        if (startTime.current) {
          const renderTime = performance.now() - startTime.current;
          console.log(`[${componentName}] Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`);
        }
      };
    }
    return undefined;
  });

  return renderCount.current;
}

/**
 * Optimized event handlers
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, deps) as T;
}

/**
 * Image lazy loading with intersection observer
 */
export function useLazyImage(src: string, options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin || '50px',
        threshold: options?.threshold || 0.1,
      }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src, options]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
  }, []);

  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    isError,
    onLoad: handleLoad,
    onError: handleError,
  };
}
