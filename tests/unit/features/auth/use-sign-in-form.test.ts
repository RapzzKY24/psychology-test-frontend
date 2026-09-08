// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

const signInEmail = vi.fn();
const getSession = vi.fn();
vi.mock("@/lib/api/auth-client", () => ({
  authClient: {
    signIn: { email: (...args: unknown[]) => signInEmail(...args) },
    getSession: (...args: unknown[]) => getSession(...args),
  },
}));

import { useSignInForm } from "@/features/auth/hooks/use-sign-in-form";

describe("useSignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function submitAs(role: string | undefined, next?: string | null) {
    // better-auth client returns { data, error } — data is the session.
    getSession.mockResolvedValue({
      data: role ? { user: { role } } : { user: {} },
      error: null,
    });
    let onSuccess!: (data: unknown) => Promise<void>;
    signInEmail.mockImplementation(
      (_body: unknown, opts: { onSuccess: (data: unknown) => Promise<void> }) => {
        onSuccess = opts.onSuccess;
        return Promise.resolve();
      },
    );
    const { result } = renderHook(() => useSignInForm(next ?? null));
    await act(async () => {
      result.current.form.setValue("email", "a@b.co");
      result.current.form.setValue("password", "rahasia123");
      await result.current.submit();
    });
    await act(async () => {
      await onSuccess({});
    });
    return result;
  }

  it("reads the role from a fresh session — INSTANSI lands on /instansi", async () => {
    await submitAs("INSTANSI");
    expect(getSession).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/instansi");
  });

  it("prefers a safe ?next= over the role home", async () => {
    await submitAs("ADMIN", "/hasil/abc");
    expect(replace).toHaveBeenCalledWith("/hasil/abc");
  });

  it("falls back to /dashboard when the session has no role", async () => {
    await submitAs(undefined);
    expect(replace).toHaveBeenCalledWith("/dashboard");
  });
});
