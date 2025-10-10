import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserProfileProvider } from "../UserProfileProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

const subscribeMock = vi.fn();
const updateMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/lib/firebase/user-profile", () => ({
  subscribeToUserProfile: (...args: unknown[]) => subscribeMock(...args),
  updateUserProfile: (...args: unknown[]) => updateMock(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

type UserProfileContextSnapshot = ReturnType<typeof useUserProfile>;

const TestConsumer: React.FC & { latest?: UserProfileContextSnapshot } = () => {
  const context = useUserProfile();
  TestConsumer.latest = context;

  const { profile, loading, error, isSaving } = context;

  return (
    <div>
      <span data-testid="profile-value">{profile ? profile.displayName : "none"}</span>
      <span data-testid="loading-state">{loading ? "loading" : "idle"}</span>
      <span data-testid="error-state">{error ?? ""}</span>
      <span data-testid="saving-state">{isSaving ? "saving" : "ready"}</span>
    </div>
  );
};

TestConsumer.latest = undefined;

describe("UserProfileProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty profile when user is not authenticated", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });

    render(
      <UserProfileProvider>
        <TestConsumer />
      </UserProfileProvider>
    );

    expect(screen.getByTestId("profile-value")).toHaveTextContent("none");
    expect(screen.getByTestId("loading-state")).toHaveTextContent("idle");
    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it("subscribes to the profile for the active user", async () => {
    useAuthMock.mockReturnValue({ user: { uid: "user-123" }, loading: false });
    subscribeMock.mockImplementation((uid: string, onNext: (profile: unknown) => void) => {
      if (uid === "user-123") {
        onNext({ id: "user-123", displayName: "Pair Explorer" });
      }
      return vi.fn();
    });

    render(
      <UserProfileProvider>
        <TestConsumer />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("profile-value")).toHaveTextContent("Pair Explorer");
    });
    expect(screen.getByTestId("loading-state")).toHaveTextContent("idle");
    expect(subscribeMock).toHaveBeenCalledWith(
      "user-123",
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("updates the profile when saveProfile is called", async () => {
    useAuthMock.mockReturnValue({ user: { uid: "user-123" }, loading: false });
    subscribeMock.mockImplementation((_: string, onNext: (profile: unknown) => void) => {
      onNext({ id: "user-123", displayName: "Pair Explorer" });
      return vi.fn();
    });
    updateMock.mockResolvedValue(undefined);

    render(
      <UserProfileProvider>
        <TestConsumer />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(TestConsumer.latest).toBeDefined();
    });

    await act(async () => {
      await TestConsumer.latest!.saveProfile({ displayName: "Updated" });
    });

    expect(updateMock).toHaveBeenCalledWith("user-123", { displayName: "Updated" });
  });

  it("surfaces an error when the subscription fails", async () => {
    useAuthMock.mockReturnValue({ user: { uid: "user-123" }, loading: false });
    subscribeMock.mockImplementation((_: string, __: (profile: unknown) => void, onError: (error: Error) => void) => {
      onError(new Error("permission denied"));
      return vi.fn();
    });

    render(
      <UserProfileProvider>
        <TestConsumer />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-state")).toHaveTextContent(
        "Profile customization is disabled because Firebase credentials are not configured in this environment."
      );
    });
  });

  it("throws when attempting to save without an authenticated user", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });

    render(
      <UserProfileProvider>
        <TestConsumer />
      </UserProfileProvider>
    );

    expect(TestConsumer.latest).toBeDefined();

    return expect(
      TestConsumer.latest!.saveProfile({ displayName: "Updated" })
    ).rejects.toThrow(/Cannot update profile/);
  });
});
