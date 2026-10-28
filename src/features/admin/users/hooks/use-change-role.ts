"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AdminUser, UserRole } from "@/lib/api/types";
import { updateUserRole } from "../api";

export function useChangeRole(
  listKey: QueryKey,
  user: AdminUser,
  onSaved: () => void,
  onFailed: (message: string) => void,
) {
  const list = useOptimisticList<AdminUser>(listKey);

  return useMutation({
    mutationFn: async (values: { role: UserRole }) => {
      const { data } = await updateUserRole(user.id, values.role);
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.id === user.id ? asOptimistic({ ...row, role: values.role }) : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => list.refetch(),
  });
}
