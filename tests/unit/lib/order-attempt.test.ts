import { describe, expect, it } from "vitest";
import { orderAttemptTarget } from "@/lib/order-attempt";
import type { OrderAttempt } from "@/lib/api/types";

function attempt(overrides: Partial<OrderAttempt>): OrderAttempt {
  return { id: "a1", status: "IN_PROGRESS", resultStatus: null, ...overrides };
}

describe("orderAttemptTarget", () => {
  it("has no destination without an attempt", () => {
    expect(orderAttemptTarget(null)).toBeNull();
  });

  it("sends an open attempt to the test", () => {
    expect(orderAttemptTarget(attempt({}))).toEqual({
      kind: "work",
      href: "/tes/kerjakan/a1",
    });
  });

  it("sends an approved result to the result page", () => {
    expect(
      orderAttemptTarget(attempt({ status: "COMPLETED", resultStatus: "APPROVED" })),
    ).toEqual({ kind: "result", href: "/hasil/a1" });
  });

  it("waits for review instead of linking to a page that would 404", () => {
    expect(
      orderAttemptTarget(attempt({ status: "COMPLETED", resultStatus: "PENDING_REVIEW" })),
    ).toBeNull();
  });

  it("leaves a returned result to the history tab", () => {
    expect(
      orderAttemptTarget(attempt({ status: "COMPLETED", resultStatus: "RETURNED" })),
    ).toBeNull();
  });

  it("leaves an abandoned attempt alone", () => {
    expect(orderAttemptTarget(attempt({ status: "ABANDONED" }))).toBeNull();
  });
});
