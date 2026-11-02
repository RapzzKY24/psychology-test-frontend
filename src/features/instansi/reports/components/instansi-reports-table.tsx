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
import { ReportStatusBadge } from "@/components/shared/report-status-badge";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { InstansiReportItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { InstansiReportDownloadButton } from "./instansi-report-download-button";

interface InstansiReportsTableProps {
  rows: InstansiReportItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

/**
 * Only ACTIVE reports can be downloaded: the backend answers 409 for a revoked
 * one, so the button is not rendered rather than failing on click.
 */
export function InstansiReportsTable({ rows, meta, pageHref }: InstansiReportsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada laporan"
        description="Laporan muncul setelah psikolog menerbitkannya untuk peserta sesi ini."
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
              <TableHead>Tanggal terbit</TableHead>
              <TableHead className="w-36">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  <span className="tabular-nums">{row.number ?? "—"}</span>
                  {row.revision !== null && row.revision > 1 && (
                    <span className="ml-1 text-xs text-muted-foreground">rev. {row.revision}</span>
                  )}
                </TableCell>
                <TableCell>{row.participantName}</TableCell>
                <TableCell className="text-muted-foreground">{row.sessionTitle}</TableCell>
                <TableCell>
                  <ReportStatusBadge status={row.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {formatIdDate(row.issuedAt)}
                </TableCell>
                <TableCell>
                  {row.status === "ACTIVE" ? (
                    <InstansiReportDownloadButton id={row.id} number={row.number} />
                  ) : (
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
