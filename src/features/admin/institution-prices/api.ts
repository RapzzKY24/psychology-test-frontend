import { apiFetch } from "@/lib/api/client";
import type {
  InstitutionTestPriceRow,
  SaveInstitutionTestPricesInput,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export function fetchInstitutionTestPrices(
  institutionId: string,
): Promise<ApiSuccess<InstitutionTestPriceRow[]>> {
  return apiFetch<InstitutionTestPriceRow[]>(
    `/admin/institutions/${institutionId}/test-prices`,
  );
}

export function saveInstitutionTestPrices(
  institutionId: string,
  input: SaveInstitutionTestPricesInput,
): Promise<ApiSuccess<InstitutionTestPriceRow[]>> {
  return apiFetch<InstitutionTestPriceRow[]>(
    `/admin/institutions/${institutionId}/test-prices`,
    { method: "PUT", body: input },
  );
}
