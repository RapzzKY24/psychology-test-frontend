import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import {
  fetchMyProfile,
  fetchReviewQueueCount,
  fetchReviewStatsServer,
} from "@/features/psikolog/monitor/api";
import { OverviewCards } from "@/features/psikolog/monitor/components/overview-cards";
import { ReviewStatsSection } from "@/features/psikolog/monitor/components/review-stats-section";
import { REVIEW_STATS_DAYS } from "@/features/psikolog/monitor/constants";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function PsikologPage() {
  const [queueCount, profile, reviewStats] = await Promise.all([
    fetchReviewQueueCount(),
    fetchMyProfile(),
    fetchReviewStatsServer(REVIEW_STATS_DAYS),
  ]);

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Ringkasan"
        description="Antrean review dan kelengkapan profil Anda."
      />
      <OverviewCards queueCount={queueCount} isProfileComplete={profile.complete} />
      <ReviewStatsSection stats={reviewStats.data} />
    </main>
  );
}
