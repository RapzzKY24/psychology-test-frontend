import { describe, expect, it } from "vitest";
import { formFor, modeForStatus, resolveEntryState, toggleMode } from "@/features/auth/gateway";

describe("resolveEntryState", () => {
  it("starts at the first question on a plain visit", () => {
    expect(resolveEntryState({})).toEqual({
      step: "peran",
      mode: "masuk",
      peran: "pribadi",
    });
  });

  it("skips the first question when a peran is already known", () => {
    expect(resolveEntryState({ peran: "instansi" })).toEqual({
      step: "status",
      mode: "masuk",
      peran: "instansi",
    });
  });

  it("opens the form directly for an expired session", () => {
    expect(resolveEntryState({ langsung: "1", peran: "instansi" })).toEqual({
      step: "form",
      mode: "masuk",
      peran: "instansi",
    });
  });

  it("honours an explicit mode", () => {
    expect(resolveEntryState({ mode: "daftar", peran: "instansi" })).toEqual({
      step: "form",
      mode: "daftar",
      peran: "instansi",
    });
    expect(resolveEntryState({ mode: "daftar" })).toEqual({
      step: "form",
      mode: "daftar",
      peran: "pribadi",
    });
  });

  it("ignores unknown params instead of crashing", () => {
    expect(resolveEntryState({ peran: "admin", mode: "x", langsung: "yes" })).toEqual({
      step: "peran",
      mode: "masuk",
      peran: "pribadi",
    });
  });
});

describe("modeForStatus", () => {
  it("sends a returning visitor to sign-in and a new one to sign-up", () => {
    expect(modeForStatus("sudah")).toBe("masuk");
    expect(modeForStatus("belum")).toBe("daftar");
  });
});

describe("formFor", () => {
  it("maps the mode and peran to a form", () => {
    expect(formFor("masuk", "pribadi")).toBe("signin");
    expect(formFor("masuk", "instansi")).toBe("signin");
    expect(formFor("daftar", "pribadi")).toBe("signup");
    expect(formFor("daftar", "instansi")).toBe("instansi-signup");
  });
});

describe("toggleMode", () => {
  it("flips between sign-in and sign-up", () => {
    expect(toggleMode("masuk")).toBe("daftar");
    expect(toggleMode("daftar")).toBe("masuk");
  });
});
