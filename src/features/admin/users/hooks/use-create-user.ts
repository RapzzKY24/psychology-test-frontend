"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminUser } from "@/lib/api/types";
import { createAdminUser } from "../api";
import { ROLE_LABEL } from "../schemas";
import type { CreateUserInput } from "../schemas";

export function useCreateUser(onCreated?: (created: AdminUser) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateUserInput) => {
      const { data } = await createAdminUser(values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.users.all });
      toast.success(`Akun ${created.email} dibuat sebagai ${ROLE_LABEL[created.role]}.`);
      onCreated?.(created);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });
}
