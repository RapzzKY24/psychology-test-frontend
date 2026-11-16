import type { OrderAttempt } from "@/lib/api/types";

export type OrderAttemptTarget = { kind: "work" | "result"; href: string };

/**
 * Where a settled order sends its buyer: the work while it is still open, the
 * result once the psychologist approved it. Everything else has no destination
 * — the result page 404s until the result is released, and a returned result
 * is only explained on the history tab.
 */
export function orderAttemptTarget(attempt: OrderAttempt | null): OrderAttemptTarget | null {
  if (!attempt) return null;
  if (attempt.status === "IN_PROGRESS") {
    return { kind: "work", href: `/tes/kerjakan/${attempt.id}` };
  }
  if (attempt.resultStatus === "APPROVED") {
    return { kind: "result", href: `/hasil/${attempt.id}` };
  }
  return null;
}
