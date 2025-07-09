'use client';

import { createContext, useContext, useCallback, useState, ReactNode, createElement } from 'react';
import { useToast as useToastPrimitive } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Info, Undo2 } from 'lucide-react';

interface UndoAction {
  id: string;
  label: string;
  action: () => void;
  timeoutMs?: number;
}

interface EnhancedToastContextValue {
  showSuccessToast: (message: string, options?: { undoAction?: UndoAction }) => void;
  showErrorToast: (message: string, details?: string) => void;
  showInfoToast: (message: string, details?: string) => void;
  showWarningToast: (message: string, details?: string) => void;
  showUndoToast: (message: string, undoAction: UndoAction) => void;
}

const EnhancedToastContext = createContext<EnhancedToastContextValue | undefined>(undefined);

export function EnhancedToastProvider({ children }: { children: ReactNode }) {
  const { toast } = useToastPrimitive();
  const [undoTimeouts, setUndoTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const clearUndoTimeout = useCallback((id: string) => {
    const timeout = undoTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      setUndoTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, [undoTimeouts]);

  const showSuccessToast = useCallback((message: string, options?: { undoAction?: UndoAction }) => {
    const toastId = `success-${Date.now()}`;
    
    toast({
      title: "Success!",
      description: message,
      variant: "default",
    });

    // If there's an undo action, show it in a separate toast
    if (options?.undoAction) {
      const timeout = setTimeout(() => {
        clearUndoTimeout(toastId);
      }, options.undoAction.timeoutMs || 5000);
      
      setUndoTimeouts(prev => new Map(prev).set(toastId, timeout));
    }
  }, [toast, clearUndoTimeout]);

  const showErrorToast = useCallback((message: string, details?: string) => {
    toast({
      title: "Error",
      description: details ? `${message} ${details}` : message,
      variant: "destructive",
    });
  }, [toast]);

  const showInfoToast = useCallback((message: string, details?: string) => {
    toast({
      title: "Info",
      description: details ? `${message} ${details}` : message,
      variant: "default",
    });
  }, [toast]);

  const showWarningToast = useCallback((message: string, details?: string) => {
    toast({
      title: "Warning",
      description: details ? `${message} ${details}` : message,
      variant: "default",
    });
  }, [toast]);

  const showUndoToast = useCallback((message: string, undoAction: UndoAction) => {
    showSuccessToast(message, { undoAction });
  }, [showSuccessToast]);

  const value = {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    showUndoToast,
  };

  return createElement(EnhancedToastContext.Provider, { value }, children);
}

export function useEnhancedToast() {
  const context = useContext(EnhancedToastContext);
  if (!context) {
    throw new Error('useEnhancedToast must be used within an EnhancedToastProvider');
  }
  return context;
}

// Convenience hook for common toast patterns
export function useActionToasts() {
  const enhancedToast = useEnhancedToast();

  const showCreateSuccess = useCallback((itemName: string, itemType: string) => {
    enhancedToast.showSuccessToast(`${itemType} "${itemName}" has been created successfully.`);
  }, [enhancedToast]);

  const showUpdateSuccess = useCallback((itemName: string, itemType: string, undoAction?: UndoAction) => {
    enhancedToast.showSuccessToast(`${itemType} "${itemName}" has been updated successfully.`, {
      undoAction
    });
  }, [enhancedToast]);

  const showDeleteSuccess = useCallback((itemName: string, itemType: string, undoAction: UndoAction) => {
    enhancedToast.showUndoToast(`${itemType} "${itemName}" has been deleted.`, undoAction);
  }, [enhancedToast]);

  const showArchiveSuccess = useCallback((itemName: string, itemType: string, undoAction: UndoAction) => {
    enhancedToast.showUndoToast(`${itemType} "${itemName}" has been archived.`, undoAction);
  }, [enhancedToast]);

  const showCreateError = useCallback((itemType: string, error?: string) => {
    enhancedToast.showErrorToast(`Failed to create ${itemType.toLowerCase()}.`, error);
  }, [enhancedToast]);

  const showUpdateError = useCallback((itemType: string, error?: string) => {
    enhancedToast.showErrorToast(`Failed to update ${itemType.toLowerCase()}.`, error);
  }, [enhancedToast]);

  const showDeleteError = useCallback((itemType: string, error?: string) => {
    enhancedToast.showErrorToast(`Failed to delete ${itemType.toLowerCase()}.`, error);
  }, [enhancedToast]);

  return {
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,
    showArchiveSuccess,
    showCreateError,
    showUpdateError,
    showDeleteError,
  };
}
