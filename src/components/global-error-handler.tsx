'use client';

import { useEffect } from 'react';
import { useGlobalErrorHandler } from '@/hooks/use-error-handler';

export function GlobalErrorHandler() {
  useGlobalErrorHandler();

  useEffect(() => {
    // Additional error handling setup
    console.log('Global error handler initialized');
  }, []);

  return null;
}
