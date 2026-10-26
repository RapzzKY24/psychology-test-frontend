import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { InvoiceIsland } from "@/features/instansi/invoices/components/invoice-island";
import { fetchInstansiInvoiceServer } from "@/features/instansi/invoices/api.server";
import { isApiError } from "@/lib/api/client";
import type { InstansiInvoice } from "@/lib/api/types";

export const metadata: Metadata = { title: "Tagihan" };

export default async function TagihanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let invoice: InstansiInvoice;
  try {
    const response = await fetchInstansiInvoiceServer(id);
    invoice = response.data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

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
        description="Tautan pembayaran dan status pembayaran sesi."
      />
      <InvoiceIsland initial={invoice} />
    </main>
  );
}
