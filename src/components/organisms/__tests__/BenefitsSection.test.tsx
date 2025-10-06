import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BenefitsSection from "../BenefitsSection";

describe("BenefitsSection", () => {
  it("lists each core benefit with title and description", () => {
    render(<BenefitsSection />);

    const heading = screen.getByRole("heading", { level: 2, name: /why pair up/i });
    const section = heading.closest("section");
    expect(section).not.toBeNull();

    const cards = within(section!).getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(4);

    expect(
      within(section!).getByText("Experience a Fresh 4-Way Dynamic")
    ).toBeInTheDocument();
    expect(
      within(section!).getByText("Break Your Routine")
    ).toBeInTheDocument();
    expect(
      within(section!).getByText("Feel Safe and Open")
    ).toBeInTheDocument();
    expect(
      within(section!).getByText("Grow Your Social Circle")
    ).toBeInTheDocument();

    expect(
      within(section!).getByText(
        "We're reimagining how people meet and connect, making it more comfortable and meaningful"
      )
    ).toBeInTheDocument();
  });
});
