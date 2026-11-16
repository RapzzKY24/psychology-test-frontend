import type { MeOverview } from "@/lib/api/types";

/**
 * One line in "Aktivitas terakhir". The kinds come from different tables, so
 * they are merged here rather than in the API. An unpaid order is not an
 * event, but it belongs on the same list: it is the participant's next task.
 */
export type ActivityItem =
  | { kind: "ORDER_PAID"; at: string; testName: string; amount: number }
  | {
      kind: "ORDER_PENDING";
      at: string;
      testName: string;
      amount: number;
      orderId: string;
    }
  | { kind: "ATTEMPT_COMPLETED"; at: string; testName: string; attemptId: string }
  | { kind: "RESULT_APPROVED"; at: string; testName: string; attemptId: string }
  | { kind: "CERTIFICATE_ISSUED"; at: string; testName: string; number: string };

/**
 * Newest first, capped at `limit`. The endpoint returns three rows per kind,
 * which is enough for five lines even when one kind dominates.
 */
export function buildActivity(overview: MeOverview, limit = 5): ActivityItem[] {
  const items: ActivityItem[] = [
    ...overview.latestOrders.map((order): ActivityItem => ({
      kind: "ORDER_PAID",
      at: order.paidAt,
      testName: order.testName,
      amount: order.amount,
    })),
    ...overview.latestUnpaidOrders.map((order): ActivityItem => ({
      kind: "ORDER_PENDING",
      at: order.createdAt,
      testName: order.testName,
      amount: order.amount,
      orderId: order.orderId,
    })),
    ...overview.latestCompletedAttempts.map((attempt): ActivityItem => ({
      kind: "ATTEMPT_COMPLETED",
      at: attempt.completedAt,
      testName: attempt.testName,
      attemptId: attempt.attemptId,
    })),
    ...overview.latestResults.flatMap((result): ActivityItem[] =>
      result.approvedAt
        ? [
            {
              kind: "RESULT_APPROVED",
              at: result.approvedAt,
              testName: result.testName,
              attemptId: result.attemptId,
            },
          ]
        : [],
    ),
    ...overview.latestCertificates.map((certificate): ActivityItem => ({
      kind: "CERTIFICATE_ISSUED",
      at: certificate.issuedAt,
      testName: certificate.testName,
      number: certificate.number,
    })),
  ];

  return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, limit);
}
