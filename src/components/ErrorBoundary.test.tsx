import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
const mockLogError = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/utils/logger", () => ({
  logError: (...args: unknown[]) => mockLogError(...args),
}));

vi.mock("@sentry/react", () => ({
  withScope: (callback: (scope: Record<string, unknown>) => void) => {
    callback({
      setTag: vi.fn(),
      setContext: vi.fn(),
      setUser: vi.fn(),
    });
  },
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
}));

import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogError.mockReset();
  });

  it("renders children when no error occurs", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <span>safe content</span>
      </ErrorBoundary>
    );

    expect(getByText("safe content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockLogError).not.toHaveBeenCalled();
  });

  it("logs the error, invokes callbacks, and navigates to the 404 page", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();
    const testError = new Error("Boundary failure");

    const Thrower = () => {
      throw testError;
    };

    const { container } = render(
      <ErrorBoundary onError={onError}>
        <Thrower />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/404", { replace: true });
    });

    expect(onError).toHaveBeenCalledWith(testError, expect.any(Object));
    expect(mockLogError).toHaveBeenCalledWith(
      "Error caught by boundary",
      testError,
      expect.objectContaining({
        component: "ErrorBoundary",
        action: "componentDidCatch",
      })
    );
    expect(container).toBeEmptyDOMElement();

    consoleErrorSpy.mockRestore();
  });
});
