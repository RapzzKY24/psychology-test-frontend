import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/api/types";
import { PEMBELIAN_STATUS_LABEL } from "./pembelian-filters";

const STYLE: Record<OrderStatus, string> = {
  // Gold = still waiting on the buyer, same accent as the admin payment queue.
  PENDING: "border-chart-3/40 bg-chart-3/15 text-foreground",
  PAID: "border-transparent bg-primary text-primary-foreground",
  EXPIRED: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
  CANCELLED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={STYLE[status]}>
      {PEMBELIAN_STATUS_LABEL[status]}
    </Badge>
  );
}
