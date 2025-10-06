import { logError } from '@/utils/logger';
import { useCallback, useRef } from 'react';

/**
 * Custom hook for React-based scrolling to elements
 * Replaces direct DOM manipulation with React patterns
 */
const globalElementRegistry = new Map<string, HTMLElement>();
const fallbackElementCache = new Map<string, HTMLElement>();

type PendingScrollRequest = {
  options?: ScrollIntoViewOptions;
  expiresAt: number;
};

const pendingScrollRequests = new Map<string, PendingScrollRequest>();

const MAX_SCROLL_ATTEMPTS = 5;
const BASE_RETRY_DELAY = 75;
const PENDING_REQUEST_TTL = 1_500;
const isTestEnvironment =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

const isElementConnected = (element: HTMLElement | undefined | null) => {
  return Boolean(element && element.isConnected);
};

const getFallbackSelector = (id: string) => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(id);
  }

  return id.replace(/["'`]/g, '\\$&');
};

const performScrollIntoView = (
  element: HTMLElement,
  options?: ScrollIntoViewOptions
) => {
  if (typeof window === 'undefined') {
    return false;
  }

  const scrollOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    ...options,
  };

  if (isTestEnvironment || typeof window.requestAnimationFrame !== 'function') {
    element.scrollIntoView(scrollOptions);
  } else {
    window.requestAnimationFrame(() => {
      element.scrollIntoView(scrollOptions);
    });
  }

  return true;
};

export const useScrollToElement = () => {
  const elementRefs = useRef<Map<string, HTMLElement>>(globalElementRegistry);

  const resolveElement = useCallback((id: string): HTMLElement | null => {
    const registeredElement = elementRefs.current.get(id);

    if (!isElementConnected(registeredElement)) {
      if (registeredElement) {
        elementRefs.current.delete(id);
      }
    } else if (registeredElement) {
      return registeredElement;
    }

    const cachedElement = fallbackElementCache.get(id);

    if (!isElementConnected(cachedElement)) {
      if (cachedElement) {
        fallbackElementCache.delete(id);
      }
    } else if (cachedElement) {
      return cachedElement;
    }

    if (typeof document === 'undefined') {
      return null;
    }

    const directMatch = document.getElementById(id) as HTMLElement | null;

    if (directMatch) {
      fallbackElementCache.set(id, directMatch);
      return directMatch;
    }

    const escapedId = getFallbackSelector(id);
    const dataAttributeMatch = document.querySelector(
      `[data-scroll-target="${escapedId}"]`
    ) as HTMLElement | null;

    if (dataAttributeMatch) {
      fallbackElementCache.set(id, dataAttributeMatch);
      return dataAttributeMatch;
    }

    const namedAnchorMatch = document.querySelector(
      `[name="${escapedId}"]`
    ) as HTMLElement | null;

    if (namedAnchorMatch) {
      fallbackElementCache.set(id, namedAnchorMatch);
      return namedAnchorMatch;
    }

    return null;
  }, []);

  const registerElement = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      elementRefs.current.set(id, element);
      fallbackElementCache.set(id, element);

      const pendingRequest = pendingScrollRequests.get(id);

      if (
        pendingRequest &&
        pendingRequest.expiresAt >= Date.now()
      ) {
        performScrollIntoView(element, pendingRequest.options);
      }

      pendingScrollRequests.delete(id);
    } else {
      elementRefs.current.delete(id);
      fallbackElementCache.delete(id);
    }
  }, []);

  const scrollToElement = useCallback(
    (id: string, options?: ScrollIntoViewOptions, attempt = 0): boolean => {
      const element = resolveElement(id);

      if (element) {
        return performScrollIntoView(element, options);
      }

      const pendingRequest = pendingScrollRequests.get(id);

      if (!pendingRequest || pendingRequest.expiresAt < Date.now()) {
        pendingScrollRequests.set(id, {
          options,
          expiresAt: Date.now() + PENDING_REQUEST_TTL,
        });
      }

      if (
        !isTestEnvironment &&
        typeof window !== 'undefined' &&
        attempt < MAX_SCROLL_ATTEMPTS
      ) {
        window.setTimeout(() => {
          scrollToElement(id, options, attempt + 1);
        }, BASE_RETRY_DELAY * Math.max(1, attempt + 1));
        return false;
      }

      logError(`Element with id "${id}" not found in registered elements`, null, {
        component: 'useScrollToElement',
        action: 'scrollToElement',
        additionalData: { id, attempt },
      });

      pendingScrollRequests.delete(id);

      return false;
    },
    [resolveElement]
  );

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

export const __dangerousResetScrollCachesForTest = () => {
  if (!isTestEnvironment) {
    return;
  }

  globalElementRegistry.clear();
  fallbackElementCache.clear();
  pendingScrollRequests.clear();
};

export default useScrollToElement;
