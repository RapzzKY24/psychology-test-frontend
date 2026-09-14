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

/** Settings tab edits everything except the scorer type. */
export const TestSettingsSchema = CreateTestSchema.omit({ scorerType: true });

export type TestSettingsInput = z.infer<typeof TestSettingsSchema>;

export type CreateTestInput = z.infer<typeof CreateTestSchema>;

export const DiscItemContentSchema = z.object({
  words: z.array(z.string().trim().min(1, "Kata wajib diisi.")).length(4),
  mostMapping: z.array(z.enum(["D", "I", "S", "C", "*"])).length(4),
  leastMapping: z.array(z.enum(["D", "I", "S", "C", "*"])).length(4),
});

export type DiscItemContentInput = z.infer<typeof DiscItemContentSchema>;

export const RightWrongItemContentSchema = z
  .object({
    question: z.string().trim().max(2000).optional(),
    imageUrl: z.string().trim().max(2048).optional().nullable(),
    options: z.array(z.string().trim().min(1, "Opsi wajib diisi.").max(500)).min(2).max(6),
    correctIndex: z.number().int().min(0),
    subtest: z.string().trim().max(100).optional(),
  })
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
    if (data.correctIndex >= data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kunci harus salah satu opsi.",
        path: ["correctIndex"],
      });
    }
    if (data.imageUrl && !/^\/uploads\/test-items\/[a-f0-9-]+\.(png|jpg)$/.test(data.imageUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gambar harus dari upload.",
        path: ["imageUrl"],
      });
    }
  });

export type RightWrongItemContentInput = z.infer<typeof RightWrongItemContentSchema>;

/** "DISC Form A" → "disc-form-a" (mirrors the backend slug regex). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
