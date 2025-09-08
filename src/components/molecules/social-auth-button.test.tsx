import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SocialAuthButton } from './social-auth-button';

describe('SocialAuthButton', () => {
  const mockIcon = <svg data-testid="mock-icon" />;

  it('renders the icon and label correctly', () => {
    render(<SocialAuthButton icon={mockIcon} label="Sign in with Google" />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<SocialAuthButton icon={mockIcon} label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <SocialAuthButton icon={mockIcon} label="Custom Class" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
