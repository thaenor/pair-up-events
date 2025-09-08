import { render, screen } from '@testing-library/react';
import EarlyAccessSection from './EarlyAccessSection';

describe('EarlyAccessSection', () => {
  it('renders the section with heading and description', () => {
    render(<EarlyAccessSection />);
    expect(screen.getByRole('heading', { name: /get early access/i })).toBeInTheDocument();
    expect(screen.getByText(/be the first to know when we launch/i)).toBeInTheDocument();
  });

  it('renders the iframe with correct src and title', () => {
    render(<EarlyAccessSection />);
    const iframe = screen.getByTitle('Brevo Subscription Form');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('sibforms.com/serve'));
    expect(iframe).toHaveAttribute('width', '540');
    expect(iframe).toHaveAttribute('height', '500');
  });
});
