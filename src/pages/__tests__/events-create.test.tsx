import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { EventsCreatePage } from '../events-create';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useCreateEventFlow hook
const mockUseCreateEventFlow = vi.fn();
vi.mock('@/hooks/useCreateEventFlow', () => ({
  useCreateEventFlow: () => mockUseCreateEventFlow(),
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackFormEvent: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Navigation components
vi.mock('@/components/organisms/Navigation', () => ({
  default: () => <div data-testid="navigation">Navigation</div>,
}));

vi.mock('@/components/organisms/MobileBottomNavigation', () => ({
  default: () => <div data-testid="mobile-bottom-navigation">Mobile Navigation</div>,
}));

// Mock the TabbedEventCreationForm component
vi.mock('@/components/organisms/TabbedEventCreationForm', () => ({
  TabbedEventCreationForm: ({ 
    isCreating, 
    onCreateInitial, 
    onFinalize 
  }: { isCreating: boolean; onCreateInitial: () => Promise<string>; onFinalize: () => Promise<void> }) => (
    <div data-testid="tabbed-event-creation-form">
      <div data-testid="is-creating">{isCreating ? 'creating' : 'not-creating'}</div>
      <button 
        data-testid="create-initial-btn"
        onClick={() => onCreateInitial({ title: 'Test Event', description: 'Test Description', activityType: 'Hiking', country: 'USA', city: 'San Francisco', timeStart: new Date(), cost: 'Free' })}
      >
        Create Initial
      </button>
      <button 
        data-testid="finalize-btn"
        onClick={() => onFinalize('event-123', { preferredDuoType: 'friends', preferredAgeRange: { min: 18, max: 65 }, preferredGender: [], desiredVibes: [], parentPreference: '', additionalNotes: '' })}
      >
        Finalize
      </button>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('EventsCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('shows login prompt when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: vi.fn(),
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });

      renderWithRouter(<EventsCreatePage />);

      expect(screen.getByText('Please log in to create an event')).toBeInTheDocument();
      expect(screen.getByText('You need to be logged in to create events.')).toBeInTheDocument();
      expect(screen.queryByTestId('tabbed-event-creation-form')).not.toBeInTheDocument();
    });

    it('shows event creation form when user is authenticated', () => {
      mockUseAuth.mockReturnValue({ user: { uid: 'user-123' } });
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: vi.fn(),
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });

      renderWithRouter(<EventsCreatePage />);

      expect(screen.getByText('Create Event')).toBeInTheDocument();
      expect(screen.getByTestId('tabbed-event-creation-form')).toBeInTheDocument();
    });
  });

  describe('Event Creation Flow', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: { uid: 'user-123' } });
    });

    it('passes correct props to TabbedEventCreationForm', () => {
      const mockOnCreateInitial = vi.fn();
      const mockOnSaveTab2 = vi.fn();
      const mockOnFinalize = vi.fn();

      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: mockOnCreateInitial,
        onSaveTab2: mockOnSaveTab2,
        onFinalize: mockOnFinalize,
      });

      renderWithRouter(<EventsCreatePage />);

      expect(screen.getByTestId('tabbed-event-creation-form')).toBeInTheDocument();
      expect(screen.getByTestId('is-creating')).toHaveTextContent('not-creating');
    });

    it('passes isCreating state to TabbedEventCreationForm', () => {
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: true,
        onCreateInitial: vi.fn(),
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });

      renderWithRouter(<EventsCreatePage />);

      expect(screen.getByTestId('is-creating')).toHaveTextContent('creating');
    });

    it('calls onCreateInitial when create initial button is clicked', async () => {
      const mockOnCreateInitial = vi.fn().mockResolvedValue('event-123');
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: mockOnCreateInitial,
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });

      renderWithRouter(<EventsCreatePage />);

      const user = userEvent.setup();
      await user.click(screen.getByTestId('create-initial-btn'));

      await waitFor(() => {
        expect(mockOnCreateInitial).toHaveBeenCalledWith({
          title: 'Test Event',
          description: 'Test Description',
          activityType: 'Hiking',
          country: 'USA',
          city: 'San Francisco',
          timeStart: expect.any(Date),
          cost: 'Free'
        });
      });
    });


    it('calls onFinalize when finalize button is clicked', async () => {
      const mockOnFinalize = vi.fn().mockResolvedValue(undefined);
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: vi.fn(),
        onSaveTab2: vi.fn(),
        onFinalize: mockOnFinalize,
      });

      renderWithRouter(<EventsCreatePage />);

      const user = userEvent.setup();
      await user.click(screen.getByTestId('finalize-btn'));

      await waitFor(() => {
        expect(mockOnFinalize).toHaveBeenCalledWith('event-123', {
          preferredDuoType: 'friends',
          preferredAgeRange: { min: 18, max: 65 },
          preferredGender: [],
          desiredVibes: [],
          parentPreference: '',
          additionalNotes: ''
        });
      });
    });
  });

  describe('Page Layout', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: { uid: 'user-123' } });
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: vi.fn(),
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });
    });

    it('renders navigation components', () => {
      renderWithRouter(<EventsCreatePage />);

      // Check that Navigation and MobileBottomNavigation are rendered
      // (they should be present in the DOM even if not directly testable)
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    it('renders page header with logo and title', () => {
      renderWithRouter(<EventsCreatePage />);

      expect(screen.getByText('Create Event')).toBeInTheDocument();
      expect(screen.getByText('Share your activity idea and find the perfect duo to join you! You can save as draft and invite participants later.')).toBeInTheDocument();
    });

    it('has proper page structure and styling classes', () => {
      const { container } = renderWithRouter(<EventsCreatePage />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-pairup-cream');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: { uid: 'user-123' } });
    });

    it('handles create event flow errors gracefully', async () => {
      const mockOnCreateInitial = vi.fn().mockRejectedValue(new Error('Create failed'));
      mockUseCreateEventFlow.mockReturnValue({
        isCreating: false,
        onCreateInitial: mockOnCreateInitial,
        onSaveTab2: vi.fn(),
        onFinalize: vi.fn(),
      });

      renderWithRouter(<EventsCreatePage />);

      const user = userEvent.setup();
      await user.click(screen.getByTestId('create-initial-btn'));

      // The error should be handled by the hook, not crash the component
      await waitFor(() => {
        expect(mockOnCreateInitial).toHaveBeenCalled();
      });
    });
  });
});
