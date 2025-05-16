
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  it('renders correctly', () => {
    render(<Navbar />);
    expect(screen.getByText(/Pair/i)).toBeInTheDocument();
    expect(screen.getByText(/Up Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
    expect(screen.getByText(/Benefits/i)).toBeInTheDocument();
    expect(screen.getByText(/Early Access/i)).toBeInTheDocument();
  });
});
