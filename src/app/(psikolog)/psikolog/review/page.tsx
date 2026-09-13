import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewQueueIsland } from "@/features/psikolog/review/components/review-queue-island";
import { fetchReviewQueueServer } from "@/features/psikolog/review/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Review Hasil" };

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const status =
    sp.status === "RETURNED" || sp.status === "PENDING_REVIEW" ? sp.status : undefined;

  const { data } = await fetchReviewQueueServer({ status, page });
  const listKey = qk.psikolog.reviews.list({ page, status });

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Review Hasil"
        description="Hasil menunggu peninjauan — setujui, kembalikan, atau koreksi."
      />
      <ReviewQueueIsland
        listKey={listKey}
        initial={{ data }}
        status={status}
        page={page}
      />
    </main>
  );
}
