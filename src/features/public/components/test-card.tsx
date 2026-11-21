import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Clock,
  Compass,
  HeartHandshake,
  Shapes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS, type PublicTest, type TestCategory } from "@/lib/api/types";

/**
 * One accent per category, from the `--category-*` tokens. The class strings
 * are spelled out rather than built from a template so Tailwind can see them.
 * The tint stands in for a cover image when a test has none.
 */
const CATEGORY_STYLE: Record<
  TestCategory,
  { icon: LucideIcon; dot: string; tint: string; border: string; text: string }
> = {
  PERSONALITY: {
    icon: HeartHandshake,
    dot: "bg-category-personality",
    tint: "bg-category-personality/8",
    border: "border-category-personality/20",
    text: "text-category-personality",
  },
  COGNITIVE: {
    icon: Brain,
    dot: "bg-category-cognitive",
    tint: "bg-category-cognitive/8",
    border: "border-category-cognitive/20",
    text: "text-category-cognitive",
  },
  WORK_STYLE: {
    icon: Briefcase,
    dot: "bg-category-work-style",
    tint: "bg-category-work-style/8",
    border: "border-category-work-style/20",
    text: "text-category-work-style",
  },
  INTEREST: {
    icon: Compass,
    dot: "bg-category-interest",
    tint: "bg-category-interest/8",
    border: "border-category-interest/20",
    text: "text-category-interest",
  },
  PROJECTIVE: {
    icon: Shapes,
    dot: "bg-category-projective",
    tint: "bg-category-projective/8",
    border: "border-category-projective/20",
    text: "text-category-projective",
  },
};

/**
 * Public test card. Shared by the landing preview and the /tes catalog; the
 * buy action is injected so the catalog can wire it per role.
 *
 * A compact 80px thumbnail sits beside the title, so a cover has a place
 * without turning the card into a tall poster. Tests without one get a
 * category-tinted icon block instead of an empty grey box.
 */
export function TestCard({ test, buySlot }: { test: PublicTest; buySlot?: ReactNode }) {
  const { icon: CategoryIcon, dot, tint, border, text } = CATEGORY_STYLE[test.category];

  return (
    <Card className="hover:border-primary/30 flex h-full flex-col gap-0 rounded-2xl p-5 shadow-sm transition-[box-shadow,border-color] hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-0">
        <span className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
          <span className={`size-1.5 rounded-full ${dot}`} aria-hidden />
          {TEST_CATEGORY_LABELS[test.category]}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" aria-hidden />
          {test.estimatedDurationMin} menit
        </span>
      </CardHeader>

      <div className="mt-3 flex items-start gap-4 pb-4">
        <div
          className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border ${border} ${tint}`}
        >
          {test.imageUrl ? (
            <Image
              src={test.imageUrl}
              alt={test.name}
              width={192}
              height={160}
              sizes="96px"
              className="size-full object-cover"
            />
          ) : (
            <span data-testid="category-thumb" className="grid size-full place-items-center">
              <CategoryIcon className={`size-7 ${text}`} strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="line-clamp-2 text-lg leading-snug">{test.name}</CardTitle>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {test.description}
          </p>
        </div>
      </div>

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
