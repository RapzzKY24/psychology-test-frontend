"use client";

import { useState } from "react";
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
import type { QueryKey } from "@tanstack/react-query";
import type { OptimisticRow } from "@/features/admin/hooks/use-optimistic-list";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { Invoice } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import { InvoiceDetailDialog } from "./invoice-detail-dialog";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { InvoiceStatusDialog } from "./invoice-status-dialog";
import { SavingChip } from "@/components/admin/saving-chip";
import { cn } from "@/lib/utils";

interface InvoicesTableProps {
  rows: OptimisticRow<Invoice>[];
  listKey: QueryKey;
  meta: PaginationMeta;
  institutionMap: Record<string, string>;
  status?: string;
}

export function InvoicesTable({
  rows,
  meta,
  listKey,
  institutionMap,
  status,
}: InvoicesTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada invoice"
        description="Invoice B2B dibuat per institusi dengan nomor otomatis INV-YYYY-NNNN."
        filtered={Boolean(status)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    return `/admin/invoice?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Institusi</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                tabIndex={row._optimistic ? -1 : 0}
                onClick={() => {
                  if (!row._optimistic) setOpenId(row.id);
                }}
                onKeyDown={(event) => {
                  if (row._optimistic) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setOpenId(row.id);
                }}
                className={cn(
                  !row._optimistic && "cursor-pointer",
                  "focus-visible:bg-muted/50 focus-visible:outline-none",
                  row._optimistic && "opacity-60",
                )}
              >
                <TableCell className="font-medium tabular-nums">{row.number}</TableCell>
                <TableCell>{institutionMap[row.institutionId] ?? "—"}</TableCell>
                <TableCell className="tabular-nums">{formatIdr(row.amount)}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.dueDate)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  {row._optimistic ? (
                    <SavingChip />
                  ) : (
                    // The row opens the detail popup; the status button is its
                    // own action and must not trigger it.
                    <div onClick={(event) => event.stopPropagation()}>
                      <InvoiceStatusDialog listKey={listKey} invoice={row} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
      <InvoiceDetailDialog invoiceId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
