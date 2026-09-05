"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { SavingChip } from "@/components/admin/saving-chip";
import type { QueryKey } from "@tanstack/react-query";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { OptimisticRow } from "@/features/admin/hooks/use-optimistic-list";
import type { AdminUser } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { cn } from "@/lib/utils";
import { ChangeRoleDialog } from "./change-role-dialog";
import { ROLE_LABEL } from "../schemas";

interface UsersTableProps {
  rows: OptimisticRow<AdminUser>[];
  meta: PaginationMeta;
  currentUserId: string;
  role?: string;
  listKey: QueryKey;
}

export function UsersTable({ rows, meta, currentUserId, role, listKey }: UsersTableProps) {
  if (rows.length === 0) {
    return <TableEmpty title="Belum ada pengguna" filtered={Boolean(role)} />;
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (role) p.set("role", role);
    return `/admin/users?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="w-28">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={cn(row._optimistic && "opacity-60")}>
                <TableCell>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </TableCell>
                <TableCell>{ROLE_LABEL[row.role]}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.createdAt)}</TableCell>
                <TableCell>
                  {row._optimistic ? (
                    <SavingChip />
                  ) : (
                    <ChangeRoleDialog
                      user={row}
                      disabled={row.id === currentUserId}
                      listKey={listKey}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
