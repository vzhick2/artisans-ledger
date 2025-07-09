// Error reporting service for tracking and logging errors

export interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string | undefined;
  context?: Record<string, any> | undefined;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string | undefined;
  sessionId?: string | undefined;
  environment: string;
  version: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'form' | 'component' | 'api' | 'other';
}

export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private sessionId: string;
  private errorQueue: ErrorReport[] = [];
  private isOnline: boolean = typeof window !== 'undefined' ? navigator.onLine : false;

  private constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
    }
  }

  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushErrorQueue();
      }
    });

    // Listen for beforeunload to flush errors
    window.addEventListener('beforeunload', () => {
      this.flushErrorQueue();
    });
  }

  public reportError(
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorReport['severity'] = 'medium',
    category: ErrorReport['category'] = 'javascript'
  ): string {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorReport: ErrorReport = {
      errorId,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      sessionId: this.sessionId,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      severity,
      category,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Report [${severity.toUpperCase()}]`);
      console.error('Error:', errorReport.message);
      console.error('Stack:', errorReport.stack);
      console.error('Context:', errorReport.context);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // Add to queue
    this.errorQueue.push(errorReport);

    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Store in localStorage as backup
    this.storeInLocalStorage(errorReport);

    return errorId;
  }

  private storeInLocalStorage(errorReport: ErrorReport): void {
    if (typeof window === 'undefined') return;

    try {
      const existingErrors = localStorage.getItem('error_reports');
      const errors = existingErrors ? JSON.parse(existingErrors) : [];
      
      errors.push(errorReport);
      
      // Keep only last 50 errors to prevent storage bloat
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('error_reports', JSON.stringify(errors));
    } catch (err) {
      console.error('Failed to store error in localStorage:', err);
    }
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrorReports(errorsToSend);
    } catch (err) {
      console.error('Failed to send error reports:', err);
      // Put errors back in queue for retry
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private async sendErrorReports(errors: ErrorReport[]): Promise<void> {
    // In development, just log the errors
    if (process.env.NODE_ENV === 'development') {
      console.log('Would send error reports:', errors);
      return;
    }

    // In production, you would send to your error reporting service
    // Example implementations:

    // 1. Send to your own API
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors }),
      });
    } catch (err) {
      // If API fails, try external service
      console.error('Failed to send to API:', err);
    }

    // 2. Send to Sentry (if configured)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   errors.forEach(error => {
    //     window.Sentry.captureException(new Error(error.message), {
    //       tags: {
    //         category: error.category,
    //         severity: error.severity,
    //         errorId: error.errorId,
    //       },
    //       extra: {
    //         context: error.context,
    //         sessionId: error.sessionId,
    //       },
    //     });
    //   });
    // }

    // 3. Send to other services (LogRocket, Bugsnag, etc.)
    // Implementation depends on the service
  }

  public async getStoredErrors(): Promise<ErrorReport[]> {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('error_reports');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to retrieve stored errors:', err);
      return [];
    }
  }

  public clearStoredErrors(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('error_reports');
    } catch (err) {
      console.error('Failed to clear stored errors:', err);
    }
  }

  public getErrorStats(): {
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    recentErrors: ErrorReport[];
  } {
    if (typeof window === 'undefined') {
      return {
        totalErrors: 0,
        errorsByCategory: {},
        errorsBySeverity: {},
        recentErrors: [],
      };
    }

    const stored = localStorage.getItem('error_reports');
    const errors: ErrorReport[] = stored ? JSON.parse(stored) : [];

    const errorsByCategory = errors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentErrors = errors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors,
    };
  }
}

// Singleton instance
export const errorReportingService = ErrorReportingService.getInstance();

// Convenience functions
export const reportError = (
  error: Error | string,
  context?: Record<string, any>,
  severity?: ErrorReport['severity'],
  category?: ErrorReport['category']
): string => {
  return errorReportingService.reportError(error, context, severity, category);
};

export const reportFormError = (error: Error | string, formData?: Record<string, any>): string => {
  return errorReportingService.reportError(error, { formData }, 'medium', 'form');
};

export const reportApiError = (error: Error | string, endpoint: string, method: string): string => {
  return errorReportingService.reportError(
    error,
    { endpoint, method },
    'high',
    'api'
  );
};

export const reportComponentError = (
  error: Error | string,
  componentName: string,
  props?: Record<string, any>
): string => {
  return errorReportingService.reportError(
    error,
    { componentName, props },
    'medium',
    'component'
  );
};

export const reportCriticalError = (error: Error | string, context?: Record<string, any>): string => {
  return errorReportingService.reportError(error, context, 'critical');
};

// Error boundary integration
export const reportErrorBoundaryError = (
  error: Error,
  errorInfo: { componentStack: string },
  componentName?: string
): string => {
  return errorReportingService.reportError(
    error,
    {
      componentStack: errorInfo.componentStack,
      componentName,
    },
    'high',
    'component'
  );
};
