import Link from "next/link";
import { ArrowRight, BadgeCheck, QrCode, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_COPY } from "../copy";
import { HeroImage } from "./hero-image";

const TRUST_ICONS: LucideIcon[] = [BadgeCheck, QrCode, ShieldCheck];

/** Full-height opening: copy on the left, client photo slot on the right. */
export function LandingHero() {
  const copy = PUBLIC_COPY.landing.hero;

  return (
    <section className="bg-background">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
            <BadgeCheck className="size-4" aria-hidden />
            {copy.badge}
          </span>
          <h1 className="mt-5 text-3xl leading-[1.15] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {copy.title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-base sm:text-lg">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-6 text-base">
              <Link href="/tes">
                {copy.primaryCta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6 text-base">
              <a href="#cara-kerja">{copy.secondaryCta}</a>
            </Button>
          </div>
          <Link
            href="/bantuan"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {copy.helpLink}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {copy.trustBadges.map((label, index) => {
              const Icon = TRUST_ICONS[index] ?? BadgeCheck;
              return (
                <li key={label} className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Icon className="text-primary size-4" aria-hidden />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
        <HeroImage />
      </div>
    </section>
  );
}
