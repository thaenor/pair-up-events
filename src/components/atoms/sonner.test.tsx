import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toaster } from './sonner';
import { toast } from '@/lib/sonner-toast';
import { useTheme } from 'next-themes';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('Toaster', () => {
  it('renders with the light theme', async () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
    render(<Toaster />);
    toast('test');
    const region = await screen.findByRole('region');
    const list = within(region).getByRole('list');
    expect(list).toHaveAttribute('data-theme', 'light');
  });

  it('renders with the dark theme', async () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });
    render(<Toaster />);
    toast('test');
    const region = await screen.findByRole('region');
    const list = within(region).getByRole('list');
    expect(list).toHaveAttribute('data-theme', 'dark');
  });

  it('renders with the system theme by default (dark)', async () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'system' });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    render(<Toaster />);
    toast('test');
    const region = await screen.findByRole('region');
    const list = within(region).getByRole('list');
    expect(list).toHaveAttribute('data-theme', 'dark');
  });

  it('renders with the system theme by default (light)', async () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'system' });
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
    render(<Toaster />);
    toast('test');
    const region = await screen.findByRole('region');
    const list = within(region).getByRole('list');
    expect(list).toHaveAttribute('data-theme', 'light');
  });
});