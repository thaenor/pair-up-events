import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import MobileBottomNavigation from "../MobileBottomNavigation";
import { NAVIGATION_COPY } from "@/constants/navigation";

const mockNavigate = vi.fn();
const mockLocation = { pathname: "/" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe("MobileBottomNavigation", () => {
  beforeEach(() => {
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue(mockLocation);
    mockNavigate.mockClear();
  });

  it("renders all navigation items", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.EXPLORE)).toBeInTheDocument();
    expect(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS)).toBeInTheDocument();
    expect(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MESSENGER)).toBeInTheDocument();
    expect(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE)).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Mobile navigation");
    expect(nav).toHaveAttribute("data-testid", "mobile-bottom-navigation");

    const buttons = screen.getAllByRole("menuitem");
    expect(buttons).toHaveLength(4);
  });

  it("navigates to explore page when Explore is clicked", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.EXPLORE));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to events page when My Events is clicked", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MY_EVENTS));

    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });

  it("navigates to messenger page when Messenger is clicked", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MESSENGER));

    expect(mockNavigate).toHaveBeenCalledWith("/messenger");
  });

  it("navigates to profile page when My Profile is clicked", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE));

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("shows active state for current page", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/profile"
    });

    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    const profileButton = screen.getByText(NAVIGATION_COPY.AUTHENTICATED.MY_PROFILE).closest("button");
    expect(profileButton).toHaveClass("text-pairup-yellow");
  });

  it("has proper CSS classes for mobile visibility", () => {
    render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("md:hidden");
    expect(nav).toHaveClass("fixed", "bottom-0", "left-0", "right-0");
  });
});
