"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { Employee } from "@/lib/api/types";
import { deleteEmployee } from "../api";

interface UseDeleteEmployeeOptions {
  listKey: QueryKey;
  onFailed: (message: string) => void;
}

export function useDeleteEmployee({ listKey, onFailed }: UseDeleteEmployeeOptions) {
  const list = useOptimisticList<Employee>(listKey);

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteEmployee(id);
      return id;
    },
    meta: { silentError: true },
    onMutate: async (id) => {
      const rollback = list.begin();
      list.patch((rows) => rows.filter((row) => row.id !== id));
      return { rollback };
    },
    onError: (error, _id, context) => {
      context?.rollback();
      onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => list.refetch(),
  });
}
