import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import InviteFriendSection from "../invite-friend-section";
import { PROFILE_MESSAGES } from "@/constants/profile";

const mockCreateInviteMessage = vi.fn(() => "Join us at PairUp! {URL}");
const mockShareOrCopyToClipboard = vi.fn();
const mockToastError = vi.fn();
const mockLogError = vi.fn();

vi.mock("@/utils/profileHelpers", () => ({
  createInviteMessage: () => mockCreateInviteMessage(),
  shareOrCopyToClipboard: (...args: unknown[]) => mockShareOrCopyToClipboard(...args)
}));

vi.mock("@/utils/logger", () => ({
  logError: (...args: unknown[]) => mockLogError(...args)
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args)
  }
}));

describe("InviteFriendSection", () => {
  beforeEach(() => {
    mockCreateInviteMessage.mockClear();
    mockShareOrCopyToClipboard.mockReset();
    mockToastError.mockReset();
    mockLogError.mockReset();
  });

  it("shares the invite message using the helper", async () => {
    render(<InviteFriendSection />);

    fireEvent.click(screen.getByTestId("invite-friend-button"));

    expect(mockCreateInviteMessage).toHaveBeenCalled();
    expect(mockShareOrCopyToClipboard).toHaveBeenCalledWith(
      expect.objectContaining({
        title: PROFILE_MESSAGES.INVITE_FRIEND.TITLE,
        text: expect.stringContaining("Join us at PairUp!"),
        url: window.location.origin
      })
    );
  });

  it("logs an error and shows feedback if sharing fails", async () => {
    mockShareOrCopyToClipboard.mockRejectedValueOnce(new Error("share failed"));

    render(<InviteFriendSection />);

    fireEvent.click(screen.getByTestId("invite-friend-button"));

    await waitFor(() => {
      expect(mockLogError).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_FRIEND.ERROR_SHARE);
    });
  });
});
