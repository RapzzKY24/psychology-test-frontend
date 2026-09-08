// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/error";

const replace = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

const registerInstitution = vi.fn();
vi.mock("@/lib/api/instansi-auth", () => ({
  registerInstitution: (...args: unknown[]) => registerInstitution(...args),
}));

import { useInstansiSignUpForm } from "@/features/auth/hooks/use-instansi-sign-up-form";

const valid = {
  companyName: "PT Maju Jaya",
  picName: "Budi Santoso",
  email: "hr@majujaya.co.id",
  phone: "0215551234",
  address: "Jl. Sudirman No. 1 Jakarta",
  password: "rahasia123",
  confirmPassword: "rahasia123",
};

describe("useInstansiSignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /instansi on 201", async () => {
    registerInstitution.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useInstansiSignUpForm());

    await act(async () => {
      for (const [k, v] of Object.entries(valid)) {
        result.current.form.setValue(k as keyof typeof valid, v);
      }
      await result.current.submit();
    });

    expect(registerInstitution).toHaveBeenCalledWith(
      expect.objectContaining({ companyName: "PT Maju Jaya", email: "hr@majujaya.co.id" }),
    );
    // confirmPassword never leaves the client.
    expect(registerInstitution.mock.calls[0]?.[0]).not.toHaveProperty("confirmPassword");
    expect(replace).toHaveBeenCalledWith("/instansi");
  });

  it("maps 409 to the email field plus the /masuk callout", async () => {
    registerInstitution.mockRejectedValue(new ApiError(409, "duplicate_email"));
    const { result } = renderHook(() => useInstansiSignUpForm());

    await act(async () => {
      for (const [k, v] of Object.entries(valid)) {
        result.current.form.setValue(k as keyof typeof valid, v);
      }
      await result.current.submit();
    });

    expect(result.current.form.formState.errors.email?.message).toBe(
      "Email sudah terdaftar — silakan masuk.",
    );
    expect(result.current.duplicateEmail).toBe(true);
    expect(replace).not.toHaveBeenCalled();
  });

  it("maps 422 details[] to per-field errors", async () => {
    registerInstitution.mockRejectedValue(
      new ApiError(422, "validation_failed", ["companyName: Nama perusahaan minimal 2 karakter."]),
    );
    const { result } = renderHook(() => useInstansiSignUpForm());

    await act(async () => {
      for (const [k, v] of Object.entries(valid)) {
        result.current.form.setValue(k as keyof typeof valid, v);
      }
      await result.current.submit();
    });

    expect(result.current.form.formState.errors.companyName?.message).toContain("companyName");
    expect(replace).not.toHaveBeenCalled();
  });
});
