import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoadingSpinner from './LoadingSpinner';
import { Loader2 } from 'lucide-react';

// Mock the Loader2 component
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Loader2: vi.fn((props) => <div data-testid="mock-loader2" {...props} />),
  };
});

describe('LoadingSpinner', () => {
  it('renders the Loader2 icon', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('mock-loader2')).toBeInTheDocument();
  });

  it('applies the correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="xs" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-3 w-3');

    rerender(<LoadingSpinner size="sm" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-6 w-6');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-8 w-8');

    rerender(<LoadingSpinner size="xl" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-12 w-12');

    rerender(<LoadingSpinner size="xxl" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-16 w-16');

    rerender(<LoadingSpinner size="xxxl" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-24 w-24');

    rerender(<LoadingSpinner size="hero" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-64 w-64 md:h-80 md:w-80');

    rerender(<LoadingSpinner size="invalid" />); // Test default case
    expect(screen.getByTestId('mock-loader2')).toHaveClass('h-6 w-6');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByTestId('mock-loader2')).toHaveClass('custom-class');
  });
});
