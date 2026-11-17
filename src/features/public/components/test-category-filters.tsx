import { TEST_CATEGORIES, TEST_CATEGORY_LABELS, type TestCategory } from "@/lib/api/types";
import { FilterSelect } from "./filter-select";

/** One category dropdown for the public test catalogue. */
export function TestCategoryFilters({ category }: { category?: TestCategory }) {
  const options = [
    { value: "", label: "Semua kategori" },
    ...TEST_CATEGORIES.map((value) => ({ value, label: TEST_CATEGORY_LABELS[value] })),
  ];

  return (
    <FilterSelect
      label="Kategori tes"
      param="category"
      value={category ?? ""}
      options={options}
      basePath="/tes"
      className="sm:max-w-xs"
    />
  );
}
