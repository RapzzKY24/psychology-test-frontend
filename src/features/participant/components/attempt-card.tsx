import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MeAttemptItem } from "@/lib/api/types";

/**
 * One attempt on the participant dashboard. Only an unfinished attempt carries
 * a way back into the runner; the rest are waiting on a psychologist.
 */
export function AttemptCard({ attempt }: { attempt: MeAttemptItem }) {
  const inProgress = attempt.status === "IN_PROGRESS";
  const waiting = attempt.status === "COMPLETED" && attempt.resultStatus === "PENDING_REVIEW";
  const returned = attempt.status === "COMPLETED" && attempt.resultStatus === "RETURNED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {inProgress ? (
            <Clock className="size-4 text-primary" aria-hidden />
          ) : (
            <FileText className="size-4 text-muted-foreground" aria-hidden />
          )}
          {attempt.testName}
        </CardTitle>
        <CardDescription>
          {inProgress && "Belum selesai — lanjutkan kapan saja."}
          {waiting && "Menunggu review psikolog."}
          {returned && "Dikembalikan ke psikolog untuk diproses ulang."}
          {!inProgress && !waiting && !returned && "Sedang diproses."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inProgress && (
          <Link
            href={`/tes/kerjakan/${attempt.id}`}
            className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Lanjutkan Tes
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
