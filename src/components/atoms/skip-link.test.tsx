import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SkipLink from "./skip-link";

describe("SkipLink", () => {
  it("renders the default label and target", () => {
    render(<SkipLink targetId="main-content" />);

    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("sr-only");
    expect(link).toHaveAttribute("tabindex", "1");
  });

  it("allows custom label and classes", () => {
    render(
      <SkipLink targetId="primary" label="Jump ahead" className="extra-class" />
    );

    const link = screen.getByRole("link", { name: "Jump ahead" });
    expect(link).toHaveAttribute("href", "#primary");
    expect(link.className).toContain("extra-class");
  });
});
