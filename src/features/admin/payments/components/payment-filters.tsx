"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PAYMENT_STATUS_LABEL } from "../constants";

const STATUSES = [
  { value: "", label: "Semua" },
  { value: "PENDING", label: PAYMENT_STATUS_LABEL.PENDING },
  { value: "PAID", label: PAYMENT_STATUS_LABEL.PAID },
  { value: "EXPIRED", label: PAYMENT_STATUS_LABEL.EXPIRED },
  { value: "CANCELLED", label: PAYMENT_STATUS_LABEL.CANCELLED },
] as const;

export function PaymentFilters({ status, amount }: { status?: string; amount?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [amountDraft, setAmountDraft] = useState(amount ?? "");

  const apply = useCallback(
    (next: { status?: string; amount?: string }) => {
      const p = new URLSearchParams(params);
      p.delete("page");
      if (next.status !== undefined) {
        if (next.status) p.set("status", next.status);
        else p.delete("status");
      }
      if (next.amount !== undefined) {
        if (next.amount) p.set("amount", next.amount);
        else p.delete("amount");
      }
      const qs = p.toString();
      router.push(qs ? `/admin/pembayaran?${qs}` : "/admin/pembayaran");
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ amount: amountDraft.replace(/\D/g, "") });
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={amountDraft}
          onChange={(e) => setAmountDraft(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          placeholder="Cari nominal persis, mis. 200021"
          aria-label="Cari nominal persis"
          className="w-64"
        />
        <button type="submit" className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
          Cari
        </button>
      </form>
    </div>
  );
}
