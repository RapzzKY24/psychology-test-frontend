import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "../whatsapp";
import { whatsappNumber } from "@/lib/env";
import { HeroImage } from "./hero-image";

/** Pre-filled so the first reply already knows what the chat is about. */
const WA_CONSULT_MESSAGE = "Halo, saya ingin berkonsultasi soal tes psikologi.";

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Psikolog berlisensi" },
  { icon: QrCode, label: "Hasil terverifikasi QR" },
  { icon: ShieldCheck, label: "Data Anda aman" },
] as const;

/** Full-height opening: copy on the left, client photo slot on the right. */
export function LandingHero() {
  const waLink = buildWhatsAppLink(whatsappNumber, WA_CONSULT_MESSAGE);

  return (
    <section className="bg-background flex min-h-[calc(100svh-4rem)] items-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <BadgeCheck className="size-4" aria-hidden />
            Tes psikologi berlisensi
          </span>
          <h1 className="mt-5 text-3xl leading-[1.15] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Kenali dirimu lewat tes psikologi yang terpercaya
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-base sm:text-lg">
            Kerjakan tes online, dapatkan hasil yang diverifikasi psikolog, dan unduh laporan resmi
            yang dapat dipercaya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-6 text-base">
              <Link href="/tes">
                Lihat Tes
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6 text-base">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                Konsultasi WhatsApp
              </a>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <badge.icon className="size-4 text-primary" aria-hidden />
                {badge.label}
              </li>
            ))}
          </ul>
        </div>
        <HeroImage />
      </div>
    </section>
  );
}
