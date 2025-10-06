import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const scrollToElement = vi.fn();
type NavigationProps = { onGetStarted: () => void };
const mockNavigation = vi.fn<(props: NavigationProps) => ReactElement | null>();
const mockFooter = vi.fn(() => <div data-testid="mock-footer">Footer</div>);

vi.mock("@/hooks/useScrollToElement", () => ({
  useScrollToElement: () => ({ scrollToElement }),
}));

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
    scrollToElement.mockClear();
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

  it("scrolls to the early access section when navigation get started is clicked", () => {
    render(
      <LandingPageLayout>
        <p>cta</p>
      </LandingPageLayout>
    );

    screen.getByTestId("mock-navigation").click();

    expect(scrollToElement).toHaveBeenCalledWith("early-access");
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
