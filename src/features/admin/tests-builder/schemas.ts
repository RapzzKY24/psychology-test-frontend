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

/** "DISC Form A" → "disc-form-a" (mirrors the backend slug regex). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
