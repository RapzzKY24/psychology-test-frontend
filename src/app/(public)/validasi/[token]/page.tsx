import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { fetchInvoiceVerificationServer } from "@/features/public/api";
import { InvoiceVerificationCard } from "@/features/public/components/invoice-verification-card";
import type { InvoiceVerification } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/validasi/[token]">): Promise<Metadata> {
  await params;
  return {
    title: "Validasi Dokumen",
    robots: { index: false, follow: false },
  };
}

export default async function ValidasiPage({
  params,
}: PageProps<"/validasi/[token]">) {
  const { token } = await params;

  let invoice: InvoiceVerification;
  try {
    invoice = (await fetchInvoiceVerificationServer(token)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Verifikasi Invoice
        </h1>
        <p className="text-sm text-muted-foreground">
          Halaman ini menampilkan data invoice yang tersimpan di sistem kami.
        </p>
      </div>

      <InvoiceVerificationCard invoice={invoice} />
    </main>
  );
}
