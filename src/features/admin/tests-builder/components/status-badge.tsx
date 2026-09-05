import { Badge } from "@/components/ui/badge";
import type { TestStatus } from "@/lib/api/types";

const STYLE: Record<TestStatus, string> = {
  DRAFT: "border-dashed text-muted-foreground",
  PUBLISHED: "border-transparent bg-primary text-primary-foreground",
  ARCHIVED: "border-transparent bg-muted text-muted-foreground",
};

export function TestStatusBadge({ status }: { status: TestStatus }) {
  return (
    <Badge variant="outline" className={STYLE[status]}>
      {status}
    </Badge>
  );
}
