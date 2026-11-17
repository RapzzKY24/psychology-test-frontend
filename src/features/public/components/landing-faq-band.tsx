import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { LANDING_FAQ_IDS, faqById } from "../help-content";
import { FaqAccordion } from "./faq-accordion";
import { SectionHeading } from "./section-heading";

const FAQ_ITEMS = LANDING_FAQ_IDS.map(faqById);

/** Four high-frequency questions, with the full list one click away. */
export function LandingFaqBand() {
  const { faq } = PUBLIC_COPY.landing;

  return (
    <section className="bg-muted/30 border-y">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} description={faq.description} />
          <Link
            href="/bantuan#faq"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {faq.allLink}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
          <FaqAccordion items={FAQ_ITEMS} />
          <aside className="bg-muted/30 rounded-2xl border p-5">
            <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
              <BookOpen className="size-5" aria-hidden />
            </span>
            <p className="mt-3 font-semibold">Butuh alur lengkap?</p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Pusat Bantuan menjelaskan alur personal, instansi, peserta sesi, dan cara membaca
              status.
            </p>
            <Link
              href="/bantuan"
              className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Buka Pusat Bantuan
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
