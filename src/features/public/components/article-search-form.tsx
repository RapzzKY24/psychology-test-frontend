/**
 * No-JS GET search form for `/artikel`. Uses a server-side action-less `<form>`
 * so it works without client JS; preserves the active category via a hidden input.
 */
export function ArticleSearchForm({ category }: { category?: string }) {
  return (
    <form action="/artikel" method="get" className="flex flex-col gap-3 sm:flex-row">
      {category ? <input type="hidden" name="category" value={category} /> : null}
      <input
        type="search"
        name="search"
        placeholder="Cari artikel..."
        aria-label="Cari artikel"
        className="w-full flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
      <button type="submit" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Cari
      </button>
    </form>
  );
}
