import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { HELP_DELIVERABLE_COLUMNS, HELP_DELIVERABLE_ROWS } from "../help-content";
import { ComparisonTable } from "./comparison-table";
import { SectionHeading } from "./section-heading";

/** "Apa yang Anda terima" — the personal/institution difference, up front. */
export function LandingDeliverablesBand() {
  const { deliverables } = PUBLIC_COPY.landing;

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={deliverables.eyebrow}
            title={deliverables.title}
            description={deliverables.description}
          />
          <Link
            href="/bantuan#hasil"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {deliverables.helpLink}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ComparisonTable columns={HELP_DELIVERABLE_COLUMNS} rows={HELP_DELIVERABLE_ROWS} />
      </div>
    </section>
  );
}
