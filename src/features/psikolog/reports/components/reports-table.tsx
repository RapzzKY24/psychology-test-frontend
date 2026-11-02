import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { ReportListItem } from "@/lib/api/types";
import { ReportStatusBadge } from "@/components/shared/report-status-badge";
import { ReportDownloadButton } from "./report-download-button";

interface ReportsTableProps {
  rows: ReportListItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

export function ReportsTable({ rows, meta, pageHref }: ReportsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada laporan"
        description="Laporan yang sudah dimulai atau diterbitkan akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nomor</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Sesi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  {row.number ? (
                    <span className="tabular-nums">{row.number}</span>
                  ) : (
                    <span className="text-muted-foreground">Belum bernomor</span>
                  )}
                  {row.revision !== null && row.revision > 1 && (
                    <span className="ml-1 text-xs text-muted-foreground">rev. {row.revision}</span>
                  )}
                </TableCell>
                <TableCell>{row.participantName}</TableCell>
                <TableCell className="text-muted-foreground">{row.sessionTitle}</TableCell>
                <TableCell>
                  <ReportStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  {row.status === "DRAFT" && (
                    <Button size="sm" asChild>
                      <Link href={`/psikolog/laporan/${row.participantId}`}>Isi Laporan</Link>
                    </Button>
                  )}
                  {row.status === "ACTIVE" && (
                    <ReportDownloadButton id={row.id} number={row.number} />
                  )}
                  {(row.status === "REVOKED" || row.status === "SUPERSEDED") && (
                    <span className="text-sm text-muted-foreground">Tidak berlaku</span>
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
