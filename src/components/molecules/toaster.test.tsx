import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toaster } from './toaster';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Toaster', () => {
  it('renders no toasts when the toasts array is empty', () => {
    (useToast as jest.Mock).mockReturnValue({ toasts: [] });
    render(<Toaster />);
    expect(screen.queryByTestId('toast-root')).not.toBeInTheDocument();
  });

  it('renders a single toast with title and description', async () => {
    (useToast as jest.Mock).mockReturnValue({
      toasts: [
        {
          id: '1',
          title: 'Test Title',
          description: 'Test Description',
        },
      ],
    });
    render(<Toaster />);
    expect(await screen.findByTestId('toast-root')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders a toast with an action button', async () => {
    (useToast as jest.Mock).mockReturnValue({
      toasts: [
        {
          id: '2',
          title: 'Action Toast',
          action: <button data-testid="action-button">Click Me</button>,
        },
      ],
    });
    render(<Toaster />);
    expect(await screen.findByTestId('toast-root')).toBeInTheDocument();
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple toasts', async () => {
    (useToast as jest.Mock).mockReturnValue({
      toasts: [
        { id: '3', title: 'Toast 1' },
        { id: '4', title: 'Toast 2' },
      ],
    });
    render(<Toaster />);
    expect(await screen.findByText('Toast 1')).toBeInTheDocument();
    expect(await screen.findByText('Toast 2')).toBeInTheDocument();
  });
});
