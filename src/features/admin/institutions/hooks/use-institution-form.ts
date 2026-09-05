"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { Institution } from "@/lib/api/types";
import { createInstitution, updateInstitution } from "../api";
import type { InstitutionInput } from "../schemas";

interface UseInstitutionFormOptions {
  mode: "create" | "edit";
  institution?: Institution;
  onSaved: (saved: Institution) => void;
}

export function useInstitutionForm({ mode, institution, onSaved }: UseInstitutionFormOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: InstitutionInput) => {
      const payload = {
        ...values,
        phone: values.phone || undefined,
        notes: values.notes || undefined,
      };
      const { data } =
        mode === "edit" && institution
          ? await updateInstitution(institution.id, payload)
          : await createInstitution(payload);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.institutions.all });
      toast.success(
        mode === "edit" ? `Institusi ${saved.name} diperbarui.` : `Institusi ${saved.name} dibuat.`,
      );
      onSaved(saved);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });
}
