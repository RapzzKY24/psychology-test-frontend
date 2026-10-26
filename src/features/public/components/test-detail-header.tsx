import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TEST_CATEGORY_LABELS, type PublicTest } from "@/lib/api/types";

/** Title block of the test detail page: category, duration, cover. */
export function TestDetailHeader({ test }: { test: PublicTest }) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {TEST_CATEGORY_LABELS[test.category]}
        </Badge>
        <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
          <Clock className="size-3.5" aria-hidden />
          {test.estimatedDurationMin} menit
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{test.name}</h1>
      <p className="text-muted-foreground max-w-2xl leading-relaxed">{test.description}</p>

      {test.imageUrl && (
        <Image
          src={test.imageUrl}
          alt={test.name}
          width={960}
          height={540}
          priority
          className="aspect-[16/9] w-full rounded-2xl border object-cover"
        />
      )}
    </header>
  );
}
