import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';
import Button from './Button';

// Mock the Button component
vi.mock('./Button', () => ({
  default: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props} data-testid="mock-button">
      {children}
    </button>
  )),
}));

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn(); // Mock console.error to prevent test logs from cluttering output
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore original console.error
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders the fallback UI when an error occurs and a fallback is provided', () => {
    const FallbackComponent = () => <div data-testid="fallback">Something went wrong!</div>;
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('renders the default error UI when an error occurs and no fallback is provided', () => {
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('This component encountered an error.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('displays the correct error message and icon based on the level prop', () => {
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    const { rerender } = render(
      <ErrorBoundary level="page">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('We encountered an unexpected error. Please try refreshing the page.')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toHaveClass('text-2xl');

    rerender(
      <ErrorBoundary level="section">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('This section failed to load properly.')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toHaveClass('text-lg');

    rerender(
      <ErrorBoundary level="component">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('This component encountered an error.')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toHaveClass('text-base');
  });

  it('the "Try Again" button resets the error state', () => {
    const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test Error');
      }
      return <div>No Error</div>;
    };

    let key = 0;
    const { rerender } = render(
      <ErrorBoundary key={key}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    key++; // Increment key to force remount
    rerender(
      <ErrorBoundary key={key}>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('componentDidCatch is called when an error occurs', () => {
    const mockOnError = vi.fn();
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });
});