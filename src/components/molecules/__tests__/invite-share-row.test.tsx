import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { InviteShareRow } from '../invite-share-row';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock navigator.share
Object.assign(navigator, {
  share: vi.fn(),
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://pairup-events.com',
  },
  writable: true,
});

// Mock alert
const mockAlert = vi.fn();
global.alert = mockAlert;

describe('InviteShareRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct title and message', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      expect(screen.getByText('🔗 Invite your duo')).toBeInTheDocument();
      expect(screen.getByText('Send an invite link to your partner so they can confirm this duo. You can share it via your preferred app.')).toBeInTheDocument();
    });

    it('renders invite link input with correct value when eventId is provided', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const input = screen.getByTestId('invite-link-input');
      expect(input).toHaveValue('https://pairup-events.com/invite/event-123');
      expect(input).toHaveAttribute('readonly');
    });

    it('renders placeholder text when eventId is null', () => {
      render(
        <InviteShareRow
          eventId={null}
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const input = screen.getByTestId('invite-link-input');
      expect(input).toHaveValue('Your invite link will appear after saving Tab 1');
    });

    it('renders copy and share buttons', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      expect(screen.getByTestId('invite-copy-btn')).toBeInTheDocument();
      expect(screen.getByTestId('invite-share-btn')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('enables buttons when eventId is provided and not disabled', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const copyBtn = screen.getByTestId('invite-copy-btn');
      const shareBtn = screen.getByTestId('invite-share-btn');

      expect(copyBtn).not.toBeDisabled();
      expect(shareBtn).not.toBeDisabled();
    });

    it('disables buttons when eventId is null', () => {
      render(
        <InviteShareRow
          eventId={null}
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const copyBtn = screen.getByTestId('invite-copy-btn');
      const shareBtn = screen.getByTestId('invite-share-btn');

      expect(copyBtn).toBeDisabled();
      expect(shareBtn).toBeDisabled();
    });

    it('disables buttons when isDisabled is true', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={true}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const copyBtn = screen.getByTestId('invite-copy-btn');
      const shareBtn = screen.getByTestId('invite-share-btn');

      expect(copyBtn).toBeDisabled();
      expect(shareBtn).toBeDisabled();
    });

    it('enables share button even when navigator.share is not available', () => {
      // Mock navigator.share as undefined
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
      });

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const shareBtn = screen.getByTestId('invite-share-btn');
      expect(shareBtn).not.toBeDisabled();
    });
  });

  describe('Copy Link Functionality', () => {
    it('copies link to clipboard when copy button is clicked', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      vi.mocked(navigator.clipboard.writeText).mockImplementation(mockWriteText);

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const copyButton = screen.getByTestId('invite-copy-btn');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('https://pairup-events.com/invite/event-123');
        expect(mockAlert).toHaveBeenCalledWith('Invite link copied to clipboard!');
      });
    });

    it('shows error alert when clipboard write fails', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard write failed'));
      vi.mocked(navigator.clipboard.writeText).mockImplementation(mockWriteText);

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const copyButton = screen.getByTestId('invite-copy-btn');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to copy link.');
      });
    });

    it('does not copy when eventId is null', async () => {
      const mockWriteText = vi.fn();
      vi.mocked(navigator.clipboard.writeText).mockImplementation(mockWriteText);

      render(
        <InviteShareRow
          eventId={null}
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('invite-copy-btn'));

      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  describe('Share Functionality', () => {
    it('shares link when share button is clicked and navigator.share is available', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      navigator.share = mockShare;

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('invite-share-btn'));

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'PairUp Event Invite',
          text: 'Join my event on PairUp!',
          url: 'https://pairup-events.com/invite/event-123',
        });
      });
    });

    it('shows error alert when share fails', async () => {
      const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'));
      navigator.share = mockShare;

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('invite-share-btn'));

      // Should not show alert for share failures (user cancelled is normal)
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('shows unsupported alert when navigator.share is not available', async () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
      });

      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('invite-share-btn'));

      expect(mockAlert).toHaveBeenCalledWith('Web Share API is not supported in your browser.');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const input = screen.getByTestId('invite-link-input');
      const copyBtn = screen.getByTestId('invite-copy-btn');
      const shareBtn = screen.getByTestId('invite-share-btn');

      expect(input).toHaveAttribute('aria-label', 'Invite link');
      expect(copyBtn).toHaveAttribute('aria-label', 'Copy invite link');
      expect(shareBtn).toHaveAttribute('aria-label', 'Share invite link');
    });

    it('has proper data-testid attributes for testing', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      expect(screen.getByTestId('invite-link-input')).toBeInTheDocument();
      expect(screen.getByTestId('invite-copy-btn')).toBeInTheDocument();
      expect(screen.getByTestId('invite-share-btn')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      render(
        <InviteShareRow
          eventId="event-123"
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const container = screen.getByText('🔗 Invite your duo').closest('div');
      expect(container).toHaveClass('rounded-lg', 'border', 'border-gray-200', 'bg-white/70', 'p-4');

      const input = screen.getByTestId('invite-link-input');
      expect(input).toHaveClass('w-full', 'rounded-lg', 'border', 'px-3', 'py-2', 'text-sm', 'text-pairup-darkBlue', 'bg-gray-50');
    });

    it('applies disabled styling when eventId is null', () => {
      render(
        <InviteShareRow
          eventId={null}
          isDisabled={false}
          inviteMessage="Join my event on PairUp!"
        />
      );

      const input = screen.getByTestId('invite-link-input');
      expect(input).toHaveClass('opacity-60');
    });
  });
});
