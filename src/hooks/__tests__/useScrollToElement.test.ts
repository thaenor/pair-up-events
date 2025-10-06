import { renderHook, act } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import { logError } from '@/utils/logger';

type ScrollModule = typeof import('../useScrollToElement');

vi.mock('@/utils/logger', () => ({
  logError: vi.fn(),
}));

const ORIGINAL_ENV = process.env.NODE_ENV;

describe('useScrollToElement in test environment', () => {
  let useScrollToElementHook: ScrollModule['useScrollToElement'];
  let resetScrollCaches: ScrollModule['__dangerousResetScrollCachesForTest'];

  beforeEach(async () => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';

    const module: ScrollModule = await import('../useScrollToElement');

    useScrollToElementHook = module.useScrollToElement;
    resetScrollCaches = module.__dangerousResetScrollCachesForTest;

    resetScrollCaches();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('scrolls to registered elements with smooth behavior', () => {
    const element = document.createElement('div') as HTMLElement & {
      scrollIntoView: ReturnType<typeof vi.fn>;
    };

    element.scrollIntoView = vi.fn();
    document.body.appendChild(element);

    const { result } = renderHook(() => useScrollToElementHook());

    act(() => {
      result.current.registerElement('benefits', element);
    });

    const success = result.current.scrollToElement('benefits');

    expect(success).toBe(true);
    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('falls back to DOM lookups when no registered element exists', () => {
    const element = document.createElement('section') as HTMLElement & {
      scrollIntoView: ReturnType<typeof vi.fn>;
    };

    element.id = 'benefits';
    element.setAttribute('data-scroll-target', 'benefits');
    element.scrollIntoView = vi.fn();

    document.body.appendChild(element);

    const { result } = renderHook(() => useScrollToElementHook());
    const success = result.current.scrollToElement('benefits');

    expect(success).toBe(true);
    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('logs an error if the element cannot be found', () => {
    const { result } = renderHook(() => useScrollToElementHook());

    const success = result.current.scrollToElement('missing');

    expect(success).toBe(false);
    expect(logError).toHaveBeenCalledWith(
      'Element with id "missing" not found in registered elements',
      null,
      {
        action: 'scrollToElement',
        additionalData: { id: 'missing', attempt: 0 },
        component: 'useScrollToElement',
      }
    );
  });
});

describe('useScrollToElement in production environment', () => {
  let useScrollToElementHook: ScrollModule['useScrollToElement'];

  beforeEach(async () => {
    vi.resetModules();
    process.env.NODE_ENV = 'production';

    const module: ScrollModule = await import('../useScrollToElement');

    useScrollToElementHook = module.useScrollToElement;
    vi.clearAllMocks();
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env.NODE_ENV = ORIGINAL_ENV;
    document.body.innerHTML = '';
  });

  it('retries pending scroll requests until a late element registration occurs', () => {
    const element = document.createElement('div') as HTMLElement & {
      scrollIntoView: ReturnType<typeof vi.fn>;
    };

    element.scrollIntoView = vi.fn();
    document.body.appendChild(element);

    const originalRAF = window.requestAnimationFrame;
    const requestAnimationFrameSpy = vi.fn<(callback: FrameRequestCallback) => number>(
      (callback) => {
        callback(performance.now());
        return 1;
      }
    );

    window.requestAnimationFrame = requestAnimationFrameSpy;

    const { result } = renderHook(() => useScrollToElementHook());

    act(() => {
      const immediateResult = result.current.scrollToElement('delayed');
      expect(immediateResult).toBe(false);
    });

    expect(logError).not.toHaveBeenCalled();

    act(() => {
      result.current.registerElement('delayed', element);
    });

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    vi.runOnlyPendingTimers();

    expect(logError).not.toHaveBeenCalled();

    if (originalRAF) {
      window.requestAnimationFrame = originalRAF;
    } else {
      // @ts-expect-error - allow cleanup when RAF was undefined
      delete window.requestAnimationFrame;
    }
  });
});

afterAll(() => {
  process.env.NODE_ENV = ORIGINAL_ENV;
  document.body.innerHTML = '';
});
