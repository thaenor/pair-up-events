import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfileSection from "../profile-section";
import { PROFILE_COPY } from "@/constants/profile";

const mockFormatDate = vi.fn((value: unknown) => `formatted-${String(value)}`);

vi.mock("@/utils/profileHelpers", () => ({
  formatDate: (value: unknown) => mockFormatDate(value)
}));

describe("ProfileSection", () => {
  const baseProfile = {
    id: "user-1",
    email: "person@pairup.events",
    displayName: "PairUp Duo",
    createdAt: "2024-01-01T00:00:00Z",
    timezone: "America/New_York"
  } as unknown as Parameters<typeof ProfileSection>[0]["profile"];

  it("renders primary profile fields", () => {
    render(<ProfileSection profile={baseProfile} authEmail="auth@pairup.events" />);

    expect(screen.getByTestId("profile-display-name")).toHaveTextContent("PairUp Duo");
    expect(screen.getByTestId("profile-email")).toHaveTextContent("person@pairup.events");
    expect(screen.getByTestId("profile-timezone")).toHaveTextContent("America/New_York");
    expect(screen.getByTestId("profile-created-at")).toHaveTextContent("formatted-2024-01-01T00:00:00Z");
    expect(mockFormatDate).toHaveBeenCalledWith("2024-01-01T00:00:00Z");
  });

  it("prefers the auth email when the profile is missing", () => {
    render(<ProfileSection profile={null} authEmail="auth@pairup.events" />);

    expect(screen.getByTestId("profile-display-name")).toHaveTextContent(
      PROFILE_COPY.SNAPSHOT.DISPLAY_NAME_PLACEHOLDER
    );
    expect(screen.getByTestId("profile-email")).toHaveTextContent("auth@pairup.events");
    expect(screen.getByTestId("profile-timezone")).toHaveTextContent(
      PROFILE_COPY.SNAPSHOT.TIMEZONE_PLACEHOLDER
    );
    expect(screen.getByTestId("profile-created-at")).toHaveTextContent(
      PROFILE_COPY.SNAPSHOT.CREATED_PENDING
    );
  });

  it("falls back to placeholder copy when no email is available", () => {
    render(<ProfileSection profile={null} />);

    expect(screen.getByTestId("profile-email")).toHaveTextContent(
      PROFILE_COPY.SNAPSHOT.EMAIL_PLACEHOLDER
    );
  });
});
