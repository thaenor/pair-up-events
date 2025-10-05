import { useCallback, useRef } from 'react';

/**
 * Hook for accessibility utilities and keyboard navigation
 */
export const useAccessibility = () => {
  /**
   * Trap focus within a container (useful for modals, dropdowns)
   */
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Announce messages to screen readers
   */
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  /**
   * Handle escape key to close modals/dropdowns
   */
  const useEscapeKey = useCallback((callback: () => void) => {
    return () => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          callback();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  /**
   * Handle arrow key navigation for lists/menus
   */
  const useArrowKeyNavigation = useCallback((
    items: HTMLElement[],
    onSelect: (index: number) => void,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    return (e: KeyboardEvent) => {
      const currentIndex = items.findIndex(item => item === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (orientation === 'vertical') {
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
          nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        }
      } else {
        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % items.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(currentIndex);
        return;
      }

      if (nextIndex !== currentIndex) {
        e.preventDefault();
        items[nextIndex]?.focus();
      }
    };
  }, []);

  /**
   * Skip to main content functionality
   */
  const createSkipLink = useCallback((targetId: string, label: string = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = label;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pairup-cyan text-pairup-darkBlue px-4 py-2 rounded-md font-medium z-50';
    skipLink.setAttribute('tabindex', '1');

    return skipLink;
  }, []);

  return {
    trapFocus,
    announceToScreenReader,
    useEscapeKey,
    useArrowKeyNavigation,
    createSkipLink,
  };
};

/**
 * Hook for managing focus states
 */
export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
    focusElement,
  };
};
