import { Badge } from "@/components/ui/badge";
import type { AdminPaymentListItem } from "@/lib/api/types";

const STYLE: Record<AdminPaymentListItem["status"], string> = {
  // Gold accent = needs admin attention (the reconciliation queue).
  PENDING: "border-chart-3/40 bg-chart-3/15 text-foreground",
  PAID: "border-transparent bg-primary text-primary-foreground",
  EXPIRED: "border-transparent bg-muted text-muted-foreground",
  CANCELLED: "border-transparent bg-muted text-muted-foreground line-through",
};

export function PaymentStatusBadge({ status }: { status: AdminPaymentListItem["status"] }) {
  return (
    <Badge variant="outline" className={STYLE[status]}>
      {status}
    </Badge>
  );
}
