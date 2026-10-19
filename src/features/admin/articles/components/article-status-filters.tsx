"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "", label: "Semua" },
  { value: "DRAFT", label: "Draf" },
  { value: "PUBLISHED", label: "Terbit" },
] as const;

export function ArticleStatusFilters({ status }: { status?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const apply = useCallback(
    (next: string) => {
      const p = new URLSearchParams(params);
      p.delete("page"); // filter change resets to page 1
      if (next) p.set("status", next);
      else p.delete("status");
      const qs = p.toString();
      router.push(qs ? `/admin/artikel?${qs}` : "/admin/artikel");
    },
    [params, router],
  );

  return (
    <div className="flex rounded-lg border p-1" role="group" aria-label="Filter status">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => apply(s.value)}
          aria-pressed={(status ?? "") === s.value}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            (status ?? "") === s.value
              ? "bg-primary font-medium text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
