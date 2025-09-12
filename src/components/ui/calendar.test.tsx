
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('renders the calendar with default props', () => {
    render(<Calendar />);
    expect(screen.getByText(/(\w+ )\d{4}/)).toBeInTheDocument();
  });

  it('navigates between months', () => {
    render(<Calendar />);
    const nextButton = screen.getByRole('button', { name: /Go to the Next Month/i });
    const prevButton = screen.getByRole('button', { name: /Go to the Previous Month/i });

    fireEvent.click(nextButton);
    expect(screen.getByText(/(\w+ )\d{4}/)).not.toBe(null);

    fireEvent.click(prevButton);
    expect(screen.getByText(/(\w+ )\d{4}/)).not.toBe(null);
  });

  it('selects a day', () => {
    render(<Calendar mode="single" />);
    const day = screen.getByText('15');
    fireEvent.click(day);
    const button = screen.getByRole('gridcell', { name: /15/i, selected: true });
    expect(button).toBeInTheDocument()
  });

  it('applies custom class names', () => {
    const { container } = render(<Calendar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
