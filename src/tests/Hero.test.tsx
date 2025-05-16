
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Hero from '@/components/Hero';

describe('Hero', () => {
  it('renders correctly', () => {
    render(<Hero />);
    expect(screen.getByText(/Grab your friend/i)).toBeInTheDocument();
    expect(screen.getByText(/and meet another pair./i)).toBeInTheDocument();
    expect(screen.getByText(/Create an Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse through existing events/i)).toBeInTheDocument();
  });

  it('buttons scroll to early access section', () => {
    // Mock document.getElementById
    document.getElementById = vi.fn().mockImplementation((id) => {
      if (id === 'early-access') {
        return {
          scrollIntoView: vi.fn()
        };
      }
      return null;
    });

    render(<Hero />);
    
    const createEventButton = screen.getByText(/Create an Event/i);
    fireEvent.click(createEventButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('early-access');
    
    const browseEventsButton = screen.getByText(/Browse through existing events/i);
    fireEvent.click(browseEventsButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('early-access');
  });
});
