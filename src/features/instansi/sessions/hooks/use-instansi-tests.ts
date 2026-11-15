"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchPublishedTests } from "../api";
import type { InstansiTestOption } from "../types";
import { INSTANSI_TESTS_STALE_MS } from "../constants";

/**
 * Purchasable tests for the checkout form. The RSC page passes its result as
 * `initialData`; without it (server fetch failed) this hook owns the retry.
 */
export function useInstansiTests(initialData?: InstansiTestOption[]) {
  return useQuery({
    queryKey: qk.instansi.tests.list(),
    queryFn: async () => (await fetchPublishedTests()).data,
    initialData,
    staleTime: INSTANSI_TESTS_STALE_MS,
  });
}
