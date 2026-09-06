"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { Institution } from "@/lib/api/types";
import { createInstitution, updateInstitution } from "../api";
import type { InstitutionInput } from "../schemas";

interface UseInstitutionFormOptions {
  listKey: QueryKey;
  mode: "create" | "edit";
  institution?: Institution;
  onSaved: (saved: Institution) => void;
  onFailed: (message: string) => void;
}

export function useInstitutionForm({
  listKey,
  mode,
  institution,
  onSaved,
  onFailed,
}: UseInstitutionFormOptions) {
  const list = useOptimisticList<Institution>(listKey);

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
    onMutate: async (values) => {
      const rollback = list.begin();
      if (mode === "edit" && institution) {
        list.patch((rows) =>
          rows.map((row) =>
            row.id === institution.id
              ? asOptimistic({
                  ...row,
                  name: values.name,
                  contactName: values.contactName,
                  contactEmail: values.contactEmail,
                  phone: values.phone || null,
                  notes: values.notes || null,
                })
              : row,
          ),
        );
      } else {
        list.patch((rows) => [
          asOptimistic({
            id: `optimistic-${Date.now()}`,
            name: values.name,
            contactName: values.contactName,
            contactEmail: values.contactEmail,
            phone: values.phone || null,
            notes: values.notes || null,
          }),
          ...rows,
        ]);
      }
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => list.refetch(),
  });
}
