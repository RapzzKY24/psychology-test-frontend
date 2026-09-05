"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminUser, UserRole } from "@/lib/api/types";
import { updateUserRole } from "../api";
import { ROLE_LABEL } from "../schemas";

export function useChangeRole(
  user: AdminUser,
  onOwnRoleBlocked: (message: string) => void,
  onSaved: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: { role: UserRole }) => {
      const { data } = await updateUserRole(user.id, values.role);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.users.all });
      toast.success(`Role ${user.email} → ${ROLE_LABEL[updated.role]}.`);
      onSaved();
    },
    onError: (error) => {
      if (isApiError(error) && error.code === "cannot_change_own_role") {
        onOwnRoleBlocked("Anda tidak bisa mengubah role akun sendiri.");
        return;
      }
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
