import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { SessionSummary } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { CopyInviteButton } from "./copy-invite-button";
import { SESSION_STATUS_LABEL } from "../constants";

interface SessionsTableProps {
  rows: SessionSummary[];
  meta: PaginationMeta;
}

export function SessionsTable({ rows, meta }: SessionsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada sesi"
        description="Buat sesi group dan bagikan tautan undangannya ke peserta."
      />
    );
  }

  const pageHref = (next: number) => `/admin/sesi?page=${next}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Sesi</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Kedaluwarsa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-44">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link href={`/admin/sesi/${row.id}`} className="font-medium hover:underline">
                    {row.title}
                  </Link>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    token: {row.token.slice(0, 8)}…
                  </p>
                </TableCell>
                <TableCell className="tabular-nums">{row.slotLimit}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.expiresAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      row.status === "ACTIVE"
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-transparent bg-muted text-muted-foreground"
                    }
                  >
                    {SESSION_STATUS_LABEL[row.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CopyInviteButton token={row.token} />
                    <Link
                      href={`/admin/sesi/${row.id}`}
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                      Detail
                    </Link>
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
