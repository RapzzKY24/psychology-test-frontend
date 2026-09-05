import { describe, expect, it } from "vitest";
import { ROLE_HOME, resolveSafeNext, roleHome } from "@/features/auth/redirect";

describe("ROLE_HOME", () => {
  it("maps every role to its console", () => {
    expect(ROLE_HOME.ADMIN).toBe("/admin");
    expect(ROLE_HOME.PSYCHOLOGIST).toBe("/psikolog");
    expect(ROLE_HOME.PARTICIPANT).toBe("/dashboard");
  });
});

describe("roleHome", () => {
  it("returns the console for known roles", () => {
    expect(roleHome("ADMIN")).toBe("/admin");
    expect(roleHome("PSYCHOLOGIST")).toBe("/psikolog");
    expect(roleHome("PARTICIPANT")).toBe("/dashboard");
  });

  it("falls back to /dashboard for unknown roles", () => {
    expect(roleHome("WEIRD")).toBe("/dashboard");
    expect(roleHome("")).toBe("/dashboard");
  });
});

describe("resolveSafeNext", () => {
  it("accepts internal paths", () => {
    expect(resolveSafeNext("/hasil")).toBe("/hasil");
    expect(resolveSafeNext("/pesanan?page=2")).toBe("/pesanan?page=2");
  });

  it("rejects non-internal or unsafe targets", () => {
    expect(resolveSafeNext(null)).toBeNull();
    expect(resolveSafeNext(undefined)).toBeNull();
    expect(resolveSafeNext("")).toBeNull();
    expect(resolveSafeNext("hasil")).toBeNull();
    expect(resolveSafeNext("//evil.com")).toBeNull();
    expect(resolveSafeNext("https://evil.com")).toBeNull();
    expect(resolveSafeNext("/\\evil.com")).toBeNull();
  });

  it("never redirects back to the auth pages (loop guard)", () => {
    expect(resolveSafeNext("/masuk")).toBeNull();
    expect(resolveSafeNext("/daftar")).toBeNull();
  });
});
