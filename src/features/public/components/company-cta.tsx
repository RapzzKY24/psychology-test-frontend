import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Closing band: the same WhatsApp consultation link, for visitors still unsure. */
export function CompanyCta({ waLink }: { waLink: string }) {
  return (
    <section className="bg-card rounded-2xl border p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="space-y-1">
        <h2 className="font-semibold">Belum yakin mulai dari mana?</h2>
        <p className="text-muted-foreground text-sm">
          Ceritakan jumlah peserta, jenis posisi, dan tenggatnya. Kami bantu memilih tes dan jumlah
          slot yang pas.
        </p>
        <Link
          href="/bantuan#alur-instansi"
          className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Baca panduan instansi
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <Button asChild className="mt-4 shrink-0 rounded-full sm:mt-0">
        <a href={waLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" aria-hidden />
          Konsultasi via WhatsApp
        </a>
      </Button>
    </section>
  );
}
