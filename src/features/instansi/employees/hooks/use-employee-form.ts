"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { Employee } from "@/lib/api/types";
import { createEmployee, updateEmployee } from "../api";
import { toCreatePayload, toUpdatePayload } from "../payload";
import type { EmployeeInput } from "../schemas";

interface UseEmployeeFormOptions {
  listKey: QueryKey;
  mode: "create" | "edit";
  employee?: Employee;
  onSaved: (saved: Employee) => void;
  onFailed: (message: string) => void;
}

export function useEmployeeForm({
  listKey,
  mode,
  employee,
  onSaved,
  onFailed,
}: UseEmployeeFormOptions) {
  const list = useOptimisticList<Employee>(listKey);

  return useMutation({
    mutationFn: async (values: EmployeeInput) => {
      const { data } =
        mode === "edit" && employee
          ? await updateEmployee(employee.id, toUpdatePayload(values))
          : await createEmployee(toCreatePayload(values));
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      if (mode === "edit" && employee) {
        list.patch((rows) =>
          rows.map((row) =>
            row.id === employee.id
              ? asOptimistic({ ...row, ...values })
              : row,
          ),
        );
      } else {
        list.patch((rows) => [
          asOptimistic({
            id: `optimistic-${Date.now()}`,
            name: values.name,
            destinationCountry: values.destinationCountry,
            idType: values.idType,
            idNumber: values.idNumber,
            birthDate: values.birthDate || null,
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
    onSuccess: (saved) => onSaved(saved),
  });
}
