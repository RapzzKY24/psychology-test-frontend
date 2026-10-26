import { apiFetch } from "@/lib/api/client";
import type { CheckoutStatusResult } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

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
