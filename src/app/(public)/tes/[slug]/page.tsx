import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, Clock, FileText, Layers, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS } from "@/lib/api/types";
import { isApiError } from "@/lib/api/client";
import { formatIdr } from "@/lib/format/format-idr";
import { fetchPublicTestServer } from "@/features/public/api.server";
import { TestBuyCta } from "@/features/public/components/test-buy-cta";
import { getServerSession } from "@/lib/api/server";

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

const INCLUDES = [
  "Laporan hasil dalam format PDF",
  "Diverifikasi psikolog berlisensi",
  "QR verifikasi keaslian laporan",
] as const;

export async function generateMetadata({ params }: PageProps<"/tes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPublicTestServer(slug);
    return { title: data.name, description: data.description };
  } catch {
    return { title: "Tes tidak ditemukan" };
  }
}

/** One fact in the summary strip under the title. */
function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="bg-card flex items-center gap-3 p-4">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
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

  const userRole = (await getServerSession())?.user?.role ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-10 md:pb-14">
      <Link
        href="/tes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Katalog Tes
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {TEST_CATEGORY_LABELS[test.category]}
              </Badge>
              <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
                <Clock className="size-3.5" aria-hidden />
                {test.estimatedDurationMin} menit
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{test.name}</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">{test.description}</p>
          </header>

          {test.imageUrl && (
            <Image
              src={test.imageUrl}
              alt={test.name}
              width={960}
              height={540}
              priority
              className="aspect-[16/9] w-full rounded-2xl border object-cover"
            />
          )}

          <div className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
            <Fact icon={Clock} label="Durasi" value={`${test.estimatedDurationMin} menit`} />
            <Fact icon={Layers} label="Kategori" value={TEST_CATEGORY_LABELS[test.category]} />
            <Fact icon={FileText} label="Hasil" value="Laporan PDF + QR" />
          </div>

          <section aria-labelledby="cara-kerja" className="space-y-4">
            <h2 id="cara-kerja" className="text-lg font-semibold">
              Cara Kerja
            </h2>
            <ol className="grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="bg-card rounded-2xl border p-5">
                  <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <p className="mt-3 font-medium">{step.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="faq" className="space-y-4">
            <h2 id="faq" className="text-lg font-semibold">
              Pertanyaan Umum
            </h2>
            <div className="bg-card divide-y overflow-hidden rounded-2xl border">
              {FAQ.map((item) => (
                <details key={item.q} className="group">
                  <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors marker:content-none">
                    {item.q}
                    <ChevronDown
                      className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <Card className="sticky top-24 rounded-2xl">
            <CardContent className="space-y-5">
              <div>
                <p className="text-muted-foreground text-sm">Harga</p>
                <p className="font-heading text-3xl font-semibold tracking-tight">
                  {formatIdr(test.price)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Sekali bayar, termasuk laporan hasil.
                </p>
              </div>

              <TestBuyCta testId={test.id} role={userRole} className="w-full" />

              <ul className="space-y-2.5 border-t pt-4">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
                Hasil hanya bisa dibuka oleh Anda.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t p-4 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Harga</p>
            <p className="text-lg font-semibold">{formatIdr(test.price)}</p>
          </div>
          <TestBuyCta testId={test.id} role={userRole} className="flex-shrink-0" />
        </div>
      </div>
    </main>
  );
}
