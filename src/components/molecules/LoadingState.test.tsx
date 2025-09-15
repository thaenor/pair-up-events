import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LoadingState from './LoadingState';


// Mock the LoadingSpinner component
vi.mock('../atoms/LoadingSpinner', () => ({
  default: vi.fn(({ size }) => <div data-testid="loading-spinner" data-size={size}></div>),
}));

describe('LoadingState', () => {
  it('renders the message correctly', () => {
    render(<LoadingState message="Custom Loading Message" />);
    expect(screen.getByText('Custom Loading Message')).toBeInTheDocument();
  });

  it('applies page type classes', () => {
    render(<LoadingState type="page" />);
    const container = screen.getByText('Loading...').closest('div');
    expect(container).toHaveClass('min-h-screen bg-pairup-darkBlue');
    expect(screen.getByText('Loading...')).toHaveClass('text-lg');
  });

  it('applies section type classes', () => {
    render(<LoadingState type="section" />);
    const container = screen.getByText('Loading...').closest('div');
    expect(container).toHaveClass('min-h-[200px] rounded-lg border border-border bg-card');
    expect(screen.getByText('Loading...')).toHaveClass('text-base');
  });

  it('applies component type classes', () => {
    render(<LoadingState type="component" />);
    const container = screen.getByText('Loading...').closest('div');
    expect(container).toHaveClass('min-h-[100px] rounded border border-border/50 bg-muted/50');
    expect(screen.getByText('Loading...')).toHaveClass('text-sm');
  });

  it('applies inline type classes', () => {
    render(<LoadingState type="inline" />);
    const container = screen.getByText('Loading...').closest('div');
    expect(container).toHaveClass('py-4');
    expect(screen.getByText('Loading...')).toHaveClass('text-sm');
  });

  it('passes the size prop to LoadingSpinner', () => {
    render(<LoadingState size="lg" />);
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute('data-size', 'lg');
  });

  it('applies custom className', () => {
    render(<LoadingState className="custom-class" />);
    const container = screen.getByText('Loading...').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
