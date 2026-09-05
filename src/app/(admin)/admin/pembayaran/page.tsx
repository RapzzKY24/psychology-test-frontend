import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PaymentFilters } from "@/features/admin/payments/components/payment-filters";
import { PaymentsTable } from "@/features/admin/payments/components/payments-table";
import { QrisDialog } from "@/features/admin/payments/components/qris-dialog";
import { fetchPaymentsServer } from "@/features/admin/payments/api.server";
import type { AdminPaymentListItem } from "@/lib/api/types";

export const metadata: Metadata = { title: "Verifikasi Pembayaran" };

const VALID_STATUSES: AdminPaymentListItem["status"][] = [
  "PENDING",
  "PAID",
  "EXPIRED",
  "CANCELLED",
];

export default async function PembayaranPage({ searchParams }: PageProps<"/admin/pembayaran">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const statusRaw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status = VALID_STATUSES.includes(statusRaw as AdminPaymentListItem["status"])
    ? (statusRaw as AdminPaymentListItem["status"])
    : undefined;
  const amountRaw = Array.isArray(sp.amount) ? sp.amount[0] : sp.amount;
  const amount = amountRaw && /^\d+$/.test(amountRaw) ? amountRaw : undefined;

  const { data, meta } = await fetchPaymentsServer({
    page,
    status,
    amount: amount ? Number(amount) : undefined,
  });
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Verifikasi Pembayaran"
          description="Cocokkan mutasi masuk dengan nominal unik (harga + kode 3 digit)."
        />
        <QrisDialog />
      </div>
      <PaymentFilters status={status} amount={amount} />
      <PaymentsTable
        rows={data}
        meta={tableMeta}
        status={status}
        amount={amount}
        page={page}
      />
    </main>
  );
}
