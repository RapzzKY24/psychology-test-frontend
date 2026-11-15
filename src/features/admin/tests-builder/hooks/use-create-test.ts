"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminTest } from "@/lib/api/types";
import { createTest } from "../api";
import type { CreateTestInput } from "../schemas";

/**
 * Creates a test and refreshes the admin list. What happens on screen after
 * that (closing the dialog, resetting the form, opening the builder) is the
 * dialog's business, so it arrives as `onCreated`.
 */
export function useCreateTest({
  onSlugTaken,
  onCreated,
}: {
  onSlugTaken: () => void;
  onCreated: (created: AdminTest) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateTestInput) => {
      const { data } = await createTest(values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (created) => {
      toast.success("Tes dibuat — lengkapi soal dan interpretasi.");
      void queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
      onCreated(created);
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
