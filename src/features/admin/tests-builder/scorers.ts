import type { ScorerType, TestCategory } from "@/lib/api/types";

/**
 * The scorer type decides which item editor the builder renders, so the admin
 * has to see what it means before creating the test. Category is only a catalog
 * label — it suggests a default but never overrides a deliberate choice.
 */
export interface ScorerOption {
  value: ScorerType;
  label: string;
  description: string;
}

export const SCORER_OPTIONS: readonly ScorerOption[] = [
  {
    value: "RIGHT_WRONG_NORM",
    label: "Pilihan ganda",
    description:
      "Tiap soal punya 2–8 opsi dan satu kunci jawaban. Skor dihitung dari jumlah jawaban benar.",
  },
  {
    value: "FORCED_CHOICE_PAIR",
    label: "Pasangan pernyataan (MBTI)",
    description:
      "Tiap soal berisi dua pernyataan; peserta memilih satu. Tiap pernyataan mewakili satu kutub dimensi, dan tipe akhirnya disusun dari kutub yang menang.",
  },
  {
    value: "FORCED_CHOICE_DISC",
    label: "DISC (4 kata)",
    description:
      "Tiap soal berisi 4 kata; peserta memilih satu yang paling sesuai (Most) dan satu yang paling tidak sesuai (Least).",
  },
  {
    value: "SCALE_TALLY",
    label: "Skala minat (Ya/Tidak)",
    description:
      "Tiap pernyataan dijawab Ya atau Tidak dan menambah skor satu skala. Hasilnya peringkat skala; kode diambil dari tiga skala terkuat.",
  },
  {
    value: "CHOICE_TALLY",
    label: "Pilihan ganda berskala",
    description:
      "Tiap soal punya beberapa opsi dan setiap opsi menambah skor satu skala — tidak ada jawaban benar atau salah. Skala yang paling dominan menjadi hasil.",
  },
] as const;

export const DEFAULT_SCORER_BY_CATEGORY: Record<TestCategory, ScorerType> = {
  COGNITIVE: "RIGHT_WRONG_NORM",
  PERSONALITY: "FORCED_CHOICE_DISC",
  WORK_STYLE: "FORCED_CHOICE_DISC",
  INTEREST: "SCALE_TALLY",
  PROJECTIVE: "FORCED_CHOICE_DISC",
};

export function scorerOption(type: ScorerType): ScorerOption {
  return SCORER_OPTIONS.find((option) => option.value === type) ?? SCORER_OPTIONS[0];
}
