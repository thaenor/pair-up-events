import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthLayout } from "./auth-layout";

describe("AuthLayout", () => {
  it("renders provided left content", () => {
    render(
      <AuthLayout
        left={<div data-testid="custom-left">Left Content</div>}
      />
    );

    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("auth-layout-left")).toContainElement(screen.getByTestId("custom-left"));
  });

  it("displays both mobile and desktop imagery", () => {
    render(<AuthLayout left={<div />} />);

    const imagesContainer = screen.getByTestId("auth-layout-images");
    const images = imagesContainer.querySelectorAll("img");
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute("src", "/Header Logo Mobile.png");
    expect(images[1]).toHaveAttribute("src", "/Header Logo Desktop.png");
  });
});
