"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Employee } from "@/lib/api/types";
import { useEmployeesList } from "../hooks/use-employees-list";
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
  const { rows, meta } = useEmployeesList({ listKey, initial, page });

  return <EmployeesTable rows={rows} meta={meta} listKey={listKey} />;
}
