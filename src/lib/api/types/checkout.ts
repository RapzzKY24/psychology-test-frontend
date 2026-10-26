/** `GET /payments/checkout/:ref` — the payment behind a checkout reference. */

export type CheckoutKind = "invoice" | "order";

/** One vocabulary for invoices and orders so the result page has one state machine. */
export type CheckoutStatus = "PAID" | "UNPAID" | "CANCELLED" | "EXPIRED";

export interface CheckoutStatusResult {
  kind: CheckoutKind;
  id: string;
  status: CheckoutStatus;
  amount: number;
  testNames: string[];
  /** Session opened by the payment; null while unpaid (orders have none). */
  sessionId: string | null;
  paidAt: string | null;
}
