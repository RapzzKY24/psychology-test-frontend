import Link from "next/link";
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
import { ExpiryCountdown } from "@/components/shared/expiry-countdown";
import { PayOrderButton } from "@/features/checkout/components/pay-order-button";
import type { MeOrderItem, OrderStatus } from "@/lib/api/types";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import { OrderStatusBadge } from "./order-status-badge";

const ACTION_LINK = "text-sm font-medium text-primary hover:underline";

function RowAction({ row }: { row: MeOrderItem }) {
  if (row.canPay) {
    return <PayOrderButton orderId={row.id} testName={row.testName} />;
  }
  if (row.status === "PAID") {
    return (
      <Link href="/dashboard/riwayat" className={ACTION_LINK}>
        Lihat hasil
      </Link>
    );
  }
  if (row.status === "EXPIRED") {
    return (
      <Link href={`/tes/${row.testSlug}`} className={ACTION_LINK}>
        Beli lagi
      </Link>
    );
  }
  return <span className="text-muted-foreground text-sm">—</span>;
}

/** Badge plus the live remainder, so a buyer sees how long the window lasts. */
function StatusCell({ row }: { row: MeOrderItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <OrderStatusBadge status={row.status} />
      {row.canPay && (
        <span className="text-muted-foreground text-xs">
          sisa <ExpiryCountdown expiresAt={row.expiresAt} />
        </span>
      )}
    </div>
  );
}

interface PembelianTableProps {
  rows: MeOrderItem[];
  meta: PaginationMeta;
  status?: OrderStatus;
}

export function PembelianTable({ rows, meta, status }: PembelianTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada pembelian"
        description="Tes yang Anda beli muncul di sini beserta status pembayarannya."
        filtered={Boolean(status)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    return `/dashboard/pembelian?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      {/* Five columns do not fit on a phone, so small screens get a list. */}
      <ul className="divide-y rounded-lg border sm:hidden">
        {rows.map((row) => (
          <li key={row.id} className="flex items-start justify-between gap-3 p-3">
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-medium leading-snug">{row.testName}</p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {formatIdDate(row.createdAt)} · {formatIdr(row.amount)}
              </p>
              <StatusCell row={row} />
            </div>
            <div className="shrink-0">
              <RowAction row={row} />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-lg border sm:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tes</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.testName}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatIdDate(row.createdAt)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatIdr(row.amount)}
                </TableCell>
                <TableCell>
                  <StatusCell row={row} />
                </TableCell>
                <TableCell>
                  <RowAction row={row} />
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
