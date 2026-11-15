import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Closing band: the same WhatsApp consultation link, for visitors still unsure. */
export function CompanyCta({ waLink }: { waLink: string }) {
  return (
    <section className="rounded-2xl border bg-card p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="space-y-1">
        <h2 className="font-semibold">Belum yakin paketnya?</h2>
        <p className="text-sm text-muted-foreground">
          Ceritakan kebutuhan tim Anda — jumlah peserta, jenis posisi, dan tenggatnya. Kami bantu
          pilih paket yang paling pas.
        </p>
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
