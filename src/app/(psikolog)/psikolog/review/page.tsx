import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewQueueIsland } from "@/features/psikolog/review/components/review-queue-island";
import { fetchReviewQueueServer } from "@/features/psikolog/review/api.server";
import { qk } from "@/lib/api/query-keys";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Review Hasil" };

const TABS: Array<{ label: string; value: string | undefined; href: string }> = [
  { label: "Semua", value: undefined, href: "/psikolog/review" },
  { label: "Menunggu", value: "PENDING_REVIEW", href: "/psikolog/review?status=PENDING_REVIEW" },
  { label: "Dikembalikan", value: "RETURNED", href: "/psikolog/review?status=RETURNED" },
  { label: "Disetujui", value: "APPROVED", href: "/psikolog/review?status=APPROVED" },
];

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const allowed = ["PENDING_REVIEW", "RETURNED", "APPROVED"] as const;
  const status = (allowed as readonly string[]).includes(sp.status ?? "")
    ? (sp.status as (typeof allowed)[number])
    : undefined;

  let raw: Awaited<ReturnType<typeof fetchReviewQueueServer>>;
  try {
    raw = await fetchReviewQueueServer({ status, page });
  } catch {
    raw = { data: [], meta: { page, limit: 10, total: 0, totalPages: 0 } } as Awaited<
      ReturnType<typeof fetchReviewQueueServer>
    >;
  }
  const { data } = raw;
  const listKey = qk.psikolog.reviews.list({ page, status });

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Review Hasil"
        description="Hasil menunggu peninjauan — setujui, kembalikan, atau koreksi."
      />
      <nav aria-label="Filter status" className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={status === tab.value ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              status === tab.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-muted",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <ReviewQueueIsland
        listKey={listKey}
        initial={{ data }}
        status={status}
        page={page}
      />
    </main>
  );
}
