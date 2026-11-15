import Link from "next/link";
import { CircleCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MeResultItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { isRawPatternCode } from "@/lib/format/format-scores";

/** One released result on the dashboard, linking to its detail page. */
export function ResultCard({ result }: { result: MeResultItem }) {
  // A RAW_n code just repeats the score the detail page already shows; the
  // MBTI/DISC type codes are the result and stay.
  const code = isRawPatternCode(result.patternCode) ? "" : result.patternCode;

  return (
    <Link href={`/hasil/${result.attemptId}`} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleCheck className="size-4 text-primary" aria-hidden />
            {result.testName}
          </CardTitle>
          <CardDescription className="tabular-nums">
            {code
              ? `${code} · ${formatIdDate(result.completedAt)}`
              : formatIdDate(result.completedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm font-medium text-primary">Lihat hasil</span>
        </CardContent>
      </Card>
    </Link>
  );
}
