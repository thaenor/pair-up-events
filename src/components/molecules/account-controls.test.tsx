import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import AccountControls from "./account-controls";

const mockSignOut = vi.fn();
const mockSendPasswordReset = vi.fn();
const mockDeleteUserAccount = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockNavigate = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args)
  }
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    signOut: mockSignOut,
    sendPasswordReset: mockSendPasswordReset,
    deleteUserAccount: mockDeleteUserAccount
  }))
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe("AccountControls", () => {
  beforeEach(() => {
    mockSignOut.mockResolvedValue(undefined);
    mockSendPasswordReset.mockResolvedValue(undefined);
    mockDeleteUserAccount.mockResolvedValue(undefined);
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();

    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);

    // jsdom does not implement scroll/overflow adjustments used in effect
    Object.defineProperty(document, "body", {
      value: document.body,
      configurable: true
    });
  });

  it("sends a password reset email and shows success feedback", async () => {
    render(
      <MemoryRouter>
        <AccountControls user={{ email: "team@pairup.events" } as never} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-controls-reset-password"));

    await waitFor(() => {
      expect(mockSendPasswordReset).toHaveBeenCalledWith("team@pairup.events");
      expect(mockToastSuccess).toHaveBeenCalledWith("Password reset email sent! Check your inbox.");
    });
  });

  it("shows an error toast if password reset fails", async () => {
    mockSendPasswordReset.mockRejectedValueOnce(new Error("reset failed"));

    render(
      <MemoryRouter>
        <AccountControls user={{ email: "team@pairup.events" } as never} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-controls-reset-password"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to send password reset email. Please try again.");
    });
  });

  it("deletes the account after confirmation and navigates home", async () => {
    render(
      <MemoryRouter>
        <AccountControls user={{ email: "team@pairup.events" } as never} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-controls-delete"));
    expect(screen.getByTestId("delete-confirmation-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-confirmation-confirm"));

    await waitFor(() => {
      expect(mockDeleteUserAccount).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith("Account deleted successfully.");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("logs out the user and navigates home", async () => {
    render(
      <MemoryRouter>
        <AccountControls user={{ email: "team@pairup.events" } as never} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-controls-sign-out"));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
