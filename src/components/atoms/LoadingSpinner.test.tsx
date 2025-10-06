import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default medium size classes", () => {
    const { container } = render(<LoadingSpinner />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("animate-spin", "text-pairup-cyan", "h-6", "w-6");
  });

  it("applies the size specific classes", () => {
    const { container } = render(<LoadingSpinner size="xl" className="custom" />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("h-12", "w-12");
    expect(icon).toHaveClass("custom");
  });
});
