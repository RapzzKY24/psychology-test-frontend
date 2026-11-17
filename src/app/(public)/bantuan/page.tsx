import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  Building2,
  Clock,
  CreditCard,
  FileCheck,
  Link2,
  MessageCircle,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Timer,
  UserCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PUBLIC_COPY } from "@/features/public/copy";
import {
  FAQ_ITEMS,
  HELP_CONTACT_CHECKLIST,
  HELP_DELIVERABLE_COLUMNS,
  HELP_DELIVERABLE_ROWS,
  HELP_FAQ_GROUPS,
  HELP_FLOWS,
  HELP_GLOSSARY,
  faqById,
} from "@/features/public/help-content";
import { ComparisonTable } from "@/features/public/components/comparison-table";
import { FaqAccordion } from "@/features/public/components/faq-accordion";
import { HelpNav } from "@/features/public/components/help-nav";
import type { HelpNavSection } from "@/features/public/components/help-nav";
import { InfoCard } from "@/features/public/components/info-card";
import { SectionHeading } from "@/features/public/components/section-heading";
import { StepTimeline } from "@/features/public/components/step-timeline";
import { VerificationLookup } from "@/features/public/components/verification-lookup";
import { buildWhatsAppLink } from "@/features/public/whatsapp";
import { whatsappNumber } from "@/lib/env";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Alur personal dan instansi, arti status, dokumen yang diterima, pembayaran, dan cara verifikasi dokumen mypsikolog.id.",
};

interface PersonaCard {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  cta: string;
}

const PERSONA_CARDS: PersonaCard[] = [
  {
    icon: UserRound,
    title: "Peserta personal",
    body: "Membeli satu tes dan mengerjakannya sendiri.",
    href: "#alur-personal",
    cta: "Lihat alur",
  },
  {
    icon: Building2,
    title: "Instansi / perusahaan",
    body: "Mengadakan tes untuk tim atau banyak peserta.",
    href: "#alur-instansi",
    cta: "Lihat alur",
  },
  {
    icon: Link2,
    title: "Peserta sesi",
    body: "Mengikuti tes dari link dan PIN penyelenggara.",
    href: "#alur-sesi",
    cta: "Lihat alur",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi dokumen",
    body: "Memeriksa keaslian laporan atau sertifikat.",
    href: "#verifikasi",
    cta: "Cek dokumen",
  },
];

const NAV_SECTIONS: HelpNavSection[] = [
  { id: "alur-personal", label: "Alur personal" },
  { id: "alur-instansi", label: "Alur instansi" },
  { id: "alur-sesi", label: "Peserta sesi" },
  { id: "hasil", label: "Dokumen & hasil" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "mengerjakan", label: "Mengerjakan tes" },
  { id: "verifikasi", label: "Verifikasi" },
  { id: "istilah", label: "Istilah" },
  { id: "faq", label: "FAQ" },
  { id: "kontak", label: "Kontak" },
];

const PAYMENT_CARDS = [
  {
    icon: CreditCard,
    title: "Metode pembayaran",
    body: "Mengikuti penyedia yang aktif: virtual account, QRIS, atau e-wallet.",
  },
  {
    icon: Timer,
    title: "Batas waktu",
    body: "Batas pembayaran tampil di halaman pembayaran. Setelah lewat, pesanan kedaluwarsa.",
  },
  {
    icon: RefreshCw,
    title: "Sudah bayar, status belum berubah",
    body: "Status diperbarui otomatis setelah pembayaran terkonfirmasi. Coba Cek status sekarang di halaman pembayaran.",
  },
] as const;

const TEST_TAKING_CARDS = [
  {
    icon: Monitor,
    title: "Perangkat",
    body: "Gunakan browser modern. Layar besar lebih nyaman untuk tes bergambar atau grid.",
  },
  {
    icon: Clock,
    title: "Waktu",
    body: "Sebagian tes punya timer. Waktu dihitung dari server, bukan dari jam perangkat.",
  },
  {
    icon: RefreshCw,
    title: "Koneksi terputus",
    body: "Jawaban tersimpan saat dijawab. Buka kembali dashboard atau link sesi untuk melanjutkan.",
  },
  {
    icon: UserCheck,
    title: "Data norma",
    body: "Tes tertentu meminta tanggal lahir, jenis kelamin, atau pendidikan untuk memilih norma yang tepat.",
  },
] as const;

export default function BantuanPage() {
  const [personalFlow, instansiFlow, sesiFlow] = HELP_FLOWS;
  const waLink = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, "Halo, saya butuh bantuan soal mypsikolog.id.")
    : null;

  return (
    <main className="w-full">
      <section className="bg-muted/30 border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-primary text-xs font-medium tracking-wide uppercase">
              {PUBLIC_COPY.help.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {PUBLIC_COPY.help.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {PUBLIC_COPY.help.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
            {PERSONA_CARDS.map(({ icon: Icon, title, body, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="bg-card hover:border-primary/40 group rounded-2xl border p-5 transition-colors"
              >
                <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{body}</p>
                <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  {cta}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[220px_1fr]">
        <HelpNav sections={NAV_SECTIONS} />

        <div className="min-w-0 space-y-10 sm:space-y-14">
          <section id="alur-personal" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow={personalFlow.eyebrow}
              title={personalFlow.title}
              description={personalFlow.description}
            />
            <StepTimeline steps={personalFlow.steps} columns={2} />
            {personalFlow.note ? (
              <p className="text-muted-foreground rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                {personalFlow.note}
              </p>
            ) : null}
          </section>

          <section id="alur-instansi" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow={instansiFlow.eyebrow}
              title={instansiFlow.title}
              description={instansiFlow.description}
            />
            <StepTimeline steps={instansiFlow.steps} columns={2} />
            {instansiFlow.note ? (
              <p className="text-muted-foreground rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                {instansiFlow.note}
              </p>
            ) : null}
          </section>

          <section id="alur-sesi" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow={sesiFlow.eyebrow}
              title={sesiFlow.title}
              description={sesiFlow.description}
            />
            <StepTimeline steps={sesiFlow.steps} columns={2} />
            {sesiFlow.note ? (
              <p className="text-muted-foreground rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                {sesiFlow.note}
              </p>
            ) : null}
          </section>

          <section id="hasil" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Hasil & dokumen"
              title="Apa yang Anda terima di tiap jalur"
              description="Personal, instansi, dan peserta sesi mendapat dokumen yang berbeda. Ini ringkasannya."
            />
            <ComparisonTable columns={HELP_DELIVERABLE_COLUMNS} rows={HELP_DELIVERABLE_ROWS} />
            <p className="text-muted-foreground text-sm">
              WPT/CPMI punya dokumen laporan sendiri dan tidak menerbitkan sertifikat umum.
              Sertifikat selalu diterbitkan psikolog setelah hasil disetujui.
            </p>
          </section>

          <section id="pembayaran" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Pembayaran"
              title="Kalau pembayaran belum terbaca"
              description="Status pembayaran berasal dari penyedia, bukan dari halaman yang Anda tutup."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {PAYMENT_CARDS.map(({ icon, title, body }) => (
                <InfoCard key={title} icon={icon} title={title}>
                  {body}
                </InfoCard>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Sudah bayar tetapi tetap belum berubah? Hubungi admin dengan ID pesanan, nominal, dan
              waktu pembayaran. Untuk tagihan instansi, sertakan nomor invoice.
            </p>
          </section>

          <section id="mengerjakan" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Mengerjakan tes"
              title="Yang perlu disiapkan"
              description="Tes dirancang untuk dikerjakan online. Beberapa hal ini membuat pengerjaan lebih lancar."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {TEST_TAKING_CARDS.map(({ icon, title, body }) => (
                <InfoCard key={title} icon={icon} title={title}>
                  {body}
                </InfoCard>
              ))}
            </div>
          </section>

          <section id="verifikasi" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Verifikasi"
              title="Cek keaslian dokumen"
              description="Kode ada di dekat QR pada laporan, sertifikat, atau invoice. Halaman verifikasi tidak menampilkan skor."
            />
            <div className="bg-card rounded-2xl border p-5 sm:p-6">
              <VerificationLookup />
              <p className="text-muted-foreground mt-3 text-sm">
                Kalau kode tidak ditemukan, periksa lagi huruf dan angkanya, atau hubungi penerbit
                dokumen.{" "}
                <Link
                  href="/verifikasi"
                  className="text-primary font-medium underline underline-offset-4"
                >
                  Buka halaman verifikasi
                </Link>
                .
              </p>
            </div>
          </section>

          <section id="istilah" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Istilah"
              title="Kamus singkat"
              description="Istilah yang muncul di dashboard, dokumen, dan email admin."
            />
            <dl className="grid gap-4 sm:grid-cols-2">
              {HELP_GLOSSARY.map((entry) => (
                <div key={entry.term} className="bg-card rounded-2xl border p-5">
                  <dt className="font-semibold">{entry.term}</dt>
                  <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {entry.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="faq" className="scroll-mt-32 lg:scroll-mt-24 space-y-6 sm:space-y-8">
            <SectionHeading
              eyebrow="FAQ"
              title="Pertanyaan yang sering masuk"
              description="Dikelompokkan supaya lebih cepat menemukan jawabannya."
            />
            {HELP_FAQ_GROUPS.map((group) => (
              <div key={group.id} className="space-y-3">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <FaqAccordion items={group.ids.map(faqById)} />
              </div>
            ))}
            <div className="bg-muted/30 rounded-2xl border p-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="text-primary size-4" aria-hidden />
                Masih ada yang belum terjawab?
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Lihat bagian kontak di bawah. Sertakan informasi yang diminta supaya admin bisa
                mengecek lebih cepat.
              </p>
            </div>
          </section>

          <section id="kontak" className="scroll-mt-32 lg:scroll-mt-24 space-y-5">
            <SectionHeading
              eyebrow="Kontak"
              title={PUBLIC_COPY.help.contactTitle}
              description={PUBLIC_COPY.help.contactBody}
            />
            <div className="bg-card rounded-2xl border p-5 sm:p-6">
              <ul className="grid gap-2 sm:grid-cols-2">
                {HELP_CONTACT_CHECKLIST.map((item) => (
                  <li key={item} className="text-muted-foreground flex items-start gap-2 text-sm">
                    <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                      <CheckMark />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    {PUBLIC_COPY.help.contactCta}
                  </a>
                ) : null}
                <Link
                  href="/untuk-perusahaan"
                  className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  <FileCheck className="size-4" aria-hidden />
                  Untuk kebutuhan instansi
                </Link>
              </div>
              {!waLink ? (
                <p className="text-muted-foreground mt-3 text-sm">
                  {PUBLIC_COPY.help.contactFallback}
                </p>
              ) : null}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            <p className="text-muted-foreground text-sm">
              {FAQ_ITEMS.length} pertanyaan di halaman ini, dikelompokkan menjadi{" "}
              {HELP_FAQ_GROUPS.length} topik.
            </p>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
            >
              <ArrowUp className="size-4" aria-hidden />
              Kembali ke atas
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
      <path
        d="M4 10.5 8 14.5 16 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
