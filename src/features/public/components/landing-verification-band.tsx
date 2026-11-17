import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { SectionHeading } from "./section-heading";
import { VerificationLookup } from "./verification-lookup";

/** A public code lookup: the fastest answer to "is this document real?". */
export function LandingVerificationBand() {
  const copy = PUBLIC_COPY.landing.verification;

  return (
    <section className="bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-4">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
          <Link
            href="/bantuan#verifikasi"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {copy.helpLink}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-medium">Masukkan kode dari dokumen</p>
          <div className="mt-3">
            <VerificationLookup />
          </div>
        </div>
      </div>
    </section>
  );
}
