import Link from "next/link";

/** Page links for the article list, carrying the active filters along. */
export function ArticlePagination({
  page,
  totalPages,
  category,
  search,
}: {
  page: number;
  totalPages: number;
  category?: string;
  search?: string;
}) {
  const href = (next: number) => {
    const params = new URLSearchParams({ page: String(next) });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    return `/artikel?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Navigasi halaman">
      {page > 1 ? (
        <Link href={href(page - 1)} className="text-sm font-medium text-primary hover:underline">
          Sebelumnya
        </Link>
      ) : null}
      <span className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="text-sm font-medium text-primary hover:underline">
          Berikutnya
        </Link>
      ) : null}
    </nav>
  );
}
