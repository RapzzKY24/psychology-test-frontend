"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReviewRowActionsProps {
  resultId: string;
  isApproved: boolean;
  /** Full-width buttons for the mobile card layout. */
  stretch?: boolean;
}

/** Detail link plus the (still disabled) release button. */
export function ReviewRowActions({ resultId, isApproved, stretch = false }: ReviewRowActionsProps) {
  return (
    <div className={stretch ? "mt-3 flex gap-2" : "flex items-center gap-2"}>
      <Button variant="outline" size="sm" asChild className={stretch ? "flex-1" : undefined}>
        <Link href={`/psikolog/review/${resultId}`}>{isApproved ? "Detail" : "Tinjau"}</Link>
      </Button>
      {isApproved && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} title="Segera hadir — hold" className={stretch ? "flex-1" : undefined}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  aria-disabled={true}
                  title="Segera hadir — hold"
                  className={stretch ? "w-full" : undefined}
                >
                  Rilis Hasil
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Segera hadir — hold</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
