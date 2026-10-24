import Link from "next/link";

/**
 * Server-rendered category filter for `/artikel` (no-JS friendly links that
 * preserve the current search query. Categories come from the public catalog.
 */
export function ArticleCategoryFilters({
  categories,
  category,
  search,
}: {
  categories: Array<{ value: string; label: string }>;
  category?: string;
  search?: string;
}) {
  const searchQuery = search ? `?search=${encodeURIComponent(search)}` : "";
  const hrefFor = (value?: string) =>
    value ? `/artikel?category=${encodeURIComponent(value)}${searchQuery}` : `/artikel${searchQuery}`;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori artikel">
      <Link
        href={hrefFor(undefined)}
        aria-current={!category ? "true" : undefined}
        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
          !category
            ? "border-primary bg-primary font-medium text-primary-foreground"
            : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        Semua
      </Link>
      {categories.map((c) => (
        <Link
          key={c.value}
          href={hrefFor(c.value)}
          aria-current={category === c.value ? "true" : undefined}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            category === c.value
              ? "border-primary bg-primary font-medium text-primary-foreground"
              : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
