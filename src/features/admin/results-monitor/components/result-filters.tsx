"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "", label: "Semua" },
  { value: "PENDING_REVIEW", label: "MENUNGGU REVIEW" },
  { value: "APPROVED", label: "APPROVED" },
  { value: "RETURNED", label: "RETURNED" },
] as const;

export function ResultFilters({ status }: { status?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const apply = useCallback(
    (nextStatus: string) => {
      const p = new URLSearchParams(params);
      p.delete("page");
      if (nextStatus) p.set("status", nextStatus);
      else p.delete("status");
      const qs = p.toString();
      router.push(qs ? `/admin/hasil?${qs}` : "/admin/hasil");
    },
    [params, router],
  );

  return (
    <div className="flex flex-wrap rounded-lg border p-1" role="group" aria-label="Filter status hasil">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => apply(s.value)}
          aria-pressed={status === s.value}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            status === s.value
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
