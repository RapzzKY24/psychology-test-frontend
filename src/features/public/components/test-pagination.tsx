import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TestCategory } from "@/lib/api/types";

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

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Navigasi halaman">
      {page > 1 ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link href={href(page - 1)}>Sebelumnya</Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link href={href(page + 1)}>Berikutnya</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
