/** Poll cadence while a payment is still waiting for the webhook. */
export const CHECKOUT_POLL_MS = 3000;

/** Snap statuses that mean "the money moved, our DB is just behind". */
export const SETTLED_HINTS = ["settlement", "capture"] as const;
