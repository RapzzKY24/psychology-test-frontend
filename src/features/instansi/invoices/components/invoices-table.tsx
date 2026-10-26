import Link from "next/link";
import { Clock } from "lucide-react";
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
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { InstansiInvoiceListItem } from "@/lib/api/types";
import type { InvoiceStatus } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";
import { cn } from "@/lib/utils";
import { INVOICE_STATUS_LABEL, isInvoiceExpired } from "../constants";
import { InvoiceCountdown } from "./invoice-countdown";

interface InvoicesTableProps {
  rows: InstansiInvoiceListItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "outline"> = {
  UNPAID: "secondary",
  PAID: "default",
  CANCELLED: "outline",
};

function InvoiceRow({ row }: { row: InstansiInvoiceListItem }) {
  const isUnpaid = row.status === "UNPAID";
  const expired = isUnpaid && isInvoiceExpired(row.expiresAt);
  const detailHref = `/instansi/tagihan/${row.id}`;

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap font-medium">
        <Link href={detailHref} className="hover:underline">
          {row.number}
        </Link>
      </TableCell>
      <TableCell>
        <p className="font-medium">{row.sessionTitle ?? "—"}</p>
        {row.slotLimit !== null && (
          <p className="text-muted-foreground text-xs">{row.slotLimit} peserta</p>
        )}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">{formatIdr(row.amount)}</TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[row.status]}>{INVOICE_STATUS_LABEL[row.status]}</Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">
        {isUnpaid && row.expiresAt ? (
          <span className={cn("flex items-center gap-1", expired && "text-muted-foreground")}>
            <Clock className="size-3.5" aria-hidden />
            <InvoiceCountdown expiresAt={row.expiresAt} />
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="w-32">
        {isUnpaid &&
          (expired ? (
            <Button
              size="sm"
              variant="outline"
              disabled
              title="Waktu pembayaran sudah habis — buat sesi baru untuk mencoba lagi."
            >
              Kedaluwarsa
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href={detailHref}>Bayar</Link>
            </Button>
          ))}
        {!isUnpaid && (
          <Button size="sm" variant="ghost" asChild>
            <Link href={detailHref}>Detail</Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export function InvoicesTable({ rows, meta, pageHref }: InvoicesTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada tagihan"
        description="Tagihan muncul otomatis setiap kali kamu checkout sesi."
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
              <TableHead>Sesi</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sisa waktu</TableHead>
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <InvoiceRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
