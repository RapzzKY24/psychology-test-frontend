import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCards } from "@/features/instansi/monitor/components/overview-cards";
import { fetchInstansiOverviewServer, fetchInstansiProgressServer } from "@/features/instansi/monitor/api.server";
import { SessionProgressSection } from "@/features/instansi/monitor/components/session-progress-section";
import { PROGRESS_SESSIONS_LIMIT } from "@/features/instansi/monitor/constants";
import { fetchInstansiSessionsServer } from "@/features/instansi/sessions/api.server";
import { CopyInviteButton } from "@/components/shared/copy-invite-button";
import { SESSION_STATUS_LABEL } from "@/lib/constants/session-status";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: "Ringkasan" };

interface QuickLink {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const QUICK_LINKS: QuickLink[] = [
  { href: "/instansi/pegawai", title: "Kelola Pegawai", description: "Tambah dan kelola data pegawai.", icon: Users },
  { href: "/instansi/buat-sesi", title: "Buat Sesi", description: "Pilih tes dan peserta, bagikan tautan.", icon: CalendarDays },
];

export default async function InstansiPage() {
  // Next renders the layout and the page in parallel, so the layout's role
  // guard alone would still let this fetch run (and log a 403) for admins.
  const session = await requireServerRole("INSTANSI");
  if (!session) notFound();

  const [{ data: overview }, { data: sessions }, { data: progress }] = await Promise.all([
    fetchInstansiOverviewServer(),
    fetchInstansiSessionsServer({ limit: 5 }),
    fetchInstansiProgressServer(PROGRESS_SESSIONS_LIMIT),
  ]);

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Ringkasan"
        description="Pantau pegawai, sesi, dan progres pengerjaan tes."
      />
      <OverviewCards overview={overview} />
      <SessionProgressSection sessions={progress.sessions} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sesi terbaru</CardTitle>
            <CardDescription>5 sesi terakhir beserta tautan undangan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada sesi.{" "}
                <Link href="/instansi/buat-sesi" className="underline underline-offset-4">
                  Buat sesi pertama
                </Link>
                .
              </p>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <Link href={`/instansi/sesi/${s.id}`} className="truncate text-sm font-medium hover:underline">
                      {s.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {SESSION_STATUS_LABEL[s.status]} · slot {s.slotLimit}
                    </p>
                  </div>
                  {s.status === "ACTIVE" ? (
                    <CopyInviteButton token={s.token} />
                  ) : s.status === "PENDING_PAYMENT" ? (
                    <Button asChild size="sm">
                      <Link href={`/instansi/sesi/${s.id}`}>Bayar</Link>
                    </Button>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi cepat</CardTitle>
            <CardDescription>Mulai dari sini.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Button key={link.href} variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
                  <Link href={link.href}>
                    <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                    <span className="text-left">
                      <span className="block text-sm font-medium">{link.title}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
