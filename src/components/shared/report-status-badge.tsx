import { Badge } from "@/components/ui/badge";
import type { ReportStatus } from "@/lib/api/types";

const LABEL: Record<ReportStatus, string> = {
  DRAFT: "Draf",
  ACTIVE: "Terbit",
  SUPERSEDED: "Diganti",
  REVOKED: "Dibatalkan",
};

const VARIANT: Record<ReportStatus, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  ACTIVE: "default",
  SUPERSEDED: "outline",
  REVOKED: "destructive",
};

/** Shared by the psychologist list and the institution report tab. */
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>;
}
