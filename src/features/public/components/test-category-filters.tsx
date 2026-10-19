import Link from "next/link";
import { cn } from "@/lib/utils";
import { TEST_CATEGORIES, TEST_CATEGORY_LABELS, type TestCategory } from "@/lib/api/types";

/** Server-rendered category filter for `/tes` (works without JS, resets paging). */
export function TestCategoryFilters({ category }: { category?: TestCategory }) {
  const chips: Array<{ value?: TestCategory; label: string }> = [
    { label: "Semua" },
    ...TEST_CATEGORIES.map((value) => ({ value, label: TEST_CATEGORY_LABELS[value] })),
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori tes">
      {chips.map((chip) => {
        const active = (category ?? undefined) === chip.value;
        return (
          <Link
            key={chip.value ?? "all"}
            href={chip.value ? `/tes?category=${chip.value}` : "/tes"}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active
                ? "border-primary bg-primary font-medium text-primary-foreground"
                : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
