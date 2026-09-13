import { z } from "zod";

/**
 * Public-safe session preview (`GET /api/v1/public/sessions/:token`,
 * PublicSessionPreviewSchema on the backend). No PIN material, no PII.
 */
export interface RosterSeat {
  id: string;
  name: string;
  candidateNumber: string | null;
  claimed: boolean;
}

export interface SessionPreview {
  title: string;
  status: "ACTIVE" | "CLOSED";
  expiresAt: string;
  tests: Array<{ order: number; testName: string }>;
  slotLimit: number;
  slotsUsed: number;
  requiresPin: boolean;
  joinMode: "OPEN" | "ROSTER";
  roster?: RosterSeat[];
}

/** Mirrors the backend JoinSessionSchema (strict). */
export const JoinFormSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi.").max(200),
    email: z.email("Format email tidak valid.").optional().or(z.literal("")),
    candidateNumber: z.string().trim().max(50).optional().or(z.literal("")),
    pin: z
      .string()
      .regex(/^[0-9]*$/, "PIN hanya angka.")
      .min(4, "PIN 4–8 angka.")
      .max(8, "PIN 4–8 angka.")
      .optional()
      .or(z.literal("")),
  })
  .transform((values) => ({
    ...values,
    email: values.email || undefined,
    candidateNumber: values.candidateNumber || undefined,
    pin: values.pin || undefined,
  }));

export type JoinFormInput = z.input<typeof JoinFormSchema>;
export type JoinSessionPayload = z.output<typeof JoinFormSchema>;

/** Alias for the backend PublicSessionPreviewDto — the FE mirror of the preview payload. */
export type PublicSessionPreviewDto = SessionPreview;

/** Alias matching the backend join payload field name convention. */
export type JoinSessionInput = JoinSessionPayload;
