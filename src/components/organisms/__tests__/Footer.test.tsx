import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Footer from "../Footer";

describe("Footer", () => {
  beforeEach(() => {
    // Mock document.getElementById for testing
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: vi.fn()
    } as HTMLElement);
  });

  it("renders navigation groups and legal links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", {
      name: "Review our privacy policy and data handling practices",
    });
    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");
  });

  it("smooth scrolls to the target section when internal links are clicked", () => {
    const mockScrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView
    } as HTMLElement);

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const joinLink = screen.getByRole("link", {
      name: "Join an event by signing up through the Early Access section",
    });

    fireEvent.click(joinLink);

    expect(document.getElementById).toHaveBeenCalledWith("early-access");
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
