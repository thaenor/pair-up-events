import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import EmailLoginForm from "./email-login-form";

const mockSignInWithEmail = vi.fn();
const mockSendPasswordReset = vi.fn();
const mockClearError = vi.fn();
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
    signInWithEmail: mockSignInWithEmail,
    sendPasswordReset: mockSendPasswordReset,
    loading: false,
    error: null,
    clearError: mockClearError
  }))
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe("EmailLoginForm", () => {
  beforeEach(() => {
    mockSignInWithEmail.mockResolvedValue(undefined);
    mockSendPasswordReset.mockResolvedValue(undefined);
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockClearError.mockReset();
    mockNavigate.mockReset();
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);
  });

  it("validates required fields on submit", async () => {
    render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByTestId("login-form"));

    expect(await screen.findByTestId("login-email-error")).toHaveTextContent("Email is required");
    expect(await screen.findByTestId("login-password-error")).toHaveTextContent("Password is required");
    expect(mockSignInWithEmail).not.toHaveBeenCalled();
  });

  it("signs in the user and navigates to the profile page", async () => {
    render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("login-email-input"), { target: { value: "hello@pairup.events" } });
    fireEvent.change(screen.getByTestId("login-password-input"), { target: { value: "Valid123" } });

    fireEvent.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith("hello@pairup.events", "Valid123");
      expect(mockToastSuccess).toHaveBeenCalledWith("Welcome back! You have been signed in successfully.");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("toggles password visibility", () => {
    render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("login-password-input") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    fireEvent.click(screen.getByTestId("login-password-toggle"));

    expect(passwordInput.type).toBe("text");
  });

  it("shows validation when requesting password reset without an email", async () => {
    render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("password-reset-button"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Please enter your email address first");
      expect(mockSendPasswordReset).not.toHaveBeenCalled();
    });
  });

  it("sends a password reset email when a valid email is provided", async () => {
    render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("login-email-input"), { target: { value: "hello@pairup.events" } });

    fireEvent.click(screen.getByTestId("password-reset-button"));

    await waitFor(() => {
      expect(mockSendPasswordReset).toHaveBeenCalledWith("hello@pairup.events");
      expect(mockToastSuccess).toHaveBeenCalledWith("Password reset email sent! Please check your inbox.");
    });
  });
});
