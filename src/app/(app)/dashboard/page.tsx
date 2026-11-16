import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { fetchMeOverviewServer } from "@/features/participant/api";
import { buildActivity } from "@/features/participant/activity";
import { ActivityList } from "@/features/participant/components/activity-list";
import { ContinueTesting } from "@/features/participant/components/continue-testing";
import { OverviewStats } from "@/features/participant/components/overview-stats";
import { QuickActions } from "@/features/participant/components/quick-actions";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function DashboardPage() {
  const { data: overview } = await fetchMeOverviewServer();
  const activity = buildActivity(overview);
  const nothingYet = Object.values(overview.counts).every((count) => count === 0);

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Ringkasan"
        description="Status tes Anda: yang sedang dikerjakan, yang menunggu psikolog, dan yang sudah terbit."
      />

      {!nothingYet && <QuickActions overview={overview} />}

      <OverviewStats counts={overview.counts} />

      {nothingYet ? (
        <section className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">Belum ada tes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih tes untuk memulai. Hasil dan sertifikat akan muncul di sini.
          </p>
          <Button asChild className="mt-4">
            <Link href="/tes">Lihat tes</Link>
          </Button>
        </section>
      ) : (
        <>
          {overview.activeAttempts.length > 0 && (
            <ContinueTesting
              attempts={overview.activeAttempts}
              total={overview.counts.inProgress}
            />
          )}

          <section className="space-y-3">
            <div>
              <h2 className="text-base font-semibold">Aktivitas terakhir</h2>
              <p className="text-sm text-muted-foreground">
                Status pembayaran, tes selesai, hasil disetujui, dan sertifikat terbit.
              </p>
            </div>
            <ActivityList items={activity} />
          </section>
        </>
      )}
    </main>
  );
}
