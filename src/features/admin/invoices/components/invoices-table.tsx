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
import type { Invoice } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { InvoiceStatusDialog } from "./invoice-status-dialog";

interface InvoicesTableProps {
  rows: Invoice[];
  meta: PaginationMeta;
  institutionMap: Record<string, string>;
  status?: string;
}

export function InvoicesTable({
  rows,
  meta,
  institutionMap,
  status,
}: InvoicesTableProps) {
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
              <TableRow key={row.id}>
                <TableCell className="font-medium tabular-nums">{row.number}</TableCell>
                <TableCell>{institutionMap[row.institutionId] ?? "—"}</TableCell>
                <TableCell className="tabular-nums">{formatIdr(row.amount)}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.dueDate)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <InvoiceStatusDialog invoice={row} />
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
