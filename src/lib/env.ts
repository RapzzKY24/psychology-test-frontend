import { z } from "zod";

/**
 * Runtime-validated env (fail fast on boot, not mid-page).
 * NEXT_PUBLIC_* vars are inlined by the compiler — this validates what actually
 * reached the bundle.
 */
const envSchema = z.object({
  API_INTERNAL_URL: z.url().default("http://localhost:4000"),
  NEXT_PUBLIC_FEATURE_REPORTS: z.enum(["true", "false"]).default("false"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
  );
}

export const env = parsed.data;

/** Feature 08 (PDF/email) is not implemented server-side yet (ADR-010.6). */
export const featureReportsEnabled = env.NEXT_PUBLIC_FEATURE_REPORTS === "true";
