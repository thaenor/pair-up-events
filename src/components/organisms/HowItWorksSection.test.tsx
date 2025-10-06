import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HowItWorksSection from "./HowItWorksSection";

describe("HowItWorksSection", () => {
  it("explains the three step flow", () => {
    render(<HowItWorksSection />);

    const heading = screen.getByRole("heading", { level: 2, name: /how it works/i });
    const section = heading.closest("section");
    expect(section).not.toBeNull();

    const stepHeadings = within(section!).getAllByRole("heading", { level: 3 });
    expect(stepHeadings).toHaveLength(3);
    expect(stepHeadings[0]).toHaveTextContent(/create\s*or\s*join/i);
    expect(stepHeadings[1]).toHaveTextContent("Find a Friend");
    expect(stepHeadings[2]).toHaveTextContent("Meet Up");

    expect(
      within(section!).getByText(
        "Create your own event or browse existing ones in your area"
      )
    ).toBeInTheDocument();
    expect(
      within(section!).getByText(
        "Start by selecting one friend to join your pair-up adventure"
      )
    ).toBeInTheDocument();
    expect(
      within(section!).getByText(
        "Connect with another pair at the agreed location and enjoy!"
      )
    ).toBeInTheDocument();
  });
});
