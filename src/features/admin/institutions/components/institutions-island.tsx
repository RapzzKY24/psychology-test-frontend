"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Institution } from "@/lib/api/types";
import { useInstitutionsList } from "../hooks/use-institutions-list";
import { InstitutionsTable } from "./institutions-table";

/** Client island — the list cache enables optimistic create/edit. */
export function InstitutionsIsland({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Institution[]>;
  page: number;
}) {
  const { rows, meta } = useInstitutionsList({ listKey, initial, page });

  return <InstitutionsTable rows={rows} meta={meta} listKey={listKey} />;
}
