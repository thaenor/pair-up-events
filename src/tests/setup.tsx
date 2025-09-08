import '@testing-library/jest-dom';
import { vi } from 'vitest';

const MOBILE_BREAKPOINT = 768;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    get matches() {
      return window.innerWidth < MOBILE_BREAKPOINT;
    },
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
