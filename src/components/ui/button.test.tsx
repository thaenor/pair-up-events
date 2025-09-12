
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Button } from './button';

describe('Button', () => {
  it('renders a button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies variant and size classes correctly', () => {
    render(<Button variant="destructive" size="lg">Destructive Button</Button>);
    const button = screen.getByRole('button', { name: /destructive button/i });
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('h-11');
  });

  it('renders as a child component when asChild is true', () => {
    render(<Button asChild><a>Link</a></Button>);
    const link = screen.getByText(/link/i);
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute('type', 'button');
  });

  it('passes through other HTML attributes', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it('forwards the ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
