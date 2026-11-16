import type { AttemptStatus, OrderStatus, PaymentProvider, ResultStatus } from "./enums";

/** `POST /api/v1/orders` response — amount = basePrice + uniqueCode (3 digits). */
export interface CreateOrderResult {
  orderId: string;
  basePrice: number;
  uniqueCode: number;
  amount: number;
  /** ISO timestamp of the payment window end. */
  expiresAt: string;
  /** Admin-uploaded static QRIS image URL; null → placeholder + amount. */
  qrisImageUrl: string | null;
  /** Which gateway produced the instructions below. */
  paymentProvider: PaymentProvider;
  /** Legacy VA number; null unless the order was created by the VA provider. */
  vaNumber: string | null;
  vaBankCode: string | null;
  /** Hosted payment page (Snap or Doku Checkout); null for manual providers. */
  paymentUrl: string | null;
  /** Snap token for the embedded popup; null for VA and manual providers. */
  paymentToken: string | null;
}

/** The attempt an order paid for; the UI decides "Kerjakan" vs "Lihat hasil". */
export interface OrderAttempt {
  id: string;
  status: AttemptStatus;
  resultStatus: ResultStatus | null;
}

/** `GET /api/v1/orders/:id` — server-computed expiry; client clock is untrusted. */
export interface OrderDetail {
  id: string;
  status: OrderStatus;
  amount: number;
  basePrice: number;
  uniqueCode: number;
  expiresAt: string;
  /** Seconds left in the payment window; null once the order is settled. */
  secondsRemaining: number | null;
  userClaimedAt: string | null;
  /** Null on rows created before the provider was recorded. */
  paymentProvider: PaymentProvider | null;
  /** Merchant QRIS image; only for a payable manual-QRIS order. */
  qrisImageUrl: string | null;
  vaNumber: string | null;
  vaBankCode: string | null;
  /** Hosted payment page (Snap or Doku Checkout); null for manual providers. */
  paymentUrl: string | null;
  /** Snap token for the embedded popup; null for VA and manual providers. */
  paymentToken: string | null;
  /** The attempt this order paid for; null until it settles. */
  attempt: OrderAttempt | null;
}

/** `POST /api/v1/orders/:id/claim` — idempotent. */
export interface ClaimOrderResult {
  id: string;
  userClaimedAt: string | null;
}

/** `GET /api/v1/me/orders` — one row of the participant's purchase history. */
export interface MeOrderItem {
  id: string;
  testName: string;
  /** Lets an expired row link back to the test page for a new purchase. */
  testSlug: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
  /** True only while the payment window is still open. */
  canPay: boolean;
  /** Hosted checkout link; present only while `canPay`. */
  paymentUrl: string | null;
  /** Null on orders settled before settlement recorded the session. */
  attempt: OrderAttempt | null;
}
