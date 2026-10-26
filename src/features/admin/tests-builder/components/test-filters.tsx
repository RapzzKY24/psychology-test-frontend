"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEST_CATEGORIES } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "", label: "Semua" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "PUBLISHED", label: "PUBLISHED" },
  { value: "ARCHIVED", label: "ARCHIVED" },
] as const;

const CATEGORY_LABEL: Record<(typeof TEST_CATEGORIES)[number], string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

export function TestFilters({ status, category }: { status?: string; category?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const apply = useCallback(
    (next: { status?: string; category?: string }) => {
      const p = new URLSearchParams(params);
      p.delete("page"); // filter change resets to page 1
      if (next.status !== undefined) {
        if (next.status) p.set("status", next.status);
        else p.delete("status");
      }
      if (next.category !== undefined) {
        if (next.category) p.set("category", next.category);
        else p.delete("category");
      }
      const qs = p.toString();
      router.push(qs ? `/admin/tes?${qs}` : "/admin/tes");
    },
    [params, router],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg border p-1" role="group" aria-label="Filter status">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => apply({ status: s.value })}
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
      <Select
        value={category ?? "ALL"}
        onValueChange={(v) => apply({ category: v === "ALL" ? "" : v })}
      >
        <SelectTrigger className="w-44" aria-label="Filter kategori">
          <SelectValue placeholder="Semua kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua kategori</SelectItem>
          {TEST_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
