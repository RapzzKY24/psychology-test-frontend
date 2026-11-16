import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { SavingChip } from "@/components/admin/saving-chip";
import { CopyInviteButton } from "@/components/shared/copy-invite-button";
import { SESSION_STATUS_LABEL } from "@/lib/constants/session-status";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { OptimisticRow } from "@/lib/hooks/use-optimistic-list";
import type { SessionSummary } from "@/lib/api/types";
import type { QueryKey } from "@tanstack/react-query";
import { CloseInstansiSessionButton } from "./close-instansi-session-button";

interface InstansiSessionsTableProps {
  rows: OptimisticRow<SessionSummary>[];
  listKey: QueryKey;
  meta: PaginationMeta;
}

function StatusBadge({ status }: { status: SessionSummary["status"] }) {
  return (
    <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
      {SESSION_STATUS_LABEL[status]}
    </Badge>
  );
}

function CloseCell({ row, listKey }: { row: SessionSummary; listKey: QueryKey }) {
  if (row.status !== "ACTIVE" || row._optimistic || !row.token) return null;
  return <CloseInstansiSessionButton sessionId={row.id} listKey={listKey} />;
}

export function InstansiSessionsTable({ rows, meta, listKey }: InstansiSessionsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada sesi"
        description="Sesi yang dibuat dari daftar tes akan muncul di sini."
      />
    );
  }

  const pageHref = (next: number) => `/instansi/sesi?page=${next}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Sesi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead className="w-40">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={cn(row._optimistic && "opacity-60")}>
                <TableCell>
                  <Link href={`/instansi/sesi/${row.id}`} className="font-medium hover:underline">
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="tabular-nums">{row.slotLimit}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {row._optimistic || !row.token ? (
                      <SavingChip />
                    ) : (
                      <>
                        {row.status === "ACTIVE" ? (
                          <CopyInviteButton token={row.token} />
                        ) : row.status === "PENDING_PAYMENT" ? (
                          <Button size="sm" asChild>
                            <Link href={`/instansi/sesi/${row.id}`}>Bayar</Link>
                          </Button>
                        ) : null}
                        <CloseCell row={row} listKey={listKey} />
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/instansi/sesi/${row.id}`}>Detail</Link>
                        </Button>
                      </>
                    )}
                  </div>
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
