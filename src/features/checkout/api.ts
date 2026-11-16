import { apiFetch } from "@/lib/api/client";
import type {
  CheckoutStatusResult,
  ClaimOrderResult,
  CreateOrderResult,
  OrderDetail,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** `POST /orders` — opens a payment window for one test; returns its instructions. */
export function createOrder(testId: string): Promise<ApiSuccess<CreateOrderResult>> {
  return apiFetch<CreateOrderResult>("/orders", { method: "POST", body: { testId } });
}

/** `GET /orders/:id` — fresh status and instructions for the payment dialog. */
export function fetchOrderDetail(orderId: string): Promise<ApiSuccess<OrderDetail>> {
  return apiFetch<OrderDetail>(`/orders/${encodeURIComponent(orderId)}`);
}

/** `POST /orders/:id/claim` — records that the buyer has seen the result link. */
export function claimOrder(orderId: string): Promise<ApiSuccess<ClaimOrderResult>> {
  return apiFetch<ClaimOrderResult>(`/orders/${encodeURIComponent(orderId)}/claim`, {
    method: "POST",
  });
}

/** `GET /payments/checkout/:ref` — invoice or order behind a checkout reference. */
export function fetchCheckoutStatus(ref: string): Promise<ApiSuccess<CheckoutStatusResult>> {
  return apiFetch<CheckoutStatusResult>(`/payments/checkout/${encodeURIComponent(ref)}`);
}

/**
 * `POST /payments/checkout/:ref/refresh` — asks the gateway whether the payment
 * settled, settles it when it did, then answers with the fresh status. The
 * Snap webhook cannot reach a local host, so this is what heals the page.
 */
export function reconcileCheckoutStatus(
  ref: string,
): Promise<ApiSuccess<CheckoutStatusResult>> {
  return apiFetch<CheckoutStatusResult>(`/payments/checkout/${encodeURIComponent(ref)}/refresh`, {
    method: "POST",
  });
}
