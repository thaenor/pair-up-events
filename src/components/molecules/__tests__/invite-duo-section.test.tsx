import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import InviteDuoSection from '../invite-duo-section';
import { PROFILE_MESSAGES } from '@/constants/profile';

const mockCreateDuoInviteMessage = vi.fn(() => 'Join me on PairUp Events!');
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockLogError = vi.fn();

vi.mock('@/utils/profileHelpers', () => ({
  createDuoInviteMessage: () => mockCreateDuoInviteMessage(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('@/utils/logger', () => ({
  logError: (...args: unknown[]) => mockLogError(...args),
}));

describe('InviteDuoSection', () => {
  let openMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCreateDuoInviteMessage.mockClear();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockLogError.mockReset();

    openMock = vi.fn(() => null);
    Object.defineProperty(window, 'open', {
      configurable: true,
      writable: true,
      value: openMock,
    });
  });

  it('launches the email client with a prefilled invite', async () => {
    render(<InviteDuoSection />);

    const emailInput = screen.getByTestId('invite-duo-email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'partner@example.com' } });
    fireEvent.click(screen.getByTestId('invite-duo-submit'));

    await waitFor(() => {
      expect(openMock).toHaveBeenCalledTimes(1);
    });

    const [mailtoUrl] = openMock.mock.calls[0];
    expect(mailtoUrl).toContain('mailto:partner%40example.com');
    expect(mailtoUrl).toContain(`subject=${encodeURIComponent(PROFILE_MESSAGES.INVITE_DUO.SUBJECT)}`);
    expect(mailtoUrl).toContain('body=Join%20me%20on%20PairUp%20Events!');
    expect(mockToastSuccess).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.SUCCESS);
    expect(emailInput.value).toBe('');
  });

  it('validates the email input before sending', async () => {
    render(<InviteDuoSection />);

    fireEvent.submit(screen.getByTestId('invite-duo-section'));
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.REQUIRED);
    });
    expect(openMock).not.toHaveBeenCalled();
    mockToastError.mockClear();

    fireEvent.change(screen.getByTestId('invite-duo-email'), { target: { value: 'not-an-email' } });
    await waitFor(() => {
      expect(screen.getByTestId('invite-duo-email')).toHaveValue('not-an-email');
    });
    fireEvent.submit(screen.getByTestId('invite-duo-section'));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.INVALID_EMAIL);
    });
    expect(openMock).not.toHaveBeenCalled();
    mockToastError.mockClear();
  });

  it('logs and surfaces errors when the email client fails to open', async () => {
    openMock.mockImplementation(() => {
      throw new Error('popup blocked');
    });

    render(<InviteDuoSection />);

    fireEvent.change(screen.getByTestId('invite-duo-email'), { target: { value: 'duo@example.com' } });
    fireEvent.click(screen.getByTestId('invite-duo-submit'));

    await waitFor(() => {
      expect(mockLogError).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.ERROR);
    });
  });
});
