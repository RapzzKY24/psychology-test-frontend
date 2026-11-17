import { describe, expect, it } from "vitest";
import {
  FAQ_ITEMS,
  HELP_DELIVERABLE_COLUMNS,
  HELP_DELIVERABLE_ROWS,
  HELP_FAQ_GROUPS,
  HELP_FLOWS,
  HELP_GLOSSARY,
  LANDING_FAQ_IDS,
  TEST_FAQ_IDS,
  faqById,
} from "@/features/public/help-content";

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

describe("help flows", () => {
  it("gives every path a unique id and real steps", () => {
    expect(unique(HELP_FLOWS.map((flow) => flow.id))).toBe(true);
    for (const flow of HELP_FLOWS) {
      expect(flow.steps.length).toBeGreaterThan(0);
      for (const step of flow.steps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.body.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("FAQ", () => {
  it("has unique ids and non-empty answers", () => {
    expect(unique(FAQ_ITEMS.map((item) => item.id))).toBe(true);
    expect(unique(FAQ_ITEMS.map((item) => item.q))).toBe(true);
    for (const item of FAQ_ITEMS) {
      expect(item.q.trim().length).toBeGreaterThan(0);
      expect(item.a.trim().length).toBeGreaterThan(0);
    }
  });

  it("references every item from at least one group", () => {
    const referenced = new Set(HELP_FAQ_GROUPS.flatMap((group) => group.ids));
    for (const item of FAQ_ITEMS) {
      expect(referenced.has(item.id)).toBe(true);
    }
  });

  it("resolves the landing and test subsets", () => {
    for (const id of [...LANDING_FAQ_IDS, ...TEST_FAQ_IDS]) {
      expect(faqById(id).id).toBe(id);
    }
  });

  it("throws on an unknown id instead of rendering an empty row", () => {
    expect(() => faqById("does-not-exist")).toThrow();
  });
});

describe("deliverables table", () => {
  it("fills every column for every row", () => {
    for (const row of HELP_DELIVERABLE_ROWS) {
      for (const column of HELP_DELIVERABLE_COLUMNS) {
        expect(row.values[column.key].trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("glossary", () => {
  it("keeps each term unique", () => {
    expect(unique(HELP_GLOSSARY.map((entry) => entry.term))).toBe(true);
  });
});
