import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage focus for form accessibility
 */
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement | null>(null);

  const setFocusTarget = (element: HTMLElement | null) => {
    focusRef.current = element;
  };

  const focusTarget = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };

  const focusFirstError = (errors: Record<string, any>) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return {
    setFocusTarget,
    focusTarget,
    focusFirstError
  };
}

/**
 * Custom hook to provide skip links for better keyboard navigation
 */
export function useSkipLinks() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S to skip to main content
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
        }
      }

      // Alt + N to skip to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const navigation = document.querySelector('nav') || document.querySelector('[role="navigation"]');
        if (navigation) {
          (navigation as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

/**
 * Custom hook to announce form status to screen readers
 */
export function useFormAnnouncements() {
  const announce = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}
