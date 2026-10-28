import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Gray band: the prepaid-slot pitch for teams and companies. */
export function LandingB2bBand() {
  return (
    <section className="bg-muted/50 border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Card className="overflow-hidden rounded-2xl border-none bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Tes untuk tim & perusahaan
              </h2>
              <p className="max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
                Beli slot terlebih dahulu, lalu isi nama peserta kapan saja. Cocok untuk rekrutmen
                maupun pemetaan karyawan.
              </p>
            </div>
            <Button asChild variant="secondary" className="h-12 shrink-0 rounded-full px-6 text-base">
              <Link href="/untuk-perusahaan">Pelajari Paket Instansi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
