"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminTest } from "@/lib/api/types";
import { updateTest } from "../api";
import type { TestSettingsInput } from "../schemas";

/**
 * Saves the catalog settings of one test. A `timeLimitMin` of 0 means "no
 * clock", which the API spells as `null`, so that translation lives here rather
 * than in the dialog.
 */
export function useUpdateTestSettings({
  testId,
  onSlugTaken,
  onSaved,
}: {
  testId: string;
  onSlugTaken: () => void;
  onSaved: (updated: AdminTest) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ timeLimitMin, ...values }: TestSettingsInput) => {
      const { data } = await updateTest(testId, {
        ...values,
        timeLimitMin: timeLimitMin > 0 ? timeLimitMin : null,
      });
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
      toast.success("Pengaturan tes tersimpan.");
      onSaved(updated);
    },
    onError: (error) => {
      if (isApiError(error) && error.code === "slug already exists") {
        onSlugTaken();
        return;
      }
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
