import Link from "next/link";
import { ArrowRight, Building2, Link2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = {
  personal: UserRound,
  instansi: Building2,
  sesi: Link2,
};

/** "Satu platform, tiga jalur" — who the product is for, before the catalog. */
export function LandingAudienceBand() {
  const { audience } = PUBLIC_COPY.landing;

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-14 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow={audience.eyebrow}
          title={audience.title}
          description={audience.description}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.cards.map((card) => {
            const Icon = ICONS[card.key] ?? UserRound;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="bg-card hover:border-primary/40 group flex flex-col rounded-2xl border p-6 transition-colors"
              >
                <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{card.label}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{card.body}</p>
                <span className="text-primary mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium">
                  {card.cta}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
