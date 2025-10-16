import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProfilePreferencesForm from "../profile-preferences-form";
import { PROFILE_MESSAGES } from "@/constants/profile";

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (message: string) => toastSuccess(message),
    error: (message: string) => toastError(message),
  },
}));

describe("ProfilePreferencesForm", () => {
  const baseProfile = {
    id: "user-1",
    funFact: "We host board game nights",
    likes: "Escape rooms",
    dislikes: "Rainy hikes",
    hobbies: "Rock climbing",
  } as Parameters<typeof ProfilePreferencesForm>[0]["profile"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits trimmed preference values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProfilePreferencesForm profile={baseProfile} onSubmit={onSubmit} isSaving={false} />
    );

    fireEvent.change(screen.getByTestId("profile-preferences-fun-fact"), {
      target: { value: "  Loves spontaneous road trips " },
    });
    fireEvent.change(screen.getByTestId("profile-preferences-likes"), {
      target: { value: "Art walks" },
    });

    fireEvent.submit(screen.getByTestId("profile-preferences-form"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        funFact: "Loves spontaneous road trips",
        likes: "Art walks",
        dislikes: baseProfile?.dislikes,
        hobbies: baseProfile?.hobbies,
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_SUCCESS
    );
  });

  it("shows an error toast when saving fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("fail"));

    render(
      <ProfilePreferencesForm profile={baseProfile} onSubmit={onSubmit} isSaving={false} />
    );

    fireEvent.submit(screen.getByTestId("profile-preferences-form"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalledWith(
      PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_ERROR
    );
  });

  it("disables the form controls while saving", () => {
    render(
      <ProfilePreferencesForm profile={baseProfile} onSubmit={vi.fn()} isSaving={true} />
    );

    expect(screen.getByTestId("profile-preferences-submit")).toBeDisabled();
    expect(screen.getByTestId("profile-preferences-fun-fact")).toBeDisabled();
    expect(screen.getByTestId("profile-preferences-likes")).toBeDisabled();
    expect(screen.getByTestId("profile-preferences-dislikes")).toBeDisabled();
    expect(screen.getByTestId("profile-preferences-hobbies")).toBeDisabled();
  });
});
