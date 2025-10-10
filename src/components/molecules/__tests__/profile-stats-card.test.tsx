import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProfileStatsCard from "../profile-stats-card";

describe("ProfileStatsCard", () => {
  it("renders default stats when none provided", () => {
    render(<ProfileStatsCard />);

    expect(screen.getByTestId("profile-stats-created")).toHaveTextContent("0");
    expect(screen.getByTestId("profile-stats-joined")).toHaveTextContent("0");
  });

  it("displays provided statistics", () => {
    render(
      <ProfileStatsCard
        stats={{
          eventsCreated: 3,
          eventsJoined: 5,
        }}
      />
    );

    expect(screen.getByTestId("profile-stats-created")).toHaveTextContent("3");
    expect(screen.getByTestId("profile-stats-joined")).toHaveTextContent("5");
  });
});
