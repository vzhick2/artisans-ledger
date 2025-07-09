'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { reportErrorBoundaryError } from '@/lib/error-reporting';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
  errorId: string;
}

// Default error fallback component
function DefaultErrorFallback({ error, errorInfo, resetError, errorId }: ErrorFallbackProps) {
  const copyErrorDetails = () => {
    const errorDetails = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const goHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600 dark:text-red-400">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            The application encountered an unexpected error. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Bug className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Error ID: {errorId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error.message}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetError} variant="default" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={reloadPage} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>
            <Button onClick={goHome} variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            </div>
            <Button
              onClick={copyErrorDetails}
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
            >
              Copy Error Details
            </Button>
          </details>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>If this problem persists, please contact support with the Error ID above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main error boundary component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate a unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo,
    });

    // Report error to error reporting service
    const errorId = reportErrorBoundaryError(error, {
      componentStack: errorInfo.componentStack || 'Unknown component stack'
    });
    
    // Update error ID in state
    this.setState(prevState => ({
      ...prevState,
      errorId,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state if resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      if (resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])) {
        this.resetErrorBoundary();
      }
    }

    // Reset error state if any props change (when resetOnPropsChange is true)
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  override componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  override render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          resetError={this.resetErrorBoundary}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary programmatically
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Manual error reported:', error, errorInfo);
    
    // In a real app, you might want to send this to an error reporting service
    // Example: sendErrorToService(error, errorInfo);
    
    // For now, we'll just throw it to be caught by the nearest error boundary
    throw error;
  }, []);
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specialized error boundaries for different parts of the app
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page Error:', error, errorInfo);
        // Could send to analytics/error reporting
      }}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Form Error</p>
              <p className="text-sm">
                Something went wrong with the form. Please try again.
              </p>
              <Button onClick={resetError} variant="outline" size="sm">
                Reset Form
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: React.ReactNode; 
  componentName: string; 
}) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Component Error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            The {componentName} component encountered an error and couldn't render.
          </p>
          <Button onClick={resetError} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
