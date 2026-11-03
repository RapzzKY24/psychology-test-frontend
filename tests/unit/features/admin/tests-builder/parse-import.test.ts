import { describe, expect, it } from "vitest";
import { parseRightWrongImport } from "@/features/admin/tests-builder/parse-import";

describe("parseRightWrongImport", () => {
  it("turns one line into one item", () => {
    const { items, errors } = parseRightWrongImport("2 + 3 = ? | 4 | 5 | 6 | 7 | B");

    expect(errors).toEqual([]);
    expect(items).toEqual([
      { question: "2 + 3 = ?", options: ["4", "5", "6", "7"], correctIndex: 1 },
    ]);
  });

  it("accepts the option text as the key", () => {
    const { items } = parseRightWrongImport("Lawan kata besar | Kecil | Luas | Kecil");

    expect(items[0].correctIndex).toBe(0);
  });

  it("skips blank lines and keeps the rest", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | 2 | A\n\n   \nB? | 1 | 2 | B");

    expect(errors).toEqual([]);
    expect(items).toHaveLength(2);
  });

  it("rejects a line without enough fields", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | A");

    expect(items).toEqual([]);
    expect(errors).toEqual(["Baris 1: butuh pertanyaan, minimal 2 opsi, dan kunci."]);
  });

  it("rejects an empty option", () => {
    const { errors } = parseRightWrongImport("A? | 1 |  | A");

    expect(errors).toEqual(["Baris 1: ada opsi yang kosong."]);
  });

  it("rejects a key that matches no option", () => {
    const { errors } = parseRightWrongImport("A? | 1 | 2 | D");

    expect(errors).toEqual(['Baris 1: kunci "D" tidak cocok dengan opsi mana pun.']);
  });

  it("rejects more than six options", () => {
    const { errors } = parseRightWrongImport("A? | 1 | 2 | 3 | 4 | 5 | 6 | 7 | A");

    expect(errors).toEqual(["Baris 1: maksimal 6 opsi."]);
  });

  it("keeps parsing the other lines while reporting the broken one", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | 2 | A\nrusak\nB? | 1 | 2 | B");

    expect(items).toHaveLength(2);
    expect(errors).toEqual(["Baris 2: butuh pertanyaan, minimal 2 opsi, dan kunci."]);
  });
});
