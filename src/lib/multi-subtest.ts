import { z } from "zod";

/**
 * The subtest split of a battery lives in the seed's scoring config and nowhere
 * else. Both the admin builder (which shows the items) and the review screen
 * (which groups the answers) need to read it, so the reader sits here instead
 * of inside either feature.
 */
export const MultiSubtestSectionSchema = z.object({
  code: z.string(),
  name: z.string(),
  kind: z.string(),
  itemCount: z.number().int(),
  timeLimitMin: z.number().int(),
  memorizeMin: z.number().int().optional(),
  instruction: z.string(),
});

export type MultiSubtestSection = z.infer<typeof MultiSubtestSectionSchema>;

const MultiSubtestConfigSchema = z.object({
  subtests: z.array(MultiSubtestSectionSchema).min(1),
});

/** The subtests a battery's config declares, or none if it is unreadable. */
export function multiSubtestSections(scoringConfig: unknown): MultiSubtestSection[] {
  const parsed = MultiSubtestConfigSchema.safeParse(scoringConfig);
  return parsed.success ? parsed.data.subtests : [];
}

export interface SubtestRange {
  section: MultiSubtestSection;
  /** Printed item numbers, both inclusive. */
  from: number;
  to: number;
}

/** Each subtest beside the printed item numbers it owns, in printed order. */
export function subtestRanges(scoringConfig: unknown): SubtestRange[] {
  let cursor = 1;
  return multiSubtestSections(scoringConfig).map((section) => {
    const from = cursor;
    cursor += section.itemCount;
    return { section, from, to: cursor - 1 };
  });
}
