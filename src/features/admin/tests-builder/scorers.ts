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
    value: "PAIR_TALLY",
    label: "Pasangan pernyataan berskala (PAPI)",
    description:
      "Tiap soal berisi dua pernyataan; peserta memilih satu. Tiap pernyataan menambah skor satu kebutuhan, dan kebutuhan yang paling sering dipilih menjadi hasil.",
  },
  {
    value: "PAIR_NORM",
    label: "Pasangan pernyataan bernorma (EPPS)",
    description:
      "Tiap soal berisi dua pernyataan; peserta memilih satu. Tiap pilihan menambah skor satu kebutuhan, lalu skor tiap kebutuhan dibaca sebagai persentil dari norma sesuai jenis kelamin. Butir yang kedua pernyataannya menunjuk kebutuhan yang sama tidak dinilai, dan jawaban pada butir berulang dipakai untuk menilai konsistensi.",
  },
  {
    value: "STYLE_GRID",
    label: "Pasangan pernyataan bergaya (MSDT)",
    description:
      "Tiap soal berisi dua pernyataan; peserta memilih satu. Tiap pernyataan menambah skor satu gaya, gaya-gaya itu dijumlahkan menjadi beberapa dimensi, tiap dimensi dikonversi ke tingkat, dan pola tingkatnya menentukan gaya kepemimpinan.",
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
  {
    value: "MARK_GROUP",
    label: "Tanda suka / tidak suka per aktivitas (KUDER)",
    description:
      "Tiap soal berisi satu daftar aktivitas; peserta menandai + bila menyukainya dan − bila tidak. Tiap tanda menambah atau mengurangi skor bidang minat yang dimuat aktivitas itu, lalu skor dibaca sebagai persentil dari norma sesuai jenis kelamin.",
  },
  {
    value: "RANK_GROUP",
    label: "Peringkat dalam kelompok (RMIB)",
    description:
      "Tiap soal berisi satu daftar pekerjaan; peserta mengurutkannya dari yang paling disukai sampai yang paling tidak disukai. Tiap posisi menambah skor satu bidang minat, dan bidang dengan skor terkuat menjadi hasil.",
  },
  {
    value: "LIKERT",
    label: "Skala penilaian (Likert)",
    description:
      "Tiap pernyataan dinilai pada skala angka (mis. 1–5). Skor tiap trait adalah jumlah nilai, dan trait dengan persentase tertinggi menjadi hasil — bisa diberi kategori Rendah/Sedang/Tinggi.",
  },
  {
    value: "OPTION_SCALE",
    label: "Tiga pilihan berskala (16PF)",
    description:
      "Tiap pernyataan punya tiga pilihan jawaban (a/b/c). Tiap pilihan menambah skor satu faktor, lalu skor faktor dibaca sebagai sten dari tabel norma sesuai jenis kelamin dan jenjang pendidikan.",
  },
  {
    value: "TIMED_GRID",
    label: "Kisi angka berwaktu (Pauli/Kraepelin)",
    description:
      "Tiap soal adalah satu lajur berisi deretan angka; peserta menulis angka terakhir dari penjumlahan dua angka bersebelahan, secepat mungkin sampai waktu habis. Jawaban benar per lajur membentuk kurva kerja, dan kurva itu dibaca sebagai faktor kecepatan, ketelitian, ketahanan dan keajegan.",
  },
  {
    value: "MANUAL",
    label: "Gambar proyektif (Wartegg)",
    description:
      "Tiap kotak sudah berisi satu goresan kecil; peserta melengkapinya menjadi satu gambar. Tidak ada skor otomatis — gambarnya dibaca psikolog, jadi hasilnya hanya bisa disimpulkan pada sesi konsultasi.",
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
