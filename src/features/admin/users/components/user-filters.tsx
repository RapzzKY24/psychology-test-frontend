"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "../schemas";
import { USER_ROLES } from "@/lib/api/types";

const OPTIONS = [
  { value: "", label: "Semua" },
  ...USER_ROLES.map((role) => ({ value: role, label: ROLE_LABEL[role] })),
] as const;

export function UserFilters({ role }: { role?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const apply = useCallback(
    (nextRole: string) => {
      const p = new URLSearchParams(params);
      p.delete("page");
      if (nextRole) p.set("role", nextRole);
      else p.delete("role");
      const qs = p.toString();
      router.push(qs ? `/admin/users?${qs}` : "/admin/users");
    },
    [params, router],
  );

  return (
    <div className="flex rounded-lg border p-1" role="group" aria-label="Filter role">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => apply(option.value)}
          aria-pressed={role === option.value}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            role === option.value
              ? "bg-primary font-medium text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
