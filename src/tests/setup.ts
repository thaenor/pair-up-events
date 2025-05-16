
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "0px";
  thresholds = [0];
  
  constructor(callback: IntersectionObserverCallback) {
    // Store the callback but don't use it in this mock
    this._callback = callback;
  }
  
  private _callback: IntersectionObserverCallback = () => {};
  
  observe() { return; }
  unobserve() { return; }
  disconnect() { return; }
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
