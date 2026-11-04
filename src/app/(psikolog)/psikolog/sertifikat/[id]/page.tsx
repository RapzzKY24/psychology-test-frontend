import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CertificateForm } from "@/features/psikolog/certificates/components/certificate-form";
import { CertificateIssuedPanel } from "@/features/psikolog/certificates/components/certificate-issued-panel";
import { fetchCertificateServer } from "@/features/psikolog/certificates/api.server";
import { isApiError } from "@/lib/api/client";

export const metadata: Metadata = { title: "Sertifikat" };

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let form;
  try {
    form = (await fetchCertificateServer(id)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const holder = form.certificate.identity.fullName || form.result.participantName || "Peserta";

  return (
    <main className="flex-1 space-y-6 p-6">
      <Link
        href="/psikolog/sertifikat"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke daftar sertifikat
      </Link>

      <PageHeader
        title={`Sertifikat ${holder}`}
        description={[form.result.testName, form.result.sessionTitle].filter(Boolean).join(" · ")}
      />

      {form.certificate.status === "DRAFT" ? (
        <CertificateForm form={form} />
      ) : (
        <CertificateIssuedPanel certificate={form.certificate} />
      )}
    </main>
  );
}
