import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import EmailSignupForm from "./email-signup-form";

const mockSignUpWithEmail = vi.fn();
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
    signUpWithEmail: mockSignUpWithEmail,
    loading: false,
    error: "Something went wrong",
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

describe("EmailSignupForm", () => {
  beforeEach(() => {
    mockSignUpWithEmail.mockResolvedValue(undefined);
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockClearError.mockReset();
    mockNavigate.mockReset();
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);
  });

  const fillValidForm = () => {
    fireEvent.change(screen.getByTestId("signup-email-input"), { target: { value: "hello@pairup.events" } });
    fireEvent.change(screen.getByTestId("signup-password-input"), { target: { value: "ValidPass1" } });
    fireEvent.change(screen.getByTestId("signup-confirm-password-input"), { target: { value: "ValidPass1" } });
  };

  it("shows validation errors when submitting empty form", async () => {
    render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByTestId("signup-form"));

    expect(await screen.findByTestId("signup-email-error")).toHaveTextContent("Email is required");
    expect(await screen.findByTestId("signup-password-error")).toHaveTextContent("Password must be at least 6 characters long");
    expect(await screen.findByTestId("signup-confirm-password-error")).toHaveTextContent("Please confirm your password");
    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
  });

  it("clears API errors when user edits a field", () => {
    render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("signup-email-input"), { target: { value: "hello@pairup.events" } });
    expect(mockClearError).toHaveBeenCalled();
  });

  it("validates password confirmation", async () => {
    render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("signup-email-input"), { target: { value: "hello@pairup.events" } });
    fireEvent.change(screen.getByTestId("signup-password-input"), { target: { value: "ValidPass1" } });
    fireEvent.change(screen.getByTestId("signup-confirm-password-input"), { target: { value: "Mismatch1" } });

    fireEvent.submit(screen.getByTestId("signup-form"));

    expect(await screen.findByTestId("signup-confirm-password-error")).toHaveTextContent("Passwords do not match");
    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
  });

  it("creates an account and shows success state", async () => {
    render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    );

    fillValidForm();

    fireEvent.click(screen.getByTestId("signup-submit-button"));

    await waitFor(() => {
      expect(mockSignUpWithEmail).toHaveBeenCalledWith("hello@pairup.events", "ValidPass1");
      expect(mockToastSuccess).toHaveBeenCalledWith("Account created successfully! Please check your email to verify your account.");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
      expect(screen.getByTestId("signup-success")).toBeInTheDocument();
    });
  });

  it("toggles password visibility for both password fields", () => {
    render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("signup-password-input") as HTMLInputElement;
    const confirmInput = screen.getByTestId("signup-confirm-password-input") as HTMLInputElement;

    expect(passwordInput.type).toBe("password");
    expect(confirmInput.type).toBe("password");

    fireEvent.click(screen.getByTestId("signup-password-toggle"));
    fireEvent.click(screen.getByTestId("signup-confirm-password-toggle"));

    expect(passwordInput.type).toBe("text");
    expect(confirmInput.type).toBe("text");
  });
});
