"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVOICE_STATUS_LABEL } from "../schemas";
import { INVOICE_STATUSES } from "@/lib/api/types";

export function InvoiceFilters({ status }: { status?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const apply = useCallback(
    (nextStatus: string) => {
      const p = new URLSearchParams(params);
      p.delete("page");
      if (nextStatus) p.set("status", nextStatus);
      else p.delete("status");
      const qs = p.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname, router],
  );

  return (
    <Select value={status ?? "ALL"} onValueChange={apply}>
      <SelectTrigger className="w-44" aria-label="Filter status invoice">
        <SelectValue placeholder="Semua status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Semua status</SelectItem>
        {INVOICE_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {INVOICE_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
