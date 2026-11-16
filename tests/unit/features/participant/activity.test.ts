import { describe, expect, it } from "vitest";
import { buildActivity } from "@/features/participant/activity";
import type { MeOverview } from "@/lib/api/types";

function overview(overrides: Partial<MeOverview> = {}): MeOverview {
  return {
    counts: {
      inProgress: 0,
      awaitingReview: 0,
      resultsReady: 0,
      certificatesReady: 0,
      pendingOrders: 0,
    },
    activeAttempts: [],
    latestResults: [],
    latestCertificates: [],
    latestOrders: [],
    latestUnpaidOrders: [],
    latestCompletedAttempts: [],
    ...overrides,
  };
}

describe("buildActivity", () => {
  it("merges the four event kinds newest first", () => {
    const items = buildActivity(
      overview({
        latestOrders: [
          { orderId: "o1", testName: "IST", amount: 75000, paidAt: "2026-11-14T07:00:00Z" },
        ],
        latestCompletedAttempts: [
          { attemptId: "a1", testName: "DISC Form A", completedAt: "2026-11-15T10:00:00Z" },
        ],
        latestResults: [
          {
            attemptId: "a2",
            testName: "16PF",
            patternCode: "D",
            approvedAt: "2026-11-16T08:00:00Z",
          },
        ],
        latestCertificates: [
          {
            id: "c1",
            number: "012/DISC/XI/2026",
            testName: "DISC Form A",
            issuedAt: "2026-11-16T09:00:00Z",
          },
        ],
      }),
    );

    expect(items.map((item) => item.kind)).toEqual([
      "CERTIFICATE_ISSUED",
      "RESULT_APPROVED",
      "ATTEMPT_COMPLETED",
      "ORDER_PAID",
    ]);
  });

  it("keeps only the five newest events", () => {
    const orders = Array.from({ length: 3 }, (_, index) => ({
      orderId: `o${index}`,
      testName: `Tes ${index}`,
      amount: 50000,
      paidAt: `2026-11-1${index}T07:00:00Z`,
    }));
    const certificates = Array.from({ length: 3 }, (_, index) => ({
      id: `c${index}`,
      number: `00${index}/X/2026`,
      testName: `Tes ${index}`,
      issuedAt: `2026-11-2${index}T09:00:00Z`,
    }));

    const items = buildActivity(
      overview({ latestOrders: orders, latestCertificates: certificates }),
    );

    expect(items).toHaveLength(5);
    expect(items[0]?.kind).toBe("CERTIFICATE_ISSUED");
  });

  it("lists an unpaid order as the next thing to do", () => {
    const items = buildActivity(
      overview({
        latestUnpaidOrders: [
          {
            orderId: "o9",
            testName: "DISC Form A",
            amount: 75000,
            createdAt: "2026-11-16T10:00:00Z",
            expiresAt: "2026-11-16T11:00:00Z",
          },
        ],
      }),
    );

    expect(items).toEqual([
      {
        kind: "ORDER_PENDING",
        at: "2026-11-16T10:00:00Z",
        testName: "DISC Form A",
        amount: 75000,
        orderId: "o9",
      },
    ]);
  });

  it("drops a result that has no approval date", () => {    const items = buildActivity(
      overview({
        latestResults: [{ attemptId: "a1", testName: "DISC", patternCode: "D", approvedAt: null }],
      }),
    );

    expect(items).toEqual([]);
  });

  it("returns nothing before the first event", () => {
    expect(buildActivity(overview())).toEqual([]);
  });
});
