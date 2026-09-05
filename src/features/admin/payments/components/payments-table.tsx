import { Badge } from "@/components/ui/badge";
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
import type { AdminPaymentListItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import { CancelPaymentDialog } from "./cancel-payment-dialog";
import { PaymentStatusBadge } from "./payment-status-badge";
import { VerifyPaymentButton } from "./verify-payment-button";

interface PaymentsTableProps {
  rows: AdminPaymentListItem[];
  meta: PaginationMeta;
  status?: string;
  amount?: string;
}

export function PaymentsTable({ rows, meta, status, amount }: PaymentsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada pesanan"
        description="Pesanan pembayaran QRIS manual muncul di sini untuk diverifikasi."
        filtered={Boolean(status || amount)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    if (amount) p.set("amount", amount);
    return `/admin/pembayaran?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Peserta / Tes</TableHead>
              <TableHead>Nominal (kode unik)</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Kedaluwarsa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-52">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.orderId}>
                <TableCell>
                  <p className="font-medium">{row.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.userEmail} · {row.testName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium tabular-nums">{formatIdr(row.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    kode unik <span className="font-semibold text-foreground">{String(row.uniqueCode).padStart(3, "0")}</span>
                  </p>
                </TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.createdAt)}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.expiresAt)}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={row.status} />
                  {row.claimed && row.status === "PENDING" && (
                    <Badge variant="outline" className="ml-1.5 border-primary/40 text-primary">
                      diklaim
                    </Badge>
                  )}
                  {row.verifiedBy && row.status === "PAID" && (
                    <p className="mt-1 text-xs text-muted-foreground">oleh {row.verifiedBy.name}</p>
                  )}
                </TableCell>
                <TableCell>
                  {row.status === "PENDING" ? (
                    <div className="flex gap-1.5">
                      <VerifyPaymentButton payment={row} />
                      <CancelPaymentDialog payment={row} />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
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
