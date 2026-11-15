import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TestCategory } from "@/lib/api/types";

/** Pages to show: first, last, and the current neighbourhood. */
function pageNumbers(page: number, totalPages: number): number[] {
  return Array.from(new Set([1, page - 1, page, page + 1, totalPages]))
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
}

/** Page links for the test catalogue, keeping the active category. */
export function TestPagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category?: TestCategory;
}) {
  const href = (next: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (next > 1) params.set("page", String(next));
    const qs = params.toString();
    return qs ? `/tes?${qs}` : "/tes";
  };

  const numbers = pageNumbers(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Navigasi halaman">
      <Button
        asChild={page > 1}
        variant="outline"
        size="icon"
        className="rounded-full"
        disabled={page === 1}
      >
        {page > 1 ? (
          <Link href={href(page - 1)} aria-label="Halaman sebelumnya">
            <ChevronLeft className="size-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden>
            <ChevronLeft className="size-4" />
          </span>
        )}
      </Button>

      {numbers.map((n, index) => {
        const gap = index > 0 && n - numbers[index - 1] > 1;
        return (
          <span key={n} className="flex items-center gap-2">
            {gap ? <span className="text-muted-foreground px-1 text-sm">…</span> : null}
            <Link
              href={href(n)}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
                n === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {n}
            </Link>
          </span>
        );
      })}

      <Button
        asChild={page < totalPages}
        variant="outline"
        size="icon"
        className="rounded-full"
        disabled={page === totalPages}
      >
        {page < totalPages ? (
          <Link href={href(page + 1)} aria-label="Halaman berikutnya">
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden>
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </nav>
  );
}
