import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { InvoiceIsland } from "@/features/instansi/invoices/components/invoice-island";
import { fetchInstansiInvoiceServer } from "@/features/instansi/invoices/api.server";

export const metadata: Metadata = { title: "Tagihan" };

export default async function TagihanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: invoice } = await fetchInstansiInvoiceServer(id);

  return (
    <main className="flex-1 space-y-6 p-6">
      <Link
        href="/instansi/sesi"
        className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke Data Sesi
      </Link>
      <PageHeader
        title="Pembayaran Sesi"
        description="Nomor Virtual Account dan status pembayaran sesi."
      />
      <InvoiceIsland initial={invoice} />
    </main>
  );
}
