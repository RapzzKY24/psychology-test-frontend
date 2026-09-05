"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AdminUser } from "@/lib/api/types";
import { createAdminUser } from "../api";
import { ROLE_LABEL } from "../schemas";
import type { CreateUserInput } from "../schemas";

export function useCreateUser(listKey: QueryKey, onCreated: (created: AdminUser) => void) {
  const list = useOptimisticList<AdminUser>(listKey);

  return useMutation({
    mutationFn: async (values: CreateUserInput) => {
      const { data } = await createAdminUser(values);
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      list.patch((rows) => [
        asOptimistic({
          id: `optimistic-${Date.now()}`,
          name: values.name,
          email: values.email,
          role: values.role,
          createdAt: new Date().toISOString(),
        }),
        ...rows,
      ]);
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: (created) => {
      toast.success(`Akun ${created.email} dibuat sebagai ${ROLE_LABEL[created.role]}.`);
      onCreated(created);
    },
    onSettled: () => list.refetch(),
  });
}
