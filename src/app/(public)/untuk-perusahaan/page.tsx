import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/features/public/whatsapp";
import { whatsappNumber } from "@/lib/env";

export const metadata: Metadata = {
  title: "Untuk Perusahaan",
  description: "Paket tes psikologi untuk instansi, rekrutmen, dan pengembangan karyawan.",
};

export default function UntukPerusahaanPage() {
  const waLink = buildWhatsAppLink(whatsappNumber, "Halo, saya ingin informasi paket tes untuk perusahaan.");

  const perks = [
    {
      icon: Users,
      title: "Pemetaan tim",
      body: "Kepribadian, gaya kerja, dan minat tiap karyawan dalam satu sesi terjadwal.",
    },
    {
      icon: ShieldCheck,
      title: "Hasil terlulusi",
      body: "Laporan psikolog resmi + verifikasi QR, cocok untuk kebutuhan HR & compliance.",
    },
    {
      icon: Building2,
      title: "Slot prabayar",
      body: "Beli kuota slot instansi, lalu daftarkan peserta kapan saja.",
    },
  ];

  const steps = [
    { title: "Daftar instansi", body: "Isi data instansi dan akun akuntabilitas (PIC HR)." },
    { title: "Pilih paket & beli slot", body: "Pilih paket sesuai jumlah peserta & durasi." },
    { title: "Daftarkan peserta", body: "Masukkan data peserta; admin bisa mengirim undangan." },
    { title: "Terima hasil", body: "Bagi hasil per orang atau kelompok, verifikasi psikolog." },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6">
      <section className="space-y-5 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tes untuk perusahaan</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Cocok untuk rekrutmen, penilaian kinerja psikologis, dan pengembangan kapabilitas
          karyawan.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/daftar">Daftar Instansi</Link>
          </Button>
          {whatsappNumber ? (
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                Chat via WhatsApp
              </a>
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {perks.map((perk) => (
          <Card key={perk.title} className="rounded-2xl">
            <CardContent className="space-y-3 p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <perk.icon className="size-5" aria-hidden />
              </span>
              <h2 className="font-semibold">{perk.title}</h2>
              <p className="text-sm text-muted-foreground">{perk.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Alur Paket Instansi</h2>
        <ol className="space-y-4">
          {steps.map((step, index) => (
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
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Kembali ke beranda
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </main>
  );
}
