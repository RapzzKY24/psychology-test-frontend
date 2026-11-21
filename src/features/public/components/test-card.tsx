import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS, type PublicTest, type TestCategory } from "@/lib/api/types";

/**
 * One accent dot per category, from the `--category-*` tokens. The class
 * strings are spelled out rather than built from a template so Tailwind can
 * see them.
 */
const CATEGORY_DOT: Record<TestCategory, string> = {
  PERSONALITY: "bg-category-personality",
  COGNITIVE: "bg-category-cognitive",
  WORK_STYLE: "bg-category-work-style",
  INTEREST: "bg-category-interest",
  PROJECTIVE: "bg-category-projective",
};

/**
 * Public test card. Shared by the landing preview and the /tes catalog; the
 * buy action is injected so the catalog can wire it per role.
 *
 * The card is deliberately text-first: no media band, so the title and the
 * description get the width and a catalog row stays short. Category colour
 * lives in the dot, not in a tinted block.
 */
export function TestCard({ test, buySlot }: { test: PublicTest; buySlot?: ReactNode }) {
  return (
    <Card className="hover:border-primary/30 flex h-full flex-col gap-0 rounded-2xl p-5 shadow-sm transition-[box-shadow,border-color] hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-0">
        <span className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
          <span className={`size-1.5 rounded-full ${CATEGORY_DOT[test.category]}`} aria-hidden />
          {TEST_CATEGORY_LABELS[test.category]}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" aria-hidden />
          {test.estimatedDurationMin} menit
        </span>
      </CardHeader>

      <CardTitle className="mt-3 line-clamp-2 text-lg leading-snug">{test.name}</CardTitle>

      <p className="text-muted-foreground mt-2 line-clamp-2 pb-4 text-sm leading-relaxed">
        {test.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
        {buySlot ? (
          <>
            <Link
              href={`/tes/${test.slug}`}
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Lihat detail
            </Link>
            {buySlot}
          </>
        ) : (
          <Link
            href={`/tes/${test.slug}`}
            className="text-primary ml-auto inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Lihat detail
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </Card>
  );
}
