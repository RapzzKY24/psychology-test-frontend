import { FilterSelect } from "./filter-select";

/**
 * One category dropdown for `/artikel`. Categories come from the published
 * catalog; the current search term is preserved when the category changes.
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
  const options = [{ value: "", label: "Semua kategori" }, ...categories];

  return (
    <FilterSelect
      label="Kategori artikel"
      param="category"
      value={category ?? ""}
      options={options}
      basePath="/artikel"
      preserve={{ search }}
      className="sm:max-w-xs"
    />
  );
}
