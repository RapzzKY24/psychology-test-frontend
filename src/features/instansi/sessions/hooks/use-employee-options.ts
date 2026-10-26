"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/features/instansi/employees/api";
import { qk } from "@/lib/api/query-keys";
import { EMPLOYEE_PICKER_LIMIT } from "../constants";

/**
 * Institution roster for the add/swap picker. Loaded lazily — the picker is
 * closed on first paint.
 */
export function useEmployeeOptions(enabled: boolean) {
  return useQuery({
    queryKey: qk.instansi.employees.list({ page: 1 }),
    queryFn: async () => (await fetchEmployees({ page: 1, limit: EMPLOYEE_PICKER_LIMIT })).data,
    enabled,
    staleTime: 30_000,
  });
}
