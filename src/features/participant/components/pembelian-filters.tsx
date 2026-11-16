import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/api/types";

/** Tab copy for the purchase filter; the row badge uses the same words. */
export const PEMBELIAN_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu bayar",
  PAID: "Dibayar",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

const ITEMS: Array<{ value?: OrderStatus; label: string }> = [
  { label: "Semua" },
  { value: "PENDING", label: PEMBELIAN_STATUS_LABEL.PENDING },
  { value: "PAID", label: PEMBELIAN_STATUS_LABEL.PAID },
  { value: "EXPIRED", label: PEMBELIAN_STATUS_LABEL.EXPIRED },
  { value: "CANCELLED", label: PEMBELIAN_STATUS_LABEL.CANCELLED },
];

/** Links, not buttons: the filter is part of the URL, so the page stays RSC. */
export function PembelianFilters({ status }: { status?: OrderStatus }) {
  return (
    <div
      role="group"
      aria-label="Filter status pembelian"
      className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg border p-1"
    >
      {ITEMS.map((item) => {
        const active = item.value === status;
        const href = item.value
          ? `/dashboard/pembelian?status=${item.value}`
          : "/dashboard/pembelian";
        return (
          <Link
            key={item.label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
