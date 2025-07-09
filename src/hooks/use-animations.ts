import { useEffect, useState } from 'react';

/**
 * Custom hook for form field animations and micro-interactions
 */
export function useFormAnimations() {
  const [fieldStates, setFieldStates] = useState<Record<string, 'idle' | 'focused' | 'error' | 'success'>>({});

  const setFieldState = (fieldName: string, state: 'idle' | 'focused' | 'error' | 'success') => {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: state
    }));
  };

  const getFieldAnimationClass = (fieldName: string) => {
    const state = fieldStates[fieldName] || 'idle';

    switch (state) {
      case 'focused':
        return 'ring-2 ring-blue-500 ring-opacity-50 scale-[1.02] transition-all duration-200';
      case 'error':
        return 'ring-2 ring-red-500 ring-opacity-50 animate-shake transition-all duration-200';
      case 'success':
        return 'ring-2 ring-green-500 ring-opacity-50 transition-all duration-200';
      default:
        return 'transition-all duration-200';
    }
  };

  return {
    setFieldState,
    getFieldAnimationClass
  };
}

/**
 * Custom hook for button loading states and animations
 */
export function useButtonAnimations() {
  const [buttonStates, setButtonStates] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const setButtonState = (buttonId: string, state: 'idle' | 'loading' | 'success' | 'error') => {
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: state
    }));
  };

  const getButtonAnimationClass = (buttonId: string) => {
    const state = buttonStates[buttonId] || 'idle';

    switch (state) {
      case 'loading':
        return 'animate-pulse cursor-not-allowed opacity-70';
      case 'success':
        return 'animate-bounce bg-green-600 hover:bg-green-700';
      case 'error':
        return 'animate-shake bg-red-600 hover:bg-red-700';
      default:
        return 'hover:scale-105 active:scale-95 transition-all duration-200';
    }
  };

  return {
    setButtonState,
    getButtonAnimationClass
  };
}

/**
 * Custom hook for card hover effects and animations
 */
export function useCardAnimations() {
  const getCardHoverClass = () => {
    return 'hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 ease-out';
  };

  const getCardFocusClass = () => {
    return 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all duration-200';
  };

  return {
    getCardHoverClass,
    getCardFocusClass
  };
}

/**
 * Custom hook for page transition animations
 */
export function usePageTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const getPageTransitionClass = () => {
    return isTransitioning
      ? 'opacity-0 translate-y-4 transition-all duration-300'
      : 'opacity-100 translate-y-0 transition-all duration-300';
  };

  return {
    startTransition,
    endTransition,
    getPageTransitionClass,
    isTransitioning
  };
}
