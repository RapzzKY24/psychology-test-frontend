import { z } from "zod";
import { SCORER_TYPES, TEST_CATEGORIES } from "@/lib/api/types";

/** Mirrors the backend CreateTestSchema (verified: name 3–100, slug regex, description ≥10). */
export const CreateTestSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan tanda hubung."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  category: z.enum(TEST_CATEGORIES),
  scorerType: z.enum(SCORER_TYPES),
  price: z.number().int().min(0, "Harga tidak boleh negatif."),
  estimatedDurationMin: z.number().int().min(1, "Durasi minimal 1 menit."),
});

/**
 * The settings tab edits the same fields. The backend refuses a scorer change
 * once the test has items or is published, so the UI only enables it there.
 */
export const TestSettingsSchema = CreateTestSchema.extend({
  /** 0 = untimed; the API wants `null`, so the modal converts on submit. */
  timeLimitMin: z.number().int().min(0).max(240),
});

export type TestSettingsInput = z.infer<typeof TestSettingsSchema>;

export type CreateTestInput = z.infer<typeof CreateTestSchema>;

export const DiscItemContentSchema = z.object({
  words: z.array(z.string().trim().min(1, "Kata wajib diisi.")).length(4),
  mostMapping: z.array(z.enum(["D", "I", "S", "C", "*"])).length(4),
  leastMapping: z.array(z.enum(["D", "I", "S", "C", "*"])).length(4),
});

export type DiscItemContentInput = z.infer<typeof DiscItemContentSchema>;

/** One pole of a dichotomy — MBTI uses single letters (E/I), other tools may use short codes. */
const PoleSchema = z
  .string()
  .trim()
  .min(1, "Kode kutub wajib diisi.")
  .max(3, "Kode kutub maksimal 3 huruf.")
  .regex(/^[A-Za-z]+$/, "Kode kutub hanya huruf.")
  .transform((value) => value.toUpperCase());

/**
 * Two statements, one pick. `mapping` is the key: it says which pole each
 * statement scores, and it must never be shown to the participant.
 */
export const PairItemContentSchema = z
  .object({
    question: z.string().trim().min(1, "Pertanyaan wajib diisi.").max(2000),
    statements: z
      .array(z.string().trim().min(1, "Pernyataan wajib diisi.").max(500))
      .length(2),
    mapping: z.array(PoleSchema).length(2),
  })
  .superRefine((data, ctx) => {
    if (data.mapping[0] === data.mapping[1]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dua pernyataan harus mewakili kutub berbeda.",
        path: ["mapping", 1],
      });
    }
    if (data.statements[0].toLowerCase() === data.statements[1].toLowerCase()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dua pernyataan tidak boleh sama.",
        path: ["statements", 1],
      });
    }
  });

export type PairItemContentInput = z.infer<typeof PairItemContentSchema>;

/** One scale of a tally instrument — RIASEC uses R/I/A/S/E/C. */
const ScaleCodeSchema = z
  .string()
  .trim()
  .min(1, "Kode skala wajib diisi.")
  .max(4, "Kode skala maksimal 4 huruf.")
  .regex(/^[A-Za-z]+$/, "Kode skala hanya huruf.")
  .transform((value) => value.toUpperCase());

/**
 * A statement with two labels and the scale a "Ya" feeds. `scale` is the key
 * and is never shown to the participant.
 */
export const ScaleTallyItemContentSchema = z.object({
  question: z.string().trim().min(1, "Pernyataan wajib diisi.").max(2000),
  options: z.array(z.string().trim().min(1, "Label wajib diisi.").max(200)).length(2),
  scale: ScaleCodeSchema,
});

export type ScaleTallyItemContentInput = z.infer<typeof ScaleTallyItemContentSchema>;

/**
 * Pick one option; every option feeds a scale. `mapping` lines up with
 * `options` and is the key, so it never reaches the participant.
 */
export const ChoiceTallyItemContentSchema = z
  .object({
    question: z.string().trim().min(1, "Pertanyaan wajib diisi.").max(2000),
    options: z.array(z.string().trim().min(1, "Opsi wajib diisi.").max(500)).min(2).max(8),
    mapping: z.array(ScaleCodeSchema).min(2).max(8),
  })
  .superRefine((data, ctx) => {
    if (data.mapping.length !== data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tiap opsi harus punya satu kode skala.",
        path: ["mapping"],
      });
    }
  });

export type ChoiceTallyItemContentInput = z.infer<typeof ChoiceTallyItemContentSchema>;

/** A Likert scale code is longer than a tally's — Big Five may spell the trait out. */
const LongScaleCodeSchema = z
  .string()
  .trim()
  .min(1, "Kode skala wajib diisi.")
  .max(12, "Kode skala maksimal 12 huruf.")
  .regex(/^[A-Za-z][A-Za-z0-9]*$/, "Kode skala diawali huruf, lalu huruf atau angka.")
  .transform((value) => value.toUpperCase());

/**
 * One statement rated on a numeric scale. `scale` and `reverse` are the key:
 * they say which scale the rating feeds and whether it is flipped.
 * `section` marks which part of a multi-section inventory the item belongs to
 * (MSAI); it is carried through edits, not typed by hand.
 */
export const LikertItemContentSchema = z.object({
  text: z.string().trim().min(1, "Pernyataan wajib diisi.").max(2000),
  scale: LongScaleCodeSchema,
  reverse: z.boolean().optional(),
  section: z
    .string()
    .trim()
    .toUpperCase()
    .min(1)
    .max(20)
    .regex(/^[A-Z][A-Z0-9]*$/, "Kode bagian diawali huruf, lalu huruf atau angka.")
    .optional(),
});

export type LikertItemContentInput = z.infer<typeof LikertItemContentSchema>;

/**
 * One interest field of a ranking instrument — RMIB spells them OUT, ME, S.S.
 * The dot is allowed because the workbook keeps it in "s.s" (social service).
 */
const RankFieldCodeSchema = z
  .string()
  .trim()
  .min(1, "Kode bidang wajib diisi.")
  .max(6, "Kode bidang maksimal 6 karakter.")
  .regex(/^[A-Za-z][A-Za-z.]*$/, "Kode bidang diawali huruf.")
  .transform((value) => value.toUpperCase());

/**
 * A group the participant orders from 1..N. `mapping` lines up with `options`
 * and is the key. `femaleOptions` is the same group worded for female
 * respondents (RMIB prints two lists); it is optional and, when present, must
 * stay the same length because the mapping is positional.
 */
export const RankGroupItemContentSchema = z
  .object({
    question: z.string().trim().min(1, "Nama kelompok wajib diisi.").max(2000),
    options: z
      .array(z.string().trim().min(1, "Pekerjaan wajib diisi.").max(120))
      .min(2, "Minimal 2 pekerjaan.")
      .max(12, "Maksimal 12 pekerjaan."),
    femaleOptions: z
      .array(z.string().trim().min(1, "Pekerjaan wajib diisi.").max(120))
      .min(2, "Minimal 2 pekerjaan.")
      .max(12, "Maksimal 12 pekerjaan.")
      .optional(),
    mapping: z
      .array(RankFieldCodeSchema)
      .min(2, "Minimal 2 bidang.")
      .max(12, "Maksimal 12 bidang."),
  })
  .superRefine((data, ctx) => {
    if (data.mapping.length !== data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tiap pekerjaan harus punya satu kode bidang.",
        path: ["mapping"],
      });
    }
    if (data.femaleOptions && data.femaleOptions.length !== data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Daftar perempuan harus sama panjang dengan daftar laki-laki.",
        path: ["femaleOptions"],
      });
    }
  });

export type RankGroupItemContentInput = z.infer<typeof RankGroupItemContentSchema>;

/**
 * One list of activities the participant marks `+` (likes) or `-` (does not).
 * `mapping` lines up with `options` and lists every field an activity scores —
 * Kuder loads one activity on two or three fields, and a few on none at all.
 * `verification` names the positions the validity scale counts. Both are keys
 * and never reach the participant.
 */
export const MarkGroupItemContentSchema = z
  .object({
    question: z.string().trim().min(1, "Nama kelompok wajib diisi.").max(2000),
    options: z
      .array(z.string().trim().min(1, "Aktivitas wajib diisi.").max(200))
      .min(2, "Minimal 2 aktivitas.")
      .max(42, "Maksimal 42 aktivitas."),
    mapping: z.array(z.array(RankFieldCodeSchema).max(6)).min(2).max(42),
    verification: z.array(z.number().int().min(0)).max(42).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mapping.length !== data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tiap aktivitas harus punya daftar bidang (boleh kosong).",
        path: ["mapping"],
      });
    }
    if (data.verification?.some((index) => index >= data.options.length)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Penanda validitas harus menunjuk baris yang ada.",
        path: ["verification"],
      });
    }
  });

export type MarkGroupItemContentInput = z.infer<typeof MarkGroupItemContentSchema>;

const itemBase = {
  question: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().max(2048).optional().nullable(),
  subtest: z.string().trim().max(100).optional(),
};

/** Radio (one key) or checkbox (several keys) — same field, different length. */
export const RightWrongChoiceContentSchema = z.object({
  answerMode: z.literal("choice"),
  ...itemBase,
  options: z.array(z.string().trim().min(1, "Opsi wajib diisi.").max(500)).min(2).max(8),
  correctIndexes: z.array(z.number().int().min(0)).min(1, "Tandai minimal satu kunci."),
});

/** Typed answer matched against every listed variant. */
export const RightWrongShortContentSchema = z.object({
  answerMode: z.literal("short"),
  ...itemBase,
  accepted: z
    .array(z.string().trim().min(1, "Jawaban wajib diisi.").max(100))
    .min(1, "Isi minimal satu jawaban benar."),
});

export const RightWrongItemContentSchema = z
  .discriminatedUnion("answerMode", [RightWrongChoiceContentSchema, RightWrongShortContentSchema])
  .superRefine((data, ctx) => {
    const hasQuestion = Boolean(data.question && data.question.trim().length > 0);
    const hasImage = Boolean(data.imageUrl && data.imageUrl.trim().length > 0);
    if (!hasQuestion && !hasImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pertanyaan atau gambar wajib diisi.",
        path: ["question"],
      });
    }
    if (data.imageUrl && !/^\/uploads\/test-items\/[a-f0-9-]+\.(png|jpg)$/.test(data.imageUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gambar harus dari upload.",
        path: ["imageUrl"],
      });
    }
    if (data.answerMode === "choice" && data.correctIndexes.some((i) => i >= data.options.length)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kunci harus salah satu opsi.",
        path: ["correctIndexes"],
      });
    }
  });

export type RightWrongItemContentInput = z.infer<typeof RightWrongItemContentSchema>;

/**
 * Server rows can predate `answerMode` (they only carry `correctIndex`). The
 * form needs one concrete shape, so legacy rows are lifted on load and never
 * written back in the old form.
 */
/** Server rows are trusted to match the schema; the form only needs a concrete shape. */
export function normalizePairContent(content: unknown): PairItemContentInput {
  const raw = (content ?? {}) as {
    question?: string;
    statements?: string[];
    mapping?: string[];
  };
  return {
    question: raw.question ?? "",
    statements: [raw.statements?.[0] ?? "", raw.statements?.[1] ?? ""],
    mapping: [
      (raw.mapping?.[0] ?? "").toUpperCase(),
      (raw.mapping?.[1] ?? "").toUpperCase(),
    ],
  };
}

/** A tally item always has two labels; the default pair is the printed one. */
export function normalizeScaleTallyContent(content: unknown): ScaleTallyItemContentInput {
  const raw = (content ?? {}) as {
    question?: string;
    options?: string[];
    scale?: string;
  };
  const options = raw.options?.length === 2 ? raw.options : [];
  return {
    question: raw.question ?? "",
    options: [options[0] ?? "Ya", options[1] ?? "Tidak"],
    scale: (raw.scale ?? "").toUpperCase(),
  };
}

/** Options and their scales are kept the same length so the form stays valid. */export function normalizeChoiceTallyContent(content: unknown): ChoiceTallyItemContentInput {
  const raw = (content ?? {}) as {
    question?: string;
    options?: string[];
    mapping?: string[];
  };
  const options = raw.options?.length ? raw.options : ["", ""];
  const mapping = raw.mapping ?? [];
  return {
    question: raw.question ?? "",
    options,
    mapping: options.map((_, index) => (mapping[index] ?? "").toUpperCase()),
  };
}

/** A Likert row always has a statement, a scale and a reverse flag (default off). */
export function normalizeLikertContent(content: unknown): LikertItemContentInput {
  const raw = (content ?? {}) as {
    text?: string;
    scale?: string;
    reverse?: boolean;
    section?: string;
  };
  const section = (raw.section ?? "").toUpperCase();
  return {
    text: raw.text ?? "",
    scale: (raw.scale ?? "").toUpperCase(),
    reverse: raw.reverse === true,
    // Preserved, not edited: dropping it here would silently move every MSAI
    // item out of its section the first time an admin saves the test.
    ...(section ? { section } : {}),
  };
}

/** A rank group always keeps `options` and `mapping` the same length. */
export function normalizeRankGroupContent(content: unknown): RankGroupItemContentInput {
  const raw = (content ?? {}) as {
    question?: string;
    options?: string[];
    femaleOptions?: string[];
    mapping?: string[];
  };
  const options = raw.options?.length ? raw.options : ["", ""];
  const mapping = raw.mapping ?? [];
  const female = raw.femaleOptions ?? [];
  const femaleFilled = female.some((option) => option.trim().length > 0);
  return {
    question: raw.question ?? "",
    options,
    // Dropped when the group has no female variant, so the saved content keeps
    // the backend's "same length as options" rule instead of a list of blanks.
    ...(femaleFilled
      ? {
          femaleOptions: options.map((_, index) => female[index] ?? ""),
        }
      : {}),
    mapping: options.map((_, index) => (mapping[index] ?? "").toUpperCase()),
  };
}

/** A marked list keeps `options`, `mapping` and `verification` in step. */
export function normalizeMarkGroupContent(content: unknown): MarkGroupItemContentInput {
  const raw = (content ?? {}) as {
    question?: string;
    options?: string[];
    mapping?: string[][];
    verification?: number[];
  };
  const options = raw.options?.length ? raw.options : ["", ""];
  const mapping = raw.mapping ?? [];
  // A verification flag on a row that no longer exists would fail the schema on
  // save, so only live indexes survive an edit.
  const verification = (raw.verification ?? []).filter(
    (index) => Number.isInteger(index) && index >= 0 && index < options.length,
  );
  return {
    question: raw.question ?? "",
    options,
    mapping: options.map((_, index) => (mapping[index] ?? []).map((code) => code.toUpperCase())),
    ...(verification.length ? { verification } : {}),
  };
}

export function normalizeItemContent(content: unknown): RightWrongItemContentInput {
  const raw = (content ?? {}) as {
    answerMode?: "choice" | "short";
    question?: string;
    imageUrl?: string | null;
    subtest?: string;
    options?: string[];
    correctIndexes?: number[];
    correctIndex?: number;
    accepted?: string[];
  };
  const shared = {
    question: raw.question ?? "",
    imageUrl: raw.imageUrl ?? null,
    ...(raw.subtest ? { subtest: raw.subtest } : {}),
  };
  if (raw.answerMode === "short") {
    return {
      answerMode: "short",
      ...shared,
      accepted: raw.accepted?.length ? raw.accepted : [""],
    };
  }
  const keys = raw.correctIndexes ?? (raw.correctIndex !== undefined ? [raw.correctIndex] : [0]);
  return {
    answerMode: "choice",
    ...shared,
    options: raw.options?.length ? raw.options : ["", ""],
    correctIndexes: keys,
  };
}

/** "DISC Form A" → "disc-form-a" (mirrors the backend slug regex). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
