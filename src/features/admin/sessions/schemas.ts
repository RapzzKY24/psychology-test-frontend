import { z } from "zod";

/**
 * Mirrors the backend CreateSessionSchema (strict): testIds uuids unique
 * (refine), slotLimit 1–1000, expiresAt must be future, optional PIN 4–8
 * digits. expiresAt arrives as a datetime-local string, sent as ISO.
 */
export const CreateSessionSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200),
  institutionId: z.string().uuid().optional().or(z.literal("")),
  testIds: z
    .array(z.string().uuid())
    .min(1, "Pilih minimal satu tes.")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Tes tidak boleh duplikat.",
    }),
  slotLimit: z.number().int().min(1, "Slot minimal 1.").max(1000, "Slot maksimal 1000."),
  expiresAt: z
    .string()
    .min(1, "Waktu kedaluwarsa wajib diisi.")
    .refine((v) => new Date(v).getTime() > Date.now(), "Waktu kedaluwarsa harus di masa depan."),
  pin: z
    .string()
    .regex(/^[0-9]*$/, "PIN hanya angka.")
    .min(4, "PIN 4–8 angka.")
    .max(8, "PIN 4–8 angka.")
    .optional()
    .or(z.literal("")),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

/**
 * Admin edit form (partial): the dialog is prefilled with the current values,
 * so both fields are present; `buildSessionUpdatePayload` keeps only the ones
 * the admin actually changed. expiresAt arrives as a datetime-local string.
 */
export const UpdateSessionFormSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200),
  expiresAt: z
    .string()
    .min(1, "Waktu kedaluwarsa wajib diisi.")
    .refine((v) => new Date(v).getTime() > Date.now(), "Waktu kedaluwarsa harus di masa depan."),
});

export type UpdateSessionFormInput = z.infer<typeof UpdateSessionFormSchema>;

export interface SessionUpdatePayload {
  title?: string;
  expiresAt?: string;
}

/** ISO → `datetime-local` value in local time (what the browser input expects). */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Diffs the form against the session's current values and returns only the
 * changed fields (`expiresAt` as ISO). Returns null when nothing changed.
 */
export function buildSessionUpdatePayload(
  initial: { title: string; expiresAt: string },
  values: UpdateSessionFormInput,
): SessionUpdatePayload | null {
  const payload: SessionUpdatePayload = {};
  const title = values.title.trim();
  if (title !== initial.title) payload.title = title;
  // Compare at minute precision — the datetime-local input has no seconds, so
  // an untouched expiry must not look "changed" just because of its seconds.
  if (values.expiresAt !== toDatetimeLocalValue(initial.expiresAt)) {
    payload.expiresAt = new Date(values.expiresAt).toISOString();
  }
  return payload.title === undefined && payload.expiresAt === undefined ? null : payload;
}
