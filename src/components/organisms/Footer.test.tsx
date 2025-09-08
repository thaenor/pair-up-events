import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the logo and description', () => {
    render(<Footer />);
    expect(screen.getByText('You and your friend meet another pair for a shared activity')).toBeInTheDocument();
  });

  it('renders all the links', () => {
    render(<Footer />);
    expect(screen.getByText('How it Works')).toBeInTheDocument();
    expect(screen.getByText('Create an Event')).toBeInTheDocument();
    expect(screen.getByText('Join an Event')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });

  it('displays the current year in the copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Pair Up Events. All rights reserved.`)).toBeInTheDocument();
  });
});
