import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Performance optimization hooks for memoization and debouncing
 */

/**
 * Enhanced useMemo with dependency debugging
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const prevDeps = useRef<React.DependencyList>([]);
  
  if (process.env.NODE_ENV === 'development' && debugName) {
    useEffect(() => {
      if (prevDeps.current) {
        const changedDeps = deps.filter((dep, index) => 
          prevDeps.current![index] !== dep
        );
        if (changedDeps.length > 0) {
          console.log(`[${debugName}] Dependencies changed:`, changedDeps);
        }
      }
      prevDeps.current = deps;
    });
  }
  
  return useMemo(factory, deps);
}

/**
 * Enhanced useCallback with dependency debugging
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const prevDeps = useRef<React.DependencyList>([]);
  
  if (process.env.NODE_ENV === 'development' && debugName) {
    useEffect(() => {
      if (prevDeps.current) {
        const changedDeps = deps.filter((dep, index) => 
          prevDeps.current![index] !== dep
        );
        if (changedDeps.length > 0) {
          console.log(`[${debugName}] Callback dependencies changed:`, changedDeps);
        }
      }
      prevDeps.current = deps;
    });
  }
  
  return useCallback(callback, deps);
}

/**
 * Performance-optimized debounce hook
 */
export function useOptimizedDebounce<T>(
  value: T,
  delay: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number | undefined>(undefined);
  const lastInvokeTime = useRef<number>(0);
  
  const { leading = false, trailing = true, maxWait } = options || {};
  
  useEffect(() => {
    const now = Date.now();
    lastCallTime.current = now;
    
    const shouldInvokeLeading = leading && (!lastInvokeTime.current || now - lastInvokeTime.current >= delay);
    
    if (shouldInvokeLeading) {
      lastInvokeTime.current = now;
      setDebouncedValue(value);
    }
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }
    
    // Set up trailing invocation
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        if (lastCallTime.current && now === lastCallTime.current) {
          lastInvokeTime.current = Date.now();
          setDebouncedValue(value);
        }
      }, delay);
    }
    
    // Set up max wait timeout
    if (maxWait && !shouldInvokeLeading) {
      maxTimeoutRef.current = setTimeout(() => {
        lastInvokeTime.current = Date.now();
        setDebouncedValue(value);
      }, maxWait);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing, maxWait]);
  
  return debouncedValue;
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = true,
}: {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<Element | null>(null);
  
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const isIntersecting = entry.isIntersecting;
          setIsIntersecting(isIntersecting);
          
          if (isIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
          
          if (triggerOnce && hasIntersected) {
            observer.disconnect();
          }
        }
      },
      { threshold, root, rootMargin }
    );
    
    observer.observe(target);
    
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected]);
  
  return {
    ref: targetRef,
    isIntersecting,
    hasIntersected,
  };
}

/**
 * Web Workers hook for heavy computations
 */
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R,
  dependencies: React.DependencyList = []
) {
  const [result, setResult] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  const runWorker = useCallback((data: T) => {
    if (!window.Worker) {
      // Fallback for browsers without Web Worker support
      try {
        setIsLoading(true);
        const result = workerFunction(data);
        setResult(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    
    const workerScript = `
      self.onmessage = function(e) {
        try {
          const result = (${workerFunction.toString()})(e.data);
          self.postMessage({ result });
        } catch (error) {
          self.postMessage({ error: error.message });
        }
      };
    `;
    
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;
    
    setIsLoading(true);
    setError(null);
    
    worker.onmessage = (e) => {
      if (e.data.error) {
        setError(new Error(e.data.error));
      } else {
        setResult(e.data.result);
      }
      setIsLoading(false);
    };
    
    worker.onerror = (error) => {
      setError(new Error(error.message));
      setIsLoading(false);
    };
    
    worker.postMessage(data);
  }, dependencies);
  
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  return { result, isLoading, error, runWorker };
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(name: string) {
  const startTime = useRef<number | undefined>(undefined);
  
  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);
  
  const end = useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // analytics.track('performance_metric', { name, duration });
      }
    }
  }, [name]);
  
  return { start, end };
}

/**
 * Bundle size optimization utilities
 */
export function useComponentSize(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!ref.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    resizeObserver.observe(ref.current);
    
    return () => resizeObserver.disconnect();
  }, [ref]);
  
  return size;
}

import { useState } from 'react';
