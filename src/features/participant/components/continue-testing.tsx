import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveAttemptSummary } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

/**
 * The endpoint returns at most three unfinished attempts. Anything beyond that
 * is reachable from Riwayat, so the page never grows a second full list.
 */
export function ContinueTesting({
  attempts,
  total,
}: {
  attempts: ActiveAttemptSummary[];
  total: number;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Lanjutkan tes</h2>
          <p className="text-sm text-muted-foreground">Tes yang sudah dimulai dan belum selesai.</p>
        </div>
        {total > attempts.length && (
          <Link
            href="/dashboard/riwayat?stage=IN_PROGRESS"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {attempts.map((attempt) => (
          <article
            key={attempt.attemptId}
            className="flex items-center justify-between gap-4 rounded-lg border p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">{attempt.testName}</p>
              <p className="text-xs text-muted-foreground">
                Dimulai {formatIdDate(attempt.startedAt)}
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={`/tes/kerjakan/${attempt.attemptId}`}>
                Lanjutkan
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
