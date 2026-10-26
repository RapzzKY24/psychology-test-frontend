import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CATEGORY_LABELS, type PublicTest } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";

/**
 * Public test card (Halodoc style: white rounded card, category badge, one
 * price). Shared by the landing preview and the /tes catalog. The buy action is
 * injected so the catalog can wire it per-role without duplicating the card.
 */
export function TestCard({ test, buySlot }: { test: PublicTest; buySlot?: ReactNode }) {
  return (
    <Card className="h-full rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      {test.imageUrl && (
        <Image
          src={test.imageUrl}
          alt={test.name}
          width={640}
          height={360}
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <CardHeader>
        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
          {TEST_CATEGORY_LABELS[test.category]}
        </Badge>
        <CardTitle className="text-lg">{test.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{test.description}</p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden />
          {test.estimatedDurationMin} menit
        </div>
        <p className="mt-auto text-lg font-semibold text-foreground">{formatIdr(test.price)}</p>
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
