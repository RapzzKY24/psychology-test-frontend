import type { OrderStatus } from "./enums";

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
}

/** `GET /api/v1/orders/:id` — server-computed expiry; client clock is untrusted. */
export interface OrderDetail {
  id: string;
  status: OrderStatus;
  amount: number;
  basePrice: number;
  uniqueCode: number;
  expiresAt: string;
  /** Seconds left in the payment window, computed server-side on read. */
  secondsRemaining: number;
  userClaimedAt: string | null;
}

/** `POST /api/v1/orders/:id/claim` — idempotent. */
export interface ClaimOrderResult {
  id: string;
  userClaimedAt: string | null;
}
