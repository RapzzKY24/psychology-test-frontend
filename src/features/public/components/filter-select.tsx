"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  param: string;
  value?: string;
  options: readonly FilterOption[];
  basePath: string;
  /** Other query params to keep, e.g. the article search term. */
  preserve?: Record<string, string | undefined>;
  className?: string;
}

/**
 * One native select instead of a row of chips. Changing it navigates with the
 * selected value and resets paging; the browser stays where it is.
 */
export function FilterSelect({
  label,
  param,
  value,
  options,
  basePath,
  preserve = {},
  className,
}: FilterSelectProps) {
  const router = useRouter();

  function onChange(next: string) {
    const params = new URLSearchParams();
    for (const [key, current] of Object.entries(preserve)) {
      if (current) params.set(key, current);
    }
    if (next) params.set(param, next);
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
  }

  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="bg-background focus:ring-primary/40 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
