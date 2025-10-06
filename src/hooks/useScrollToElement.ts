import { logError } from '@/utils/logger';
import { useCallback, useRef } from 'react';

/**
 * Custom hook for React-based scrolling to elements
 * Replaces direct DOM manipulation with React patterns
 */
export const useScrollToElement = () => {
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Register an element with a unique ID
  const registerElement = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      elementRefs.current.set(id, element);
    } else {
      elementRefs.current.delete(id);
    }
  }, []);

  // Scroll to a registered element
  const scrollToElement = useCallback((id: string, options?: ScrollIntoViewOptions) => {
    const element = elementRefs.current.get(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options,
      });
    } else {
      logError(`Element with id "${id}" not found in registered elements`, null, {
        component: 'useScrollToElement',
        action: 'scrollToElement',
        additionalData: { id },
      });
    }
  }, []);

  // Create a ref callback for easy element registration
  const createElementRef = useCallback((id: string) => {
    return (element: HTMLElement | null) => {
      registerElement(id, element);
    };
  }, [registerElement]);

  return {
    scrollToElement,
    registerElement,
    createElementRef,
  };
};

export default useScrollToElement;
