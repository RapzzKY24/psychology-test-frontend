import Link from "next/link";
import { ArrowRight, Building2, UserRound } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { SectionHeading } from "./section-heading";

const TRACK_ICONS = [UserRound, Building2] as const;

/** Two parallel flows: a personal buyer and an institution. */
export function LandingStepsBand() {
  const copy = PUBLIC_COPY.landing.steps;
  const tracks = [copy.personal, copy.instansi];

  return (
    <section id="cara-kerja" className="bg-muted/40 scroll-mt-24 border-y">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {tracks.map((track, trackIndex) => {
            const Icon = TRACK_ICONS[trackIndex] ?? UserRound;
            return (
              <div key={track.title} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{track.title}</h3>
                </div>
                <ol className="mt-5 space-y-4">
                  {track.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>

        <Link
          href="/bantuan"
          className="text-primary mt-6 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {copy.helpLink}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
