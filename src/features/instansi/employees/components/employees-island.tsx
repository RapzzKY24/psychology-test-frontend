"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Employee } from "@/lib/api/types";
import { fetchEmployees } from "../api";
import { EmployeesTable } from "./employees-table";

/** Client island — the list cache enables optimistic create/edit/delete. */
export function EmployeesIsland({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Employee[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchEmployees({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <EmployeesTable rows={data.data} meta={tableMeta} listKey={listKey} />;
}
