import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import Navigation from "../Navigation";
import { NAVIGATION_MESSAGES } from "@/constants/navigation";

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

  it("navigates to signup when guest clicks sign up button", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("signup-button"));

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("shows navigation links and logout button for authenticated users", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("signup-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("login-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("My Events")).toBeInTheDocument();
    expect(screen.getByText("Messenger")).toBeInTheDocument();
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  it("navigates to the profile page when My Profile is clicked", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("My Profile"));

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
      expect(mockToastSuccess).toHaveBeenCalledWith(NAVIGATION_MESSAGES.LOGOUT_SUCCESS);
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
      expect(mockToastError).toHaveBeenCalledWith(NAVIGATION_MESSAGES.LOGOUT_ERROR);
    });
  });

  it("navigates to login when guest clicks login button", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("login-button"));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to events page when My Events is clicked", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("My Events"));

    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });

  it("navigates to messenger page when Messenger is clicked", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Messenger"));

    expect(mockNavigate).toHaveBeenCalledWith("/messenger");
  });

  it("navigates to explore page when Explore is clicked", () => {
    authState.user = { email: "member@pairup.events" };

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Explore"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
