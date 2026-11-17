import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Link2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyCta } from "@/features/public/components/company-cta";
import { CompanyPerks } from "@/features/public/components/company-perks";
import { CompanySteps } from "@/features/public/components/company-steps";
import { PUBLIC_COPY } from "@/features/public/copy";
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
  const copy = PUBLIC_COPY.company;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6">
      <section className="space-y-5 text-center">
        <p className="text-primary text-xs font-medium tracking-wide uppercase">Untuk instansi</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">{copy.description}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* Signed-in visitors already have an account: registering again is noise. */}
          {session ? null : (
            <Button asChild size="lg" className="rounded-full">
              <Link href="/daftar?peran=instansi">{copy.primaryCta}</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden />
              {copy.secondaryCta}
            </a>
          </Button>
        </div>
        <Link
          href="/bantuan#alur-instansi"
          className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {copy.helpLink}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <CompanyPerks />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="bg-card rounded-2xl border p-6">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <CreditCard className="size-5" aria-hidden />
          </span>
          <h2 className="mt-3 font-semibold">{copy.costTitle}</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{copy.costBody}</p>
        </div>

        <div className="bg-card rounded-2xl border p-6">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Link2 className="size-5" aria-hidden />
          </span>
          <h2 className="mt-3 font-semibold">{copy.joinTitle}</h2>
          <ol className="mt-3 space-y-2">
            {copy.joinSteps.map((step, index) => (
              <li key={step} className="text-muted-foreground flex gap-2 text-sm">
                <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CompanySteps />
      <CompanyCta waLink={waLink} />
    </main>
  );
}
