import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TEST_CATEGORY_LABELS } from "@/lib/api/types";
import { isApiError } from "@/lib/api/client";
import { formatIdr } from "@/lib/format/format-idr";
import { fetchPublicTestServer } from "@/features/public/api.server";

const STEPS = [
  { title: "Beli tes", body: "Pilih tes ini dan selesaikan pembayaran dengan aman." },
  { title: "Kerjakan online", body: "Akses tes dari dasbor dan jawab sesuai waktu yang tersedia." },
  {
    title: "Terima hasil",
    body: "Hasil diverifikasi psikolog dan dapat diunduh sebagai laporan dengan QR verifikasi.",
  },
] as const;

const FAQ = [
  {
    q: "Berapa lama hasil keluar?",
    a: "Hasil diproses otomatis dan diverifikasi psikolog. Anda akan diberi tahu begitu laporan siap.",
  },
  {
    q: "Apakah hasilnya resmi?",
    a: "Ya. Setiap laporan ditandatangani psikolog berlisensi dan dilengkapi QR untuk memverifikasi keasliannya.",
  },
  {
    q: "Bisa dikerjakan lewat HP?",
    a: "Ya, tes dirancang responsif dan dapat dikerjakan dari ponsel maupun komputer.",
  },
  {
    q: "Bagaimana jika koneksi terputus?",
    a: "Jawaban tersimpan sepanjang pengerjaan, sehingga Anda bisa melanjutkan dari tempat terakhir.",
  },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/tes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPublicTestServer(slug);
    return { title: data.name, description: data.description };
  } catch {
    return { title: "Tes tidak ditemukan" };
  }
}

export default async function TestDetailPage({ params }: PageProps<"/tes/[slug]">) {
  const { slug } = await params;

  let test;
  try {
    test = (await fetchPublicTestServer(slug)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 sm:py-12 md:pb-12">
      <Link
        href="/tes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Katalog Tes
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <header className="space-y-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {TEST_CATEGORY_LABELS[test.category]}
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{test.name}</h1>
            <p className="text-muted-foreground">{test.description}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden />
              Estimasi {test.estimatedDurationMin} menit
            </p>
          </header>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Cara Kerja</h2>
            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Pertanyaan Umum</h2>
            <div className="divide-y rounded-2xl border bg-background">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-4 py-3">
                  <summary className="cursor-pointer list-none font-medium marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden md:block">
          <Card className="sticky top-24 rounded-2xl shadow-sm">
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Harga</p>
                <p className="text-2xl font-semibold">{formatIdr(test.price)}</p>
              </div>
              <Button asChild className="w-full rounded-full" size="lg">
                <Link href={`/masuk?next=/tes/${test.slug}`}>Beli Tes</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Hasil diverifikasi psikolog dan dapat diverifikasi via QR.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-4 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Harga</p>
            <p className="text-lg font-semibold">{formatIdr(test.price)}</p>
          </div>
          <Button asChild className="rounded-full" size="lg">
            <Link href={`/masuk?next=/tes/${test.slug}`}>Beli Tes</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
