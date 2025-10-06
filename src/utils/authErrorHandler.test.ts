import { describe, expect, it, vi } from "vitest";

import type { AuthState } from "@/lib/firebase/types";

import { createAuthErrorHandler } from "./authErrorHandler";

const createStateMock = () => {
  const setState = vi.fn();
  const handler = createAuthErrorHandler(setState as never);
  return { setState, handler };
};

describe("createAuthErrorHandler", () => {
  it("maps firebase error codes to user-friendly messages", () => {
    const { setState, handler } = createStateMock();

    handler({ code: "auth/invalid-email", message: "" });

    const updater = setState.mock.calls[0][0] as (prev: AuthState) => AuthState;
    const result = updater({ user: null, loading: true, error: null });

    expect(result).toEqual({
      user: null,
      loading: false,
      error: "Please enter a valid email address."
    });
  });

  it("falls back to generic messages for unknown errors", () => {
    const { setState, handler } = createStateMock();

    const message = handler("Something went wrong");
    const updater = setState.mock.calls[0][0] as (prev: AuthState) => AuthState;
    const result = updater({ user: null, loading: true, error: null });

    expect(message).toBe("Something went wrong");
    expect(result.error).toBe("Something went wrong");
  });
});
