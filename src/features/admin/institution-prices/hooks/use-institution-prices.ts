"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { InstitutionTestPriceRow } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { fetchInstitutionTestPrices } from "../api";

export function useInstitutionPrices({
  institutionId,
  initial,
}: {
  institutionId: string;
  initial: ApiSuccess<InstitutionTestPriceRow[]>;
}) {
  const { data, isFetching } = useQuery({
    queryKey: qk.admin.institutions.testPrices(institutionId),
    queryFn: () => fetchInstitutionTestPrices(institutionId),
    initialData: initial,
  });

  return { rows: data.data, isFetching };
}
