import { apiFetchServer } from "@/lib/api/server";
import type { CheckoutStatusResult } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export function fetchCheckoutStatusServer(ref: string): Promise<ApiSuccess<CheckoutStatusResult>> {
  return apiFetchServer<CheckoutStatusResult>(`/payments/checkout/${encodeURIComponent(ref)}`);
}
