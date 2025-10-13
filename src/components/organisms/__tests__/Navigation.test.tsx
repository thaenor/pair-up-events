import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import Navigation from "../Navigation";

type AuthState = {
  user: { email?: string; displayName?: string } | null;
  signOut: ReturnType<typeof vi.fn>;
};

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockSignOut = vi.fn();
const mockNavigate = vi.fn();

let authState: AuthState = {
  user: null,
  signOut: mockSignOut
};

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args)
  }
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: authState.user,
    signOut: authState.signOut
  })
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe("Navigation", () => {
  beforeEach(() => {
    authState = { user: null, signOut: mockSignOut };
    mockSignOut.mockResolvedValue(undefined);
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);
  });

  it("navigates to signup when guest clicks get started", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("get-started-button"));

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("shows welcome state instead of the get started button for authenticated users", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("get-started-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navigation-welcome")).toHaveTextContent("member@pairup.events");
  });

  it("navigates to the profile page when the welcome message is clicked", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("navigation-welcome"));

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("logs the user out and shows feedback", async () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("logout-button"));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith("Logged out successfully");
    });
  });

  it("shows an error toast if logout fails", async () => {
    authState.user = { email: "member@pairup.events" };
    mockSignOut.mockRejectedValueOnce(new Error("logout failed"));

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("logout-button"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to log out. Please try again.");
    });
  });
});
