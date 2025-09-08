import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  let matchMediaSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset window.innerWidth before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });

    // Mock window.matchMedia locally for each test
    matchMediaSpy = vi.fn().mockImplementation(query => ({
      matches: window.innerWidth < 768, // Directly use the breakpoint
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaSpy,
    });
  });

  afterEach(() => {
    // Restore original window.innerWidth after each test
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
    // No need to restore window.matchMedia as it's mocked locally in beforeEach
  });

  it('returns true when screen width is less than mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 700 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when screen width is greater than or equal to mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates the value when screen width changes', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 700 });
    // We'll keep a reference to the last created mql
    type MediaQueryListEvent = { matches: boolean };
    let mql: {
      matches: boolean;
      media: string;
      onchange: null;
      addListener: () => void;
      removeListener: () => void;
      addEventListener: (event: string, handler: (e: MediaQueryListEvent) => void) => void;
      removeEventListener: () => void;
      dispatchEvent: () => void;
      _handler: ((e: MediaQueryListEvent) => void) | null;
    };
    matchMediaSpy.mockImplementation(query => {
      mql = {
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') mql._handler = handler;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        _handler: null,
      };
      return mql;
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
      // Simulate matchMedia change event
      if (mql._handler) mql._handler({ matches: false });
    });
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 700 });
      if (mql._handler) mql._handler({ matches: true });
    });
    expect(result.current).toBe(true);
  });
});
