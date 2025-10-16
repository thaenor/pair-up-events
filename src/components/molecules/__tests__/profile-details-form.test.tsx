import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProfileDetailsForm from "../profile-details-form";
import { PROFILE_MESSAGES } from "@/constants/profile";

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (message: string) => toastSuccess(message),
    error: (message: string) => toastError(message),
  },
}));

describe("ProfileDetailsForm", () => {
  const baseProfile = {
    id: "user-1",
    email: "duo@pairup.events",
    displayName: "PairUp Pioneers",
    birthDate: "1996-04-15",
    gender: "non-binary",
  } as Parameters<typeof ProfileDetailsForm>[0]["profile"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits sanitized profile details", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProfileDetailsForm profile={baseProfile} onSubmit={onSubmit} isSaving={false} />
    );

    fireEvent.change(screen.getByTestId("profile-details-display-name"), {
      target: { value: "  New Display Name  " },
    });
    fireEvent.change(screen.getByTestId("profile-details-birth-date"), {
      target: { value: "1996-05-20" },
    });

    fireEvent.submit(screen.getByTestId("profile-details-form"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        displayName: "New Display Name",
        gender: baseProfile?.gender,
        birthDate: "1996-05-20",
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_SUCCESS
    );
    expect(toastError).not.toHaveBeenCalled();
  });

  it("shows an error toast when submission fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Failed"));

    render(
      <ProfileDetailsForm profile={baseProfile} onSubmit={onSubmit} isSaving={false} />
    );

    fireEvent.submit(screen.getByTestId("profile-details-form"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(toastError).toHaveBeenCalledWith(
      PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_ERROR
    );
  });

  it("disables the form controls while saving", () => {
    render(
      <ProfileDetailsForm profile={baseProfile} onSubmit={vi.fn()} isSaving={true} />
    );

    expect(screen.getByTestId("profile-details-submit")).toBeDisabled();
    expect(screen.getByTestId("profile-details-display-name")).toBeDisabled();
    expect(screen.getByTestId("profile-details-birth-date")).toBeDisabled();
    expect(screen.getByTestId("profile-details-gender")).toBeDisabled();
  });
});
