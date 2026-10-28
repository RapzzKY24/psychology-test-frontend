import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  fetchInstansiOverviewServer,
  fetchInstansiProgressServer,
} from "@/features/instansi/monitor/api.server";
import { OverviewCards } from "@/features/instansi/monitor/components/overview-cards";
import { QuickLinksCard } from "@/features/instansi/monitor/components/quick-links-card";
import { RecentSessionsCard } from "@/features/instansi/monitor/components/recent-sessions-card";
import { SessionProgressSection } from "@/features/instansi/monitor/components/session-progress-section";
import { PROGRESS_SESSIONS_LIMIT } from "@/features/instansi/monitor/constants";
import { fetchInstansiSessionsServer } from "@/features/instansi/sessions/api.server";
import { RECENT_SESSIONS_LIMIT } from "@/features/instansi/sessions/constants";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function InstansiPage() {
  // Next renders the layout and the page in parallel, so the layout's role
  // guard alone would still let this fetch run (and log a 403) for admins.
  const session = await requireServerRole("INSTANSI");
  if (!session) notFound();

  const [{ data: overview }, { data: sessions }, { data: progress }] =
    await Promise.all([
      fetchInstansiOverviewServer(),
      fetchInstansiSessionsServer({ limit: RECENT_SESSIONS_LIMIT }),
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
        <RecentSessionsCard sessions={sessions} />
        <QuickLinksCard />
      </div>
    </main>
  );
}
