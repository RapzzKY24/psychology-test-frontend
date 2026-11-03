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

const itemBase = {
  question: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().max(2048).optional().nullable(),
  subtest: z.string().trim().max(100).optional(),
};

/** Radio (one key) or checkbox (several keys) — same field, different length. */
export const RightWrongChoiceContentSchema = z.object({
  answerMode: z.literal("choice"),
  ...itemBase,
  options: z.array(z.string().trim().min(1, "Opsi wajib diisi.").max(500)).min(2).max(6),
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
