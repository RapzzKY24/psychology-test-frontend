import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/lib/api/types";
import { INVOICE_STATUS_LABEL } from "../schemas";

const STYLE: Record<InvoiceStatus, string> = {
  // Gold accent for the attention state — the client's highlight color.
  UNPAID: "border-chart-3/40 bg-chart-3/15 text-foreground",
  PAID: "border-transparent bg-primary text-primary-foreground",
  CANCELLED: "border-transparent bg-muted text-muted-foreground",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant="outline" className={STYLE[status]}>
      {INVOICE_STATUS_LABEL[status]}
    </Badge>
  );
}
