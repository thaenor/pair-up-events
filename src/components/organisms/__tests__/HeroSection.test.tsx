import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders the primary CTA link", () => {
    render(<HeroSection />);

    const link = screen.getByTestId("create-listing-link") as HTMLAnchorElement;
    expect(link.href).toContain("https://forms.gle/F6xptEXPLA8wEpTp7");
  });

  it("invokes the scroll handler when searching listings", () => {
    const onScroll = vi.fn();

    render(<HeroSection onScrollToEarlyAccess={onScroll} />);

    fireEvent.click(screen.getByTestId("search-listings-button"));

    expect(onScroll).toHaveBeenCalled();
  });
});
