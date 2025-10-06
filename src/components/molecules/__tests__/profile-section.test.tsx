import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfileSection from "../profile-section";

const mockFormatDate = vi.fn((value: unknown) => `formatted-${String(value)}`);

vi.mock("@/utils/profileHelpers", () => ({
  formatDate: (value: unknown) => mockFormatDate(value)
}));

describe("ProfileSection", () => {
  const baseUser = {
    email: "person@pairup.events",
    metadata: {
      creationTime: "2024-01-01T00:00:00Z",
      lastSignInTime: "2024-02-01T00:00:00Z"
    }
  } as unknown as Parameters<typeof ProfileSection>[0]["user"];

  it("renders user email and formatted dates", () => {
    render(<ProfileSection user={baseUser} />);

    expect(screen.getByTestId("profile-email")).toHaveTextContent("person@pairup.events");
    expect(mockFormatDate).toHaveBeenCalledWith("2024-01-01T00:00:00Z");
    expect(mockFormatDate).toHaveBeenCalledWith("2024-02-01T00:00:00Z");
    expect(screen.getByTestId("profile-created-at")).toHaveTextContent("formatted-2024-01-01T00:00:00Z");
    expect(screen.getByTestId("profile-last-sign-in")).toHaveTextContent("formatted-2024-02-01T00:00:00Z");
  });

  it("omits last sign-in when not available", () => {
    render(
      <ProfileSection
        user={{
          ...baseUser,
          metadata: {
            creationTime: "2024-01-01T00:00:00Z",
            lastSignInTime: undefined
          }
        }}
      />
    );

    expect(screen.queryByTestId("profile-last-sign-in")).not.toBeInTheDocument();
  });
});
