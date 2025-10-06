import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  canUseWebShare,
  createInviteMessage,
  formatDate,
  shareOrCopyToClipboard
} from "./profileHelpers";

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

describe("formatDate", () => {
  it("formats valid dates", () => {
    expect(formatDate("2024-01-15T00:00:00Z")).toBe("January 15, 2024");
  });

  it("handles invalid values gracefully", () => {
    expect(formatDate(undefined)).toBe("Unknown");
    expect(formatDate("invalid" as unknown as number)).toBe("Invalid Date");
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

    await expect(shareOrCopyToClipboard(shareData)).rejects.toThrow("Unable to share or copy to clipboard");

    expect(mockLogError).toHaveBeenCalledTimes(2);
    expect(mockToastError).toHaveBeenCalledWith("Unable to share or copy to clipboard");
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
