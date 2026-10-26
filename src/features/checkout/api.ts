import { apiFetch } from "@/lib/api/client";
import type { CheckoutStatusResult } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** `GET /payments/checkout/:ref` — invoice or order behind a checkout reference. */
export function fetchCheckoutStatus(ref: string): Promise<ApiSuccess<CheckoutStatusResult>> {
  return apiFetch<CheckoutStatusResult>(`/payments/checkout/${encodeURIComponent(ref)}`);
}
