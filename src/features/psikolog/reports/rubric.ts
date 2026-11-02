import type { RatingValue, Recommendation } from "@/lib/api/types";

/**
 * Mirror of `psychology-test-backend/src/modules/reports/rubric.ts`.
 * The keys are stored in the report JSON, so they must match the backend
 * exactly — renaming one here would save ratings under an unknown key and the
 * backend would reject the payload.
 */

/** Maximum length of one narrative block (same constant as the backend). */
export const NARRATIVE_MAX_LENGTH = 800;

export interface RatingAspect {
  key: string;
  label: string;
  description: string;
}

export interface RatingSection {
  id: string;
  label: string;
  aspects: RatingAspect[];
}

export const RATING_SECTIONS: RatingSection[] = [
  {
    id: "intellectual",
    label: "I. KEMAMPUAN INTELEKTUAL",
    aspects: [
      {
        key: "intellectual.logic",
        label: "Logika Berpikir",
        description: "Kemampuan untuk berpikir secara logis dan sistematis.",
      },
      {
        key: "intellectual.analysis",
        label: "Daya Analisis",
        description:
          "Kemampuan untuk melihat permasalahan dan memahami hubungan sebab akibat permasalahan.",
      },
      {
        key: "intellectual.numeric",
        label: "Kemampuan Numerikal",
        description: "Kemampuan untuk berpikir praktis dalam memahami konsep angka dan hitungan.",
      },
      {
        key: "intellectual.verbal",
        label: "Kemampuan Verbal",
        description:
          "Kemampuan untuk memahami konsep dan pola dalam bentuk kata-kata dan mengekspresikan gagasan secara verbal.",
      },
    ],
  },
  {
    id: "attitude",
    label: "II. SIKAP DAN CARA KERJA",
    aspects: [
      {
        key: "attitude.result",
        label: "Orientasi Hasil",
        description:
          "Kemampuan untuk mempertahankan komitmen menyelesaikan tugas secara bertanggungjawab dan memperhatikan keterhubungan antara perencanaan dan hasil kerja.",
      },
      {
        key: "attitude.flexibility",
        label: "Fleksibilitas",
        description: "Kemampuan untuk menyesuaikan diri dalam menghadapi permasalahan.",
      },
      {
        key: "attitude.systematic",
        label: "Sistematika Kerja",
        description:
          "Kemampuan untuk merencanakan hingga mengorganisasikan cara kerja dalam proses penyelesaian pekerjaan.",
      },
    ],
  },
  {
    id: "personality",
    label: "III. KEPRIBADIAN",
    aspects: [
      {
        key: "personality.motivation",
        label: "Motivasi",
        description: "Kemampuan untuk menunjukkan prestasi dan mencapai target.",
      },
      {
        key: "personality.cooperation",
        label: "Kerjasama",
        description:
          "Kemampuan untuk menjalin, membina dan mengoptimalkan hubungan kerja yang efektif demi tercapainya tujuan bersama.",
      },
      {
        key: "personality.interpersonal",
        label: "Keterampilan Interpersonal",
        description:
          "Kemampuan untuk menjalin hubungan sosial dan mampu memahami kebutuhan orang lain.",
      },
      {
        key: "personality.emotion",
        label: "Stabilitas Emosi",
        description: "Kemampuan untuk memahami dan mengontrol emosi.",
      },
    ],
  },
  {
    id: "learning",
    label: "IV. KEMAMPUAN BELAJAR",
    aspects: [
      {
        key: "learning.change",
        label: "Mengelola Perubahan",
        description: "Kemampuan dalam menyesuaikan diri dengan situasi yang baru.",
      },
      {
        key: "learning.development",
        label: "Pengembangan Diri",
        description: "Kemampuan meningkatkan pengetahuan dan penyempurnaan keterampilan diri.",
      },
    ],
  },
];

export interface NarrativeField {
  key: string;
  label: string;
  page: 2 | 3 | 4;
}

export const NARRATIVE_FIELDS: NarrativeField[] = [
  { key: "conclusion.intellectual", label: "Kesimpulan I", page: 2 },
  { key: "conclusion.attitude", label: "Kesimpulan II", page: 3 },
  { key: "conclusion.personality", label: "Kesimpulan III", page: 3 },
  { key: "conclusion.learning", label: "Kesimpulan IV", page: 4 },
  { key: "development", label: "Saran Pengembangan", page: 4 },
  { key: "overall", label: "Kesimpulan Umum", page: 4 },
];

export const RATING_VALUES: RatingValue[] = ["R", "K", "C", "B", "T"];

export const RATING_LABELS: Record<RatingValue, string> = {
  R: "Rendah",
  K: "Kurang",
  C: "Cukup",
  B: "Baik",
  T: "Tinggi",
};

export const RECOMMENDATION_VALUES: Recommendation[] = ["LAYAK", "BELUM_LAYAK", "TIDAK_LAYAK"];

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  LAYAK: "Layak",
  BELUM_LAYAK: "Belum Layak",
  TIDAK_LAYAK: "Tidak Layak",
};

/** 13 rating keys + 6 narrative keys = the 19 fields the backend validates. */
export const RATING_KEYS: string[] = RATING_SECTIONS.flatMap((section) =>
  section.aspects.map((aspect) => aspect.key),
);

export const NARRATIVE_KEYS: string[] = NARRATIVE_FIELDS.map((field) => field.key);
