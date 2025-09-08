import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './date-picker';
import { format } from 'date-fns';

// Mock Radix UI components and other dependencies
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, className }) => (
    <button onClick={onClick} className={className} data-testid="mock-button">
      {children}
    </button>
  )),
}));

vi.mock('@/components/ui/calendar', () => ({
  Calendar: vi.fn(({ onSelect }) => (
    <div data-testid="mock-calendar" onClick={() => onSelect(new Date(2024, 0, 1))}></div>
  )),
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: vi.fn(({ children }) => <div data-testid="mock-popover">{children}</div>),
  PopoverTrigger: vi.fn(({ children }) => <div data-testid="mock-popover-trigger">{children}</div>),
  PopoverContent: vi.fn(({ children }) => <div data-testid="mock-popover-content">{children}</div>),
}));

describe('DatePicker', () => {
  it('renders "Pick a date" when no date is selected', () => {
    render(<DatePicker date={undefined} setDate={vi.fn()} />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders the formatted date when a date is selected', () => {
    const selectedDate = new Date(2023, 10, 15);
    render(<DatePicker date={selectedDate} setDate={vi.fn()} />);
    expect(screen.getByText(format(selectedDate, 'PPP'))).toBeInTheDocument();
  });

  it('opens the calendar popover when the button is clicked', () => {
    render(<DatePicker date={undefined} setDate={vi.fn()} />);
    fireEvent.click(screen.getByTestId('mock-button'));
    expect(screen.getByTestId('mock-popover-content')).toBeInTheDocument();
  });

  it('calls setDate when a date is selected from the calendar', () => {
    const mockSetDate = vi.fn();
    render(<DatePicker date={undefined} setDate={mockSetDate} />);
    fireEvent.click(screen.getByTestId('mock-button')); // Open popover
    fireEvent.click(screen.getByTestId('mock-calendar')); // Select date
    expect(mockSetDate).toHaveBeenCalledTimes(1);
    expect(mockSetDate).toHaveBeenCalledWith(new Date(2024, 0, 1));
  });
});
