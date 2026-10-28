"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResultStatusBadge } from "@/components/admin/result-status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ResultStatus } from "@/lib/api/types";
import { ApproveButton, ReturnDialog } from "./review-actions";
import { ReviewCorrectionDialog } from "./review-correction-dialog";
import { ReviewNotesDialog } from "./review-notes-dialog";

interface ReviewDetailActionsProps {
  result: {
    id: string;
    status: ResultStatus;
    notes?: string | null;
    scores: Record<string, number>;
    patternCode: string;
    correctedScores?: Record<string, number> | null;
    correctedPatternCode?: string | null;
  };
}

/** Status badge plus the actions allowed for that status. */
export function ReviewDetailActions({ result }: ReviewDetailActionsProps) {
  const isPending = result.status === "PENDING_REVIEW";
  const isApproved = result.status === "APPROVED";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ResultStatusBadge status={result.status} />
      {isApproved ? (
        <>
          <span className="rounded-lg border bg-amber-50 px-3 py-1.5 text-sm text-amber-800">
            Hasil sudah disetujui — read-only
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} title="Segera hadir — hold">
                  <Button
                    variant="outline"
                    className="h-11"
                    disabled
                    aria-disabled={true}
                    title="Segera hadir — hold"
                  >
                    Rilis Hasil
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Segera hadir — hold</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <>
          {isPending && (
            <>
              <ApproveButton resultId={result.id} />
              <ReturnDialog resultId={result.id} />
            </>
          )}
          <ReviewNotesDialog resultId={result.id} initialNotes={result.notes ?? null} />
          <ReviewCorrectionDialog
            resultId={result.id}
            currentScores={result.correctedScores ?? result.scores}
            currentPatternCode={result.correctedPatternCode ?? result.patternCode}
          />
        </>
      )}
      <Link href="/psikolog/review" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke antrean
      </Link>
    </div>
  );
}
