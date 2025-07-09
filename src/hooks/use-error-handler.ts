import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useState } from 'react';

export interface ErrorInfo {
  message: string;
  stack?: string | undefined;
  context?: Record<string, any> | undefined;
  timestamp: string;
  errorId: string;
}

export function useErrorHandler() {
  const { toast } = useToast();
  const [lastError, setLastError] = useState<ErrorInfo | null>(null);

  const handleError = useCallback((error: Error | string, context?: Record<string, any>) => {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context,
      timestamp: new Date().toISOString(),
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setLastError(errorInfo);

    // Log the error for debugging
    console.error('Error handled:', errorInfo);

    // Show toast notification
    toast({
      title: "Error",
      description: errorInfo.message,
      variant: "destructive",
    });

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendErrorToService(errorInfo);
    }

    return errorInfo;
  }, [toast]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // Automatically clear error after 5 minutes
  useEffect(() => {
    if (lastError) {
      const timeout = setTimeout(() => {
        clearError();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [lastError, clearError]);

  return {
    handleError,
    clearError,
    lastError,
  };
}

// Hook for handling async operations with error handling
export function useAsyncOperation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = options?.errorMessage || 
        (err instanceof Error ? err.message : 'An unexpected error occurred');
      
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(errorMessage));
      
      if (options?.onError && err instanceof Error) {
        options.onError(err);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
  };
}

// Hook for handling form submissions with better error handling
export function useFormSubmission<T>() {
  const { execute, isLoading, error } = useAsyncOperation();
  const { toast } = useToast();

  const submitForm = useCallback(async (
    data: T,
    submitFunction: (data: T) => Promise<void>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    return execute(
      async () => {
        await submitFunction(data);
        
        // Show success toast
        toast({
          title: "Success!",
          description: options?.successMessage || "Operation completed successfully.",
          variant: "success",
        });

        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      {
        errorMessage: options?.errorMessage || "Failed to submit form. Please try again.",
        ...(options?.onError && { onError: options.onError }),
      }
    );
  }, [execute, toast]);

  return {
    submitForm,
    isSubmitting: isLoading,
    error,
  };
}

// Hook for handling component errors with retry functionality
export function useComponentError(componentName: string) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { handleError } = useErrorHandler();

  const handleComponentError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorInfo = handleError(error, {
      ...context,
      componentName,
      retryCount,
    });

    return errorInfo;
  }, [handleError, componentName, retryCount]);

  const retry = useCallback(async (retryFunction?: () => Promise<void>) => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      if (retryFunction) {
        await retryFunction();
      }
    } catch (error) {
      handleComponentError(
        error instanceof Error ? error : new Error('Retry failed'),
        { retryAttempt: retryCount + 1 }
      );
    } finally {
      setIsRetrying(false);
    }
  }, [handleComponentError, retryCount]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    handleComponentError,
    retry,
    reset,
    retryCount,
    isRetrying,
  };
}

// Global error handler for unhandled promise rejections
export function useGlobalErrorHandler() {
  const { handleError: handleErrorInternal } = useErrorHandler();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error('Unhandled promise rejection');

      handleErrorInternal(error);
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      const error = event.error instanceof Error 
        ? event.error 
        : new Error(event.message || 'Global error');

      handleErrorInternal(error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [handleErrorInternal]);
}

// Hook for handling API errors with retry and circuit breaker patterns
export function useApiErrorHandler() {
  const [failureCount, setFailureCount] = useState(0);
  const [isCircuitOpen, setIsCircuitOpen] = useState(false);
  const { handleError } = useErrorHandler();

  const MAX_FAILURES = 5;
  const CIRCUIT_RESET_TIMEOUT = 60000; // 1 minute

  const handleApiError = useCallback((error: Error, _endpoint: string) => {
    setFailureCount(prev => prev + 1);

    // Open circuit breaker after too many failures
    if (failureCount >= MAX_FAILURES) {
      setIsCircuitOpen(true);
      
      // Reset circuit breaker after timeout
      setTimeout(() => {
        setIsCircuitOpen(false);
        setFailureCount(0);
      }, CIRCUIT_RESET_TIMEOUT);
    }

    return handleError(error);
  }, [handleError, failureCount, isCircuitOpen]);

  const resetFailures = useCallback(() => {
    setFailureCount(0);
    setIsCircuitOpen(false);
  }, []);

  return {
    handleApiError,
    resetFailures,
    failureCount,
    isCircuitOpen,
  };
}
