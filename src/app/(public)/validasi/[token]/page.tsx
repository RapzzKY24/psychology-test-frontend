import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PUBLIC_COPY } from "@/features/public/copy";
import { findInvoiceVerificationServer } from "@/features/public/api";
import { InvoiceVerificationCard } from "@/features/public/components/invoice-verification-card";
import { VerificationIntro } from "@/features/public/components/verification-intro";

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

export default async function ValidasiPage({ params }: PageProps<"/validasi/[token]">) {
  const { token } = await params;
  const invoice = await findInvoiceVerificationServer(token);
  if (!invoice) notFound();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16">
      <VerificationIntro
        title="Verifikasi Invoice"
        description={PUBLIC_COPY.verification.invoiceDescription}
      />

      <InvoiceVerificationCard invoice={invoice} />
    </main>
  );
}
