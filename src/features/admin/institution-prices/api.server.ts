import { apiFetchServer } from "@/lib/api/server";
import type { InstitutionTestPriceRow } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Server-only fetcher for the institution price editor (RSC page). */
export function fetchInstitutionTestPricesServer(
  institutionId: string,
): Promise<ApiSuccess<InstitutionTestPriceRow[]>> {
  return apiFetchServer<InstitutionTestPriceRow[]>(
    `/admin/institutions/${institutionId}/test-prices`,
  );
}
