import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { TEST_FAQ_IDS, faqById } from "../help-content";
import { FaqAccordion } from "./faq-accordion";

const FAQ = TEST_FAQ_IDS.map(faqById);

/** The questions that actually decide whether someone buys or asks admin. */
export function TestFaq() {
  return (
    <section aria-labelledby="faq" className="space-y-4">
      <h2 id="faq" className="text-lg font-semibold">
        {PUBLIC_COPY.testDetail.faqTitle}
      </h2>
      <FaqAccordion items={FAQ} />
      <Link
        href="/bantuan#faq"
        className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        Lihat semua pertanyaan
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
