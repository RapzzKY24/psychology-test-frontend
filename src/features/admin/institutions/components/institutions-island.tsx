"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Institution } from "@/lib/api/types";
import { fetchInstitutions } from "../api";
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
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchInstitutions({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <InstitutionsTable rows={data.data} meta={tableMeta} listKey={listKey} />;
}
