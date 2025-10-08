import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useContext } from "react";

import { AuthProvider } from "../AuthProvider";
import { AuthContext } from "../AuthContext";
import type { AuthContextType } from "@/lib/firebase/types";

const mockAuth = vi.hoisted(() => ({
  currentUser: null as unknown,
})) as { currentUser: unknown };

const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockSendEmailVerification = vi.fn();
const mockSendPasswordResetEmail = vi.fn();
const mockDeleteUser = vi.fn();
const mockLoadAuthResources = vi.fn();

let authObserver: ((user: unknown) => void) | undefined;

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>("firebase/auth");
  return {
    ...actual,
    signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
    createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
    signOut: (...args: unknown[]) => mockSignOut(...args),
    onAuthStateChanged: (...args: unknown[]) => {
      authObserver = args[1] as (user: unknown) => void;
      return mockOnAuthStateChanged(...args);
    },
    sendEmailVerification: (...args: unknown[]) => mockSendEmailVerification(...args),
    sendPasswordResetEmail: (...args: unknown[]) => mockSendPasswordResetEmail(...args),
    deleteUser: (...args: unknown[]) => mockDeleteUser(...args),
  };
});

const mockSetUser = vi.fn();

vi.mock("@/lib/firebase", () => ({
  loadAuthResources: (...args: unknown[]) => mockLoadAuthResources(...args),
}));

vi.mock("@/lib/sentry", () => ({
  setUser: (...args: unknown[]) => mockSetUser(...args),
}));

const TestConsumer = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within provider");
  }
  TestConsumer.latest = context;
  return null;
};

TestConsumer.latest = undefined as AuthContextType | undefined;

describe("AuthProvider", () => {
  const renderProvider = () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    mockAuth.currentUser = null;
    authObserver = undefined;
    TestConsumer.latest = undefined;
    mockSignInWithEmailAndPassword.mockReset();
    mockCreateUserWithEmailAndPassword.mockReset();
    mockSignOut.mockReset();
    mockOnAuthStateChanged.mockReset();
    mockOnAuthStateChanged.mockReturnValue(vi.fn());
    mockSendEmailVerification.mockReset();
    mockSendPasswordResetEmail.mockReset();
    mockDeleteUser.mockReset();
    mockLoadAuthResources.mockReset();
    mockLoadAuthResources.mockResolvedValue({
      authModule: {
        onAuthStateChanged: (...args: unknown[]) => {
          authObserver = args[1] as (user: unknown) => void;
          return mockOnAuthStateChanged(...args);
        },
        signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
        createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
        signOut: (...args: unknown[]) => mockSignOut(...args),
        sendEmailVerification: (...args: unknown[]) => mockSendEmailVerification(...args),
        sendPasswordResetEmail: (...args: unknown[]) => mockSendPasswordResetEmail(...args),
        deleteUser: (...args: unknown[]) => mockDeleteUser(...args),
      },
      auth: mockAuth,
    });
    mockSetUser.mockReset();
  });

  const resolveAuth = async (user: unknown) => {
    await waitFor(() => {
      expect(authObserver).toBeDefined();
    });
    await act(async () => {
      authObserver?.(user);
    });
  };

  it("initializes auth state and synchronizes with Sentry", async () => {
    renderProvider();

    await resolveAuth({ uid: "123", email: "member@pairup.events" });

    await waitFor(() => {
      expect(TestConsumer.latest?.loading).toBe(false);
      expect(TestConsumer.latest?.user).toEqual({ uid: "123", email: "member@pairup.events" });
    });
    expect(mockSetUser).toHaveBeenCalledWith({ id: "123", email: "member@pairup.events" });

    await resolveAuth(null);

    await waitFor(() => {
      expect(TestConsumer.latest?.user).toBeNull();
    });
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it("signs in with email and toggles loading state", async () => {
    renderProvider();
    await resolveAuth(null);

    mockSignInWithEmailAndPassword.mockResolvedValueOnce(undefined);

    await act(async () => {
      await TestConsumer.latest!.signInWithEmail("hello@pairup.events", "password123");
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "hello@pairup.events",
      "password123"
    );
    expect(TestConsumer.latest?.loading).toBe(false);
    expect(TestConsumer.latest?.error).toBeNull();
  });

  it("surfaces authentication errors and keeps them accessible", async () => {
    renderProvider();
    await resolveAuth(null);

    const authError = { code: "auth/invalid-credential" };
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(authError);

    let thrownError: unknown;
    await act(async () => {
      try {
        await TestConsumer.latest!.signInWithEmail("oops@pairup.events", "wrong");
      } catch (error) {
        thrownError = error;
      }
    });
    expect(thrownError).toBe(authError);

    await waitFor(() => {
      expect(TestConsumer.latest?.error).toBe(
        "Invalid email or password. Please check your credentials and try again."
      );
    });

    act(() => {
      TestConsumer.latest!.clearError();
    });
    expect(TestConsumer.latest?.error).toBeNull();
  });

  it("signs up new users and sends verification emails", async () => {
    renderProvider();
    await resolveAuth(null);

    const newUser = { uid: "456", email: "new@pairup.events" };
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: newUser });
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    await act(async () => {
      await TestConsumer.latest!.signUpWithEmail("new@pairup.events", "password");
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "new@pairup.events",
      "password"
    );
    expect(mockSendEmailVerification).toHaveBeenCalledWith(newUser);
  });

  it("blocks email verification when no user is signed in", async () => {
    renderProvider();
    await resolveAuth(null);

    let verificationError: unknown;
    await act(async () => {
      try {
        await TestConsumer.latest!.sendEmailVerification();
      } catch (error) {
        verificationError = error;
      }
    });
    expect((verificationError as Error).message).toBe("No user is currently signed in");

    await waitFor(() => {
      expect(TestConsumer.latest?.error).toBe("No user is currently signed in");
    });
  });

  it("supports password reset, sign out, and account deletion", async () => {
    renderProvider();
    await resolveAuth(null);

    mockSignOut.mockResolvedValueOnce(undefined);
    mockSendPasswordResetEmail.mockResolvedValueOnce(undefined);
    mockDeleteUser.mockResolvedValueOnce(undefined);

    await act(async () => {
      await TestConsumer.latest!.sendPasswordReset("reset@pairup.events");
      await TestConsumer.latest!.signOut();
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, "reset@pairup.events");
    expect(mockSignOut).toHaveBeenCalledWith(mockAuth);

    mockAuth.currentUser = { uid: "999" } as unknown;
    await act(async () => {
      await TestConsumer.latest!.deleteUserAccount();
    });
    expect(mockDeleteUser).toHaveBeenCalled();
  });

  it("throws when deleting without an authenticated user", async () => {
    renderProvider();
    await resolveAuth(null);

    let deletionError: unknown;
    await act(async () => {
      try {
        await TestConsumer.latest!.deleteUserAccount();
      } catch (error) {
        deletionError = error;
      }
    });
    expect((deletionError as Error).message).toBe("No user is currently signed in");

    await waitFor(() => {
      expect(TestConsumer.latest?.error).toBe("No user is currently signed in");
    });
  });
});
