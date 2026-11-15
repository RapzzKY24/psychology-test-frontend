"use client";

import { Progress } from "@/components/ui/progress";
import { ElapsedTimer } from "./elapsed-timer";
import type { ScorerType } from "@/lib/api/types";

const INSTRUCTIONS: Record<ScorerType, React.ReactNode> = {
  FORCED_CHOICE_DISC: (
    <>
      Pilih satu kata yang <span className="font-medium text-foreground">paling sesuai</span> dan
      satu yang <span className="font-medium text-foreground">paling tidak sesuai</span> dengan diri
      Anda. Jawaban tersimpan otomatis — boleh kembali ke soal sebelumnya.
    </>
  ),
  FORCED_CHOICE_PAIR: (
    <>
      Tiap soal berisi dua pernyataan — pilih{" "}
      <span className="font-medium text-foreground">satu</span> yang paling menggambarkan diri Anda.
      Tidak ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  LIKERT: (
    <>
      Nilai seberapa sesuai tiap pernyataan dengan diri Anda pada skala angka yang tersedia. Tidak
      ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  PAIR_TALLY: (
    <>
      Tiap soal berisi dua pernyataan — pilih{" "}
      <span className="font-medium text-foreground">satu</span> yang paling menggambarkan diri Anda.
      Tidak ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  RIGHT_WRONG_NORM: (
    <>
      Jawab tiap soal sesuai petunjuknya — pilih opsi atau tulis jawaban singkat. Jawaban tersimpan
      otomatis; soal yang dilewati dihitung salah.
    </>
  ),
  SCALE_TALLY: (
    <>
      Pilih <span className="font-medium text-foreground">Ya</span> bila pernyataan menggambarkan
      diri Anda, <span className="font-medium text-foreground">Tidak</span> bila tidak. Tidak ada
      jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  CHOICE_TALLY: (
    <>
      Pilih satu jawaban yang paling menggambarkan diri Anda. Tidak ada jawaban benar atau salah;
      jawaban tersimpan otomatis.
    </>
  ),
  MARK_GROUP: (
    <>
      Tandai tiap aktivitas dengan{" "}
      <span className="font-medium text-foreground">+</span> bila Anda menyukainya dan{" "}
      <span className="font-medium text-foreground">−</span> bila tidak. Tidak ada jawaban benar
      atau salah; jawaban tersimpan otomatis.
    </>
  ),
  RANK_GROUP: (
    <>
      Urutkan tiap daftar pekerjaan dari yang{" "}
      <span className="font-medium text-foreground">paling Anda sukai</span> sampai yang paling
      tidak disukai. Tidak ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  PAIR_NORM: (
    <>
      Tiap soal berisi dua pernyataan — pilih{" "}
      <span className="font-medium text-foreground">satu</span> yang lebih menggambarkan diri Anda.
      Tidak ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
  OPTION_SCALE: (
    <>
      Tiap soal berisi satu pernyataan dengan tiga pilihan jawaban. Pilih{" "}
      <span className="font-medium text-foreground">satu</span> yang paling menggambarkan diri
      Anda — usahakan memilih <span className="font-medium text-foreground">a</span> atau{" "}
      <span className="font-medium text-foreground">c</span>, dan pilih{" "}
      <span className="font-medium text-foreground">b</span> hanya bila benar-benar ragu. Jawaban
      tersimpan otomatis.
    </>
  ),
  STYLE_GRID: (
    <>
      Tiap soal berisi dua pernyataan tentang cara Anda memimpin — pilih{" "}
      <span className="font-medium text-foreground">satu</span> yang paling menggambarkan diri
      Anda. Tidak ada jawaban benar atau salah; jawaban tersimpan otomatis.
    </>
  ),
};

interface RunnerHeaderProps {
  testName: string;
  answeredCount: number;
  total: number;
  scorerType: ScorerType;
  running: boolean;
  remainingSeconds?: number | null;
}

/** Test name, progress bar and the family-specific instruction line. */
export function RunnerHeader({
  testName,
  answeredCount,
  total,
  scorerType,
  running,
  remainingSeconds,
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
            <ElapsedTimer running={running} remainingSeconds={remainingSeconds} />
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
