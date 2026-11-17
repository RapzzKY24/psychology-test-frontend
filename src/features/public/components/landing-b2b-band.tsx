import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Closing band: the prepaid-slot pitch for teams and companies. */
export function LandingB2bBand() {
  return (
    <section className="bg-background border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Card className="bg-primary text-primary-foreground overflow-hidden rounded-2xl border-none">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Tes untuk tim & perusahaan
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl text-sm sm:text-base">
                Beli slot, isi peserta, bagikan satu link. Pantau progres dan unduh laporan tiap
                peserta dari dashboard instansi.
              </p>
              <Link
                href="/bantuan#alur-instansi"
                className="text-primary-foreground/90 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
              >
                Baca panduan instansi
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <Button
              asChild
              variant="secondary"
              className="h-12 shrink-0 rounded-full px-6 text-base"
            >
              <Link href="/untuk-perusahaan">Pelajari Paket Instansi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
