'use client';

import { useGlobalErrorHandler } from '@/hooks/use-error-handler';
import { useEffect } from 'react';

export function GlobalErrorHandler() {
  useGlobalErrorHandler();

  useEffect(() => {
    // Additional error handling setup
    console.log('Global error handler initialized');
  }, []);

  return null;
}
