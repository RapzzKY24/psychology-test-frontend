import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InvoicesIsland } from "@/features/instansi/invoices/components/invoices-island";
import { fetchInstansiInvoicesServer } from "@/features/instansi/invoices/api.server";

export const metadata: Metadata = { title: "Pembayaran" };

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const initial = await fetchInstansiInvoicesServer({ page });

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Pembayaran"
        description="Tagihan sesi, status pembayaran, dan sisa waktu untuk membayar."
      />
      <InvoicesIsland initial={initial} page={page} />
    </main>
  );
}
