import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { TabbedEventCreationForm } from '../TabbedEventCreationForm';
import type { TabbedEventCreationFormProps } from '../TabbedEventCreationForm';

// Mock the InviteShareRow component
vi.mock('@/components/molecules/invite-share-row', () => ({
  InviteShareRow: ({ eventId, isDisabled, inviteMessage }: { eventId: string | null; isDisabled: boolean; inviteMessage: string }) => (
    <div data-testid="invite-share-row">
      <span data-testid="event-id">{eventId || 'no-event-id'}</span>
      <span data-testid="is-disabled">{isDisabled ? 'disabled' : 'enabled'}</span>
      <span data-testid="invite-message">{inviteMessage}</span>
    </div>
  ),
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackFormEvent: vi.fn(),
}));

const defaultProps: TabbedEventCreationFormProps = {
  isCreating: false,
  onCreateInitial: vi.fn(),
  onFinalize: vi.fn(),
};

describe('TabbedEventCreationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Navigation', () => {
    it('renders all three tabs with correct labels and icons', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      expect(screen.getByRole('tab', { name: /event details/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /your duo/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /their duo/i })).toBeInTheDocument();
    });

    it('starts on Tab 1 and allows free navigation between tabs', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const tab1 = screen.getByRole('tab', { name: /event details/i });
      const tab2 = screen.getByRole('tab', { name: /your duo/i });
      const tab3 = screen.getByRole('tab', { name: /their duo/i });
      
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab3).toHaveAttribute('aria-selected', 'false');
      
      // All tabs should be enabled for free navigation
      expect(tab2).not.toBeDisabled();
      expect(tab3).not.toBeDisabled();
    });

    it('enables Tab 2 after Tab 1 is completed and saved', async () => {
      const mockOnCreateInitial = vi.fn().mockResolvedValue('event-123');
      render(<TabbedEventCreationForm {...defaultProps} onCreateInitial={mockOnCreateInitial} />);
      
      const user = userEvent.setup();
      
      // Fill out Tab 1 required fields
      await user.type(screen.getByLabelText(/what activity do you want to do/i), 'Test Event');
      await user.type(screen.getByLabelText(/describe your activity/i), 'Test Description');
      await user.selectOptions(screen.getByLabelText(/activity type/i), 'outdoors');
      await user.type(screen.getByLabelText(/country/i), 'USA');
      await user.type(screen.getByLabelText(/city/i), 'San Francisco');
      
      // Click Next to save Tab 1
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(mockOnCreateInitial).toHaveBeenCalled();
      });
      
      // Tab 2 should now be enabled
      const tab2 = screen.getByRole('tab', { name: /your duo/i });
      expect(tab2).not.toBeDisabled();
    });

    it('allows navigation to Tab 3 after Tab 1 is completed', async () => {
      const mockOnCreateInitial = vi.fn().mockResolvedValue('event-123');
      
      render(
        <TabbedEventCreationForm 
          {...defaultProps} 
          onCreateInitial={mockOnCreateInitial}
        />
      );
      
      const user = userEvent.setup();
      
      // Complete Tab 1
      await user.type(screen.getByLabelText(/what activity do you want to do/i), 'Test Event');
      await user.type(screen.getByLabelText(/describe your activity/i), 'Test Description');
      await user.selectOptions(screen.getByLabelText(/activity type/i), 'outdoors');
      await user.type(screen.getByLabelText(/country/i), 'USA');
      await user.type(screen.getByLabelText(/city/i), 'San Francisco');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(mockOnCreateInitial).toHaveBeenCalled();
      });
      
      // Navigate to Tab 3 directly (no Tab 2 validation needed)
      await user.click(screen.getByRole('tab', { name: /their duo/i }));
      
      // Tab 3 should be accessible
      expect(screen.getByRole('tab', { name: /their duo/i })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for tablist', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Create event steps');
    });

    it('has proper ARIA attributes for individual tabs', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const tab1 = screen.getByRole('tab', { name: /event details/i });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab1).toHaveAttribute('aria-controls', 'tabpanel-1');
      expect(tab1).toHaveAttribute('id', 'tab-1');
      
      const tab2 = screen.getByRole('tab', { name: /your duo/i });
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-controls', 'tabpanel-2');
      expect(tab2).toHaveAttribute('id', 'tab-2');
    });

    it('has proper ARIA attributes for tab panels', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const panel1 = screen.getByRole('tabpanel', { name: /event details/i });
      expect(panel1).toHaveAttribute('aria-labelledby', 'tab-1');
      expect(panel1).toHaveAttribute('id', 'tabpanel-1');
      expect(panel1).toHaveAttribute('aria-live', 'polite');
    });

    it('supports keyboard navigation with arrow keys', async () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const user = userEvent.setup();
      const tab1 = screen.getByRole('tab', { name: /event details/i });
      
      // Focus on tab1 and press right arrow
      tab1.focus();
      await user.keyboard('{ArrowRight}');
      
      // Should stay on tab1 since tab2 is disabled
      expect(tab1).toHaveFocus();
    });

    it('has proper form labels and associations', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/what activity do you want to do/i);
      expect(titleInput).toHaveAttribute('id', 'activity-title');
      expect(titleInput).toHaveAttribute('aria-invalid', 'false');
      
      const descriptionInput = screen.getByLabelText(/describe your activity/i);
      expect(descriptionInput).toHaveAttribute('id', 'activity-description');
    });

    it('shows error messages with proper ARIA attributes', async () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const user = userEvent.setup();
      
      // Try to submit without filling required fields
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        const titleError = screen.getByText('Activity title is required');
        expect(titleError).toHaveAttribute('id', 'activity-title-error');
        expect(titleError).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Invite Share Row', () => {
    it('renders InviteShareRow with correct props when eventId is null', async () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      // Complete Tab 1 to enable Tab 2
      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/what activity do you want to do/i), 'Test Event');
      await user.type(screen.getByLabelText(/describe your activity/i), 'Test Description');
      await user.selectOptions(screen.getByLabelText(/activity type/i), 'outdoors');
      await user.type(screen.getByLabelText(/country/i), 'USA');
      await user.type(screen.getByLabelText(/city/i), 'San Francisco');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('invite-share-row')).toBeInTheDocument();
        expect(screen.getByTestId('event-id')).toHaveTextContent('no-event-id');
        expect(screen.getByTestId('is-disabled')).toHaveTextContent('enabled');
        expect(screen.getByTestId('invite-message')).toHaveTextContent('Join my event on PairUp!');
      });
    });

    it('renders InviteShareRow with eventId when available', async () => {
      const mockOnCreateInitial = vi.fn().mockResolvedValue('event-123');
      render(<TabbedEventCreationForm {...defaultProps} onCreateInitial={mockOnCreateInitial} />);
      
      const user = userEvent.setup();
      
      // Complete Tab 1 to get eventId
      await user.type(screen.getByLabelText(/what activity do you want to do/i), 'Test Event');
      await user.type(screen.getByLabelText(/describe your activity/i), 'Test Description');
      await user.selectOptions(screen.getByLabelText(/activity type/i), 'outdoors');
      await user.type(screen.getByLabelText(/country/i), 'USA');
      await user.type(screen.getByLabelText(/city/i), 'San Francisco');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('event-id')).toHaveTextContent('event-123');
        expect(screen.getByTestId('is-disabled')).toHaveTextContent('enabled');
      });
    });

  });

  describe('Form Validation', () => {
    it('validates required fields on Tab 1', async () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const user = userEvent.setup();
      
      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Activity title is required')).toBeInTheDocument();
        expect(screen.getByText('Activity description is required')).toBeInTheDocument();
        expect(screen.getByText('Activity type is required')).toBeInTheDocument();
        expect(screen.getByText('Country is required')).toBeInTheDocument();
        expect(screen.getByText('City is required')).toBeInTheDocument();
      });
    });

  });

  describe('Loading States', () => {
    it('disables all interactions when isCreating is true', () => {
      render(<TabbedEventCreationForm {...defaultProps} isCreating={true} />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
      
      const titleInput = screen.getByLabelText(/what activity do you want to do/i);
      expect(titleInput).toBeDisabled();
    });

    it('disables all form elements when creating', () => {
      render(<TabbedEventCreationForm {...defaultProps} isCreating={true} />);
      
      // All form inputs should be disabled when creating
      const titleInput = screen.getByLabelText(/what activity do you want to do/i);
      const descriptionInput = screen.getByLabelText(/describe your activity/i);
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Previous Button', () => {
    it('is disabled on Tab 1', () => {
      render(<TabbedEventCreationForm {...defaultProps} />);
      
      const previousButton = screen.getByRole('button', { name: /previous/i });
      expect(previousButton).toBeDisabled();
    });

    it('is enabled on Tab 2 and allows going back to Tab 1', async () => {
      const mockOnCreateInitial = vi.fn().mockResolvedValue('event-123');
      render(<TabbedEventCreationForm {...defaultProps} onCreateInitial={mockOnCreateInitial} />);
      
      const user = userEvent.setup();
      
      // Complete Tab 1
      await user.type(screen.getByLabelText(/what activity do you want to do/i), 'Test Event');
      await user.type(screen.getByLabelText(/describe your activity/i), 'Test Description');
      await user.selectOptions(screen.getByLabelText(/activity type/i), 'outdoors');
      await user.type(screen.getByLabelText(/country/i), 'USA');
      await user.type(screen.getByLabelText(/city/i), 'San Francisco');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(mockOnCreateInitial).toHaveBeenCalled();
      });
      
      // Previous button should be enabled
      const previousButton = screen.getByRole('button', { name: /previous/i });
      expect(previousButton).not.toBeDisabled();
      
      // Click previous to go back to Tab 1
      await user.click(previousButton);
      
      const tab1 = screen.getByRole('tab', { name: /event details/i });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });
  });
});
