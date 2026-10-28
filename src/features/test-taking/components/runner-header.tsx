"use client";

import { Progress } from "@/components/ui/progress";
import { ElapsedTimer } from "./elapsed-timer";
import type { ScorerType } from "@/lib/api/types";

const INSTRUCTIONS: Record<ScorerType, React.ReactNode> = {
  FORCED_CHOICE_DISC: (
    <>
      Pilih satu kata yang <span className="font-medium text-foreground">paling sesuai</span>{" "}
      dan satu yang <span className="font-medium text-foreground">paling tidak sesuai</span>{" "}
      dengan diri Anda. Jawaban tersimpan otomatis — boleh kembali ke soal sebelumnya.
    </>
  ),
  RIGHT_WRONG_NORM: <>Pilih satu jawaban untuk setiap soal. Jawaban tersimpan otomatis.</>,
};

interface RunnerHeaderProps {
  testName: string;
  answeredCount: number;
  total: number;
  scorerType: ScorerType;
  running: boolean;
}

/** Test name, progress bar and the family-specific instruction line. */
export function RunnerHeader({
  testName,
  answeredCount,
  total,
  scorerType,
  running,
}: RunnerHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="font-medium">{testName}</p>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground tabular-nums">
            {answeredCount} dari {total} terjawab
          </span>
          <span className="lg:hidden">
            <ElapsedTimer running={running} />
          </span>
        </div>
      </div>
      <Progress
        value={total === 0 ? 0 : (answeredCount / total) * 100}
        aria-label="Progres pengerjaan"
      />
      <p className="text-xs text-muted-foreground">{INSTRUCTIONS[scorerType]}</p>
    </div>
  );
}
