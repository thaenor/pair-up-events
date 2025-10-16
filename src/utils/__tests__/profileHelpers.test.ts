import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  canUseWebShare,
  createInviteMessage,
  shareOrCopyToClipboard
} from "../profileHelpers";
import { PROFILE_COPY } from "@/constants/profile";

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockLogError = vi.fn();
const mockShare = vi.fn();
const mockClipboardWriteText = vi.fn();
const mockCanShare = vi.fn();

const getNavigator = () =>
  navigator as Navigator & {
    share?: typeof mockShare;
    canShare?: typeof mockCanShare;
    clipboard: { writeText: typeof mockClipboardWriteText };
  };

const shareData = { title: "PairUp", text: "Join us", url: "http://localhost" };

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args)
  }
}));

vi.mock("@/utils/logger", () => ({
  logError: (...args: unknown[]) => mockLogError(...args)
}));

beforeEach(() => {
  mockToastSuccess.mockReset();
  mockToastError.mockReset();
  mockLogError.mockReset();
  mockShare.mockReset();
  mockClipboardWriteText.mockReset();
  mockCanShare.mockReset();

  Object.assign(getNavigator(), {
    share: undefined,
    canShare: undefined,
    clipboard: { writeText: mockClipboardWriteText }
  });
});

describe("createInviteMessage", () => {
  it("injects the current origin", () => {
    expect(createInviteMessage()).toContain(window.location.origin);
  });
});

describe("shareOrCopyToClipboard", () => {
  it("uses the Web Share API when available", async () => {
    Object.assign(getNavigator(), {
      share: mockShare,
      canShare: mockCanShare.mockReturnValue(true)
    });

    await shareOrCopyToClipboard(shareData);

    expect(mockShare).toHaveBeenCalledWith(shareData);
    expect(mockClipboardWriteText).not.toHaveBeenCalled();
  });

  it("falls back to clipboard copy when share is unavailable", async () => {
    await shareOrCopyToClipboard(shareData);

    expect(mockClipboardWriteText).toHaveBeenCalledWith("Join us");
    expect(mockToastSuccess).toHaveBeenCalled();
  });

  it("logs errors and surfaces feedback if clipboard fallback fails", async () => {
    mockClipboardWriteText.mockRejectedValue(new Error("clipboard"));

    await expect(shareOrCopyToClipboard(shareData)).rejects.toThrow(
      PROFILE_COPY.GENERAL.SHARE_FALLBACK_ERROR
    );

    expect(mockLogError).toHaveBeenCalledTimes(2);
    expect(mockToastError).toHaveBeenCalledWith(PROFILE_COPY.GENERAL.SHARE_FALLBACK_ERROR);
  });
});

describe("canUseWebShare", () => {
  it("returns true when share API supports the data", () => {
    Object.assign(navigator, {
      share: mockShare,
      canShare: mockCanShare.mockReturnValue(true)
    });

    expect(canUseWebShare(shareData)).toBe(true);
  });

  it("returns false when API is unavailable", () => {
    Object.assign(getNavigator(), {
      share: undefined,
      canShare: undefined
    });

    expect(canUseWebShare(shareData)).toBe(false);
  });
});
