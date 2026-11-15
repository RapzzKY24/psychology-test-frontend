import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyCta } from "@/features/public/components/company-cta";
import { CompanyPerks } from "@/features/public/components/company-perks";
import { CompanySteps } from "@/features/public/components/company-steps";
import { buildWhatsAppLink } from "@/features/public/whatsapp";
import { getServerSession } from "@/lib/api/server";
import { whatsappNumber } from "@/lib/env";

export const metadata: Metadata = {
  title: "Untuk Perusahaan",
  description: "Paket tes psikologi untuk instansi, rekrutmen, dan pengembangan karyawan.",
};

/**
 * Pre-filled consultation text. The two bracketed parts are meant to be
 * replaced by the sender inside WhatsApp, so the first reply already has the
 * company name and the topic.
 */
const WA_TEMPLATE = "Saya dari [nama perusahaan] ingin mengkonsultasikan [topik].";

export default async function UntukPerusahaanPage() {
  const session = await getServerSession();
  const waLink = buildWhatsAppLink(whatsappNumber, WA_TEMPLATE);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6">
      <section className="space-y-5 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tes untuk perusahaan</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Cocok untuk rekrutmen, penilaian kinerja psikologis, dan pengembangan kapabilitas
          karyawan.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* Signed-in visitors already have an account: registering again is noise. */}
          {session ? null : (
            <Button asChild size="lg" className="rounded-full">
              <Link href="/daftar">Daftar Instansi</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden />
              Konsultasi via WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <CompanyPerks />
      <CompanySteps />
      <CompanyCta waLink={waLink} />
    </main>
  );
}
