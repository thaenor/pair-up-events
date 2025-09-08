import { render, screen } from '@testing-library/react';
import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  it('renders the left content', () => {
    render(<AuthLayout left={<div data-testid="left-content">Left Side</div>} />);
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByText('Left Side')).toBeInTheDocument();
  });

  it('renders both mobile and desktop logo images', () => {
    render(<AuthLayout left={null} />);
    const images = screen.getAllByAltText('PairUp Events');
    expect(images.length).toBe(2);
    // Mobile logo
    expect(images[0]).toHaveAttribute('src', '/Header Logo Mobile.png');
    // Desktop logo
    expect(images[1]).toHaveAttribute('src', '/Header Logo Desktop.png');
  });
});
