"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/lib/api/query-keys";
import type { SaveInstitutionTestPricesInput } from "@/lib/api/types";
import { saveInstitutionTestPrices } from "../api";
import { DEAL_PRICE_SAVED } from "../constants";

/** Replace-all save; the global MutationCache already reports failures. */
export function useSaveInstitutionPrices(institutionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveInstitutionTestPricesInput) =>
      saveInstitutionTestPrices(institutionId, input),
    onSuccess: () => {
      toast.success(DEAL_PRICE_SAVED);
      void queryClient.invalidateQueries({
        queryKey: qk.admin.institutions.testPrices(institutionId),
      });
    },
  });
}
