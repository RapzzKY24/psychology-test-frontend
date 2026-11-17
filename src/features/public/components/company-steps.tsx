import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { SectionHeading } from "./section-heading";
import { StepTimeline } from "./step-timeline";

/** The five steps of an institution batch, in order. */
export function CompanySteps() {
  const copy = PUBLIC_COPY.company;

  return (
    <section className="space-y-5">
      <SectionHeading
        title={copy.stepsTitle}
        description="Dari akun instansi sampai laporan tiap peserta."
      />
      <StepTimeline steps={copy.steps} columns={3} />
      <Link
        href="/bantuan#alur-instansi"
        className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
      >
        Panduan lengkap instansi
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
