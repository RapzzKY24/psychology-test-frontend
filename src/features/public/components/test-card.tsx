import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Brain, Briefcase, Clock, Compass, HeartHandshake, Shapes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS, type PublicTest, type TestCategory } from "@/lib/api/types";

/**
 * One accent per category, from the `--category-*` tokens. The class strings
 * are spelled out rather than built from a template so Tailwind can see them.
 */
const CATEGORY_ACCENT: Record<TestCategory, { icon: LucideIcon; accent: string; band: string }> = {
  PERSONALITY: {
    icon: HeartHandshake,
    accent: "bg-category-personality/12 text-category-personality",
    band: "bg-category-personality/12 border-category-personality/25",
  },
  COGNITIVE: {
    icon: Brain,
    accent: "bg-category-cognitive/12 text-category-cognitive",
    band: "bg-category-cognitive/12 border-category-cognitive/25",
  },
  WORK_STYLE: {
    icon: Briefcase,
    accent: "bg-category-work-style/12 text-category-work-style",
    band: "bg-category-work-style/12 border-category-work-style/25",
  },
  INTEREST: {
    icon: Compass,
    accent: "bg-category-interest/12 text-category-interest",
    band: "bg-category-interest/12 border-category-interest/25",
  },
  PROJECTIVE: {
    icon: Shapes,
    accent: "bg-category-projective/12 text-category-projective",
    band: "bg-category-projective/12 border-category-projective/25",
  },
};

/**
 * Public test card. Shared by the landing preview and the /tes catalog; the buy
 * action is injected so the catalog can wire it per role.
 *
 * Every card reserves the same 112px band so a catalog row never mixes a tall
 * image card with a short text card. With a cover it is the photo; without one
 * it is the category accent and icon — a deliberate block, not an empty grey
 * box waiting for an upload.
 */
export function TestCard({ test, buySlot }: { test: PublicTest; buySlot?: ReactNode }) {
  const { icon: CategoryIcon, accent, band } = CATEGORY_ACCENT[test.category];

  return (
    <Card className="hover:border-primary/30 h-full gap-0 overflow-hidden rounded-2xl pt-0 shadow-sm transition-[box-shadow,border-color] hover:shadow-md">
      <div
        className={`flex h-28 w-full shrink-0 items-center justify-center border-b ${band}`}
      >
        {test.imageUrl ? (
          <Image
            src={test.imageUrl}
            alt={test.name}
            width={640}
            height={360}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            data-testid="category-band"
            className="bg-background/80 ring-background/70 flex size-16 items-center justify-center rounded-full shadow-sm ring-4"
          >
            <CategoryIcon className="size-8" strokeWidth={1.5} aria-hidden />
          </span>
        )}
      </div>

      <CardHeader className="gap-2">
        <Badge variant="secondary" className={`w-fit border-transparent ${accent}`}>
          {TEST_CATEGORY_LABELS[test.category]}
        </Badge>
        <CardTitle className="line-clamp-2 text-lg leading-snug">{test.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground line-clamp-2 text-sm">{test.description}</p>
        <span className="text-muted-foreground mt-auto flex items-center gap-1.5 text-sm">
          <Clock className="size-4" aria-hidden />
          {test.estimatedDurationMin} menit
        </span>
      </CardContent>

      <CardFooter className="gap-2 border-t pt-4">
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <Link href={`/tes/${test.slug}`}>Detail</Link>
        </Button>
        {buySlot}
      </CardFooter>
    </Card>
  );
}
