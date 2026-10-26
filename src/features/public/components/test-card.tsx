import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ClipboardList, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS, type PublicTest } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";

/**
 * Public test card (Halodoc style: white rounded card, category badge, one
 * price). Shared by the landing preview and the /tes catalog. The buy action is
 * injected so the catalog can wire it per-role without duplicating the card.
 *
 * Every card reserves the same 160px media strip — with a cover it is the
 * photo, without one a quiet placeholder — so a catalog row never mixes a tall
 * image card with a short text card.
 */
export function TestCard({ test, buySlot }: { test: PublicTest; buySlot?: ReactNode }) {
  return (
    <Card className="h-full overflow-hidden rounded-2xl pt-0 shadow-sm transition-shadow hover:shadow-md">
      <div className="bg-primary/5 h-40 w-full shrink-0 overflow-hidden">
        {test.imageUrl ? (
          <Image
            src={test.imageUrl}
            alt={test.name}
            width={640}
            height={360}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            data-testid="cover-placeholder"
            className="flex h-full items-center justify-center"
            aria-hidden
          >
            <ClipboardList className="text-primary/25 size-8" />
          </div>
        )}
      </div>

      <CardHeader>
        <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
          {TEST_CATEGORY_LABELS[test.category]}
        </Badge>
        <CardTitle className="line-clamp-2 text-lg">{test.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">{test.description}</p>
        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Clock className="size-4" aria-hidden />
          {test.estimatedDurationMin} menit
        </div>
        <p className="text-foreground mt-auto text-lg font-semibold">{formatIdr(test.price)}</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <Link href={`/tes/${test.slug}`}>Detail</Link>
        </Button>
        {buySlot}
      </CardFooter>
    </Card>
  );
}
