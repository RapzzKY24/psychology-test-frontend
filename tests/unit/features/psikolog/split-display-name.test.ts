import { describe, expect, it } from "vitest";
import {
  joinDisplayName,
  splitDisplayName,
} from "@/features/psikolog/profil/utils/split-display-name";

describe("splitDisplayName", () => {
  it("splits on the last comma so multi-comma names keep working", () => {
    expect(splitDisplayName("Dr. Ayu Lestari, M.Psi., Psikolog")).toEqual({
      fullName: "Dr. Ayu Lestari, M.Psi.",
      degree: "Psikolog",
    });
  });

  it("returns an empty degree when there is no comma", () => {
    expect(splitDisplayName("Budi Santoso")).toEqual({
      fullName: "Budi Santoso",
      degree: "",
    });
  });

  it("trims whitespace around both parts", () => {
    expect(splitDisplayName("  Ayu  ,  M.Psi.  ")).toEqual({
      fullName: "Ayu",
      degree: "M.Psi.",
    });
  });

  it("returns an empty degree for a trailing comma", () => {
    expect(splitDisplayName("Ayu, ")).toEqual({ fullName: "Ayu", degree: "" });
  });
});

describe("joinDisplayName", () => {
  it("joins name and degree with a comma", () => {
    expect(
      joinDisplayName({ fullName: "Dr. Ayu Lestari, M.Psi.", degree: "Psikolog" }),
    ).toBe("Dr. Ayu Lestari, M.Psi., Psikolog");
  });

  it("returns just the name when degree is empty", () => {
    expect(joinDisplayName({ fullName: "Budi Santoso", degree: "" })).toBe(
      "Budi Santoso",
    );
  });

  it("round-trips a split value", () => {
    const original = "Dr. Ayu Lestari, M.Psi., Psikolog";
    expect(joinDisplayName(splitDisplayName(original))).toBe(original);
  });
});
