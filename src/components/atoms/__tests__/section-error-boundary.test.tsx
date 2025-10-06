import type { ReactElement, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SectionErrorBoundary from "../section-error-boundary";

type MockErrorBoundaryProps = {
  children: ReactNode;
  fallback: (args: { error?: Error; resetError: () => void }) => ReactElement;
  enableRetry?: boolean;
  maxRetries?: number;
  showErrorDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

const mockErrorBoundary = vi.fn((props: MockErrorBoundaryProps) => {
  return <div data-testid="mock-error-boundary">{props.children}</div>;
});

let lastProps: MockErrorBoundaryProps | undefined;

vi.mock("../../ErrorBoundary", () => ({
  __esModule: true,
  default: (props: MockErrorBoundaryProps) => {
    lastProps = props;
    return mockErrorBoundary(props);
  },
}));

describe("SectionErrorBoundary", () => {
  beforeEach(() => {
    mockErrorBoundary.mockClear();
    lastProps = undefined;
  });

  it("provides a retryable fallback tailored to the section", () => {
    render(
      <SectionErrorBoundary>
        <div>ok</div>
      </SectionErrorBoundary>
    );

    expect(mockErrorBoundary).toHaveBeenCalledTimes(1);
    expect(lastProps.enableRetry).toBe(true);
    expect(lastProps.maxRetries).toBe(2);
    expect(lastProps.showErrorDetails).toBe(false);

    const resetError = vi.fn();
    const fallback = lastProps.fallback({ resetError });
    const { getByText, getByRole } = render(fallback);

    expect(getByText("Section Error")).toBeInTheDocument();
    expect(
      getByText("Something went wrong in the section. Please try again.")
    ).toBeInTheDocument();

    getByRole("button", { name: "Retry" }).click();
    expect(resetError).toHaveBeenCalled();
  });

  it("customizes the fallback copy and forwards onError", () => {
    const onError = vi.fn();

    render(
      <SectionErrorBoundary sectionName="profile" fallbackMessage="Try reloading" onError={onError}>
        <span>children</span>
      </SectionErrorBoundary>
    );

    expect(mockErrorBoundary).toHaveBeenCalledTimes(1);
    expect(lastProps.onError).toBe(onError);

    const fallback = lastProps.fallback({ resetError: vi.fn() });
    render(fallback);

    expect(screen.getByText("Profile Error")).toBeInTheDocument();
    expect(screen.getByText("Try reloading")).toBeInTheDocument();
  });
});
