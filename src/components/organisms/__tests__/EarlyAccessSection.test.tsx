import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EarlyAccessSection from "../EarlyAccessSection";
import { iframeURL } from "@/lib/config";

describe("EarlyAccessSection", () => {
  it("embeds the Brevo sign-up form with the configured iframe", () => {
    render(<EarlyAccessSection />);

    const iframe = screen.getByTitle("Brevo Subscription Form");
    expect(iframe).toHaveAttribute("src", iframeURL);
    expect(iframe).toHaveAttribute("width", "600");
    expect(iframe).toHaveAttribute("height", "500");
    expect(iframe).toHaveAttribute("allowfullscreen");
  });
});
