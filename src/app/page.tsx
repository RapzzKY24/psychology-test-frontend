import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Placeholder landing — replaced by the real shell + landing in T1.2.
 */
export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Platform Tes Psikologi</h1>
      <p className="max-w-md text-muted-foreground">
        Katalog tes, pengerjaan online, verifikasi oleh psikolog, dan laporan resmi yang dapat
        diverifikasi.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/daftar">Mulai Sekarang</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/masuk">Masuk</Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Undangan sesi? Buka tautan undangan yang Anda terima (format: /join/token).
      </p>
    </main>
  );
}
