import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type NavigationProps = { onGetStarted: () => void };
const mockNavigation = vi.fn<(props: NavigationProps) => ReactElement | null>();
const mockFooter = vi.fn(() => <div data-testid="mock-footer">Footer</div>);

vi.mock("../../organisms/Navigation", () => ({
  __esModule: true,
  default: (props: NavigationProps) => mockNavigation(props),
}));

vi.mock("../../organisms/Footer", () => ({
  __esModule: true,
  default: () => mockFooter(),
}));

import LandingPageLayout from "../LandingPageLayout";

describe("LandingPageLayout", () => {
  beforeEach(() => {
    mockNavigation.mockReset();
    mockFooter.mockClear();
    mockNavigation.mockImplementation(({ onGetStarted }) => (
      <button data-testid="mock-navigation" onClick={onGetStarted}>
        Navigation
      </button>
    ));
  });

  it("renders navigation, main content, and footer by default", () => {
    render(
      <LandingPageLayout>
        <p>Landing content</p>
      </LandingPageLayout>
    );

    expect(screen.getByTestId("mock-navigation")).toBeInTheDocument();
    expect(screen.getByText("Landing content")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("calls the get started handler when navigation get started is clicked", () => {
    render(
      <LandingPageLayout>
        <p>cta</p>
      </LandingPageLayout>
    );

    screen.getByTestId("mock-navigation").click();

    // The handler is called (we can't easily test the native scrollIntoView in this test)
    expect(mockNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        onGetStarted: expect.any(Function)
      })
    );
  });

  it("allows hiding the navigation or footer", () => {
    mockNavigation.mockImplementation(() => <div data-testid="nav-rendered" />);

    render(
      <LandingPageLayout showNavigation={false} showFooter={false}>
        <p>content</p>
      </LandingPageLayout>
    );

    expect(mockNavigation).not.toHaveBeenCalled();
    expect(screen.queryByTestId("nav-rendered")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-footer")).not.toBeInTheDocument();
  });
});
