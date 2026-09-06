import { Badge } from "@/components/ui/badge";
import type { ResultStatus } from "@/lib/api/types";
import { RESULT_STATUS_LABEL } from "../constants";

const STYLE: Record<ResultStatus, string> = {
  // Gold accent = waiting on the psychologist (the operational queue).
  PENDING_REVIEW: "border-chart-3/40 bg-chart-3/15 text-foreground",
  APPROVED: "border-transparent bg-primary text-primary-foreground",
  RETURNED: "border-transparent bg-muted text-muted-foreground",
};

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return (
    <Badge variant="outline" className={STYLE[status]}>
      {RESULT_STATUS_LABEL[status]}
    </Badge>
  );
}
