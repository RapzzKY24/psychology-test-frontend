import { describe, expect, it } from "vitest";
import { deliverableFlowFor } from "@/features/public/deliverables";

describe("deliverableFlowFor", () => {
  it("keeps WPT/CPMI on its own report even for an institution", () => {
    expect(deliverableFlowFor({ slug: "wpt" }, "INSTANSI")).toBe("wpt");
    expect(deliverableFlowFor({ slug: "cpmi" }, null)).toBe("wpt");
  });

  it("gives an institution the four-page report", () => {
    expect(deliverableFlowFor({ slug: "disc-form-a" }, "INSTANSI")).toBe("instansi");
  });

  it("gives a personal buyer the web result and certificate", () => {
    expect(deliverableFlowFor({ slug: "disc-form-a" }, "PARTICIPANT")).toBe("personal");
    expect(deliverableFlowFor({ slug: "disc-form-a" }, null)).toBe("personal");
  });
});
