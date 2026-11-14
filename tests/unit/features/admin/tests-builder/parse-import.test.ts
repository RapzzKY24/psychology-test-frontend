import { describe, expect, it } from "vitest";
import { parseRightWrongImport } from "@/features/admin/tests-builder/parse-import";

describe("parseRightWrongImport", () => {
  it("turns one line into one choice item", () => {
    const { items, errors } = parseRightWrongImport("2 + 3 = ? | 4 | 5 | 6 | 7 | B");

    expect(errors).toEqual([]);
    expect(items).toEqual([
      {
        answerMode: "choice",
        question: "2 + 3 = ?",
        imageUrl: null,
        options: ["4", "5", "6", "7"],
        correctIndexes: [1],
      },
    ]);
  });

  it("accepts the option text as the key", () => {
    const { items } = parseRightWrongImport("Lawan kata besar | Kecil | Luas | Kecil");

    expect(items[0]).toMatchObject({ correctIndexes: [0] });
  });

  it("reads two columns as a short-answer item", () => {
    const { items, errors } = parseRightWrongImport("Berapa harga ½ lusin? | 20");

    expect(errors).toEqual([]);
    expect(items).toEqual([
      {
        answerMode: "short",
        question: "Berapa harga ½ lusin?",
        imageUrl: null,
        accepted: ["20"],
      },
    ]);
  });

  it("splits short-answer variants on semicolons", () => {
    const { items } = parseRightWrongImport("Angka selanjutnya | 0,0625; 1/16");

    expect(items[0]).toMatchObject({ accepted: ["0,0625", "1/16"] });
  });

  it("reads a multi key", () => {
    const { items } = parseRightWrongImport("Dua peribahasa | A | B | C | A,C");

    expect(items[0]).toMatchObject({ correctIndexes: [0, 2] });
  });

  it("reads a numeric key as a one-based option number", () => {
    const { items } = parseRightWrongImport("Bulan lalu | Januari | Maret | Juli | 3");

    expect(items[0]).toMatchObject({ correctIndexes: [2] });
  });

  it("skips blank lines and keeps the rest", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | 2 | A\n\n   \nB? | 1 | 2 | B");

    expect(errors).toEqual([]);
    expect(items).toHaveLength(2);
  });

  it("rejects a line without enough fields", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | A");

    expect(items).toEqual([]);
    expect(errors).toEqual([
      "Baris 1: butuh pertanyaan, minimal 2 opsi, dan kunci — atau 2 kolom untuk isian singkat.",
    ]);
  });

  it("rejects an empty option", () => {
    const { errors } = parseRightWrongImport("A? | 1 |  | A");

    expect(errors).toEqual(["Baris 1: ada opsi yang kosong."]);
  });

  it("rejects a key that matches no option", () => {
    const { errors } = parseRightWrongImport("A? | 1 | 2 | D");

    expect(errors).toEqual(['Baris 1: kunci "D" tidak cocok dengan opsi mana pun.']);
  });

  it("rejects more than eight options", () => {
    const { errors } = parseRightWrongImport(
      "A? | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A",
    );

    expect(errors).toEqual(["Baris 1: maksimal 8 opsi."]);
  });

  it("accepts the eight-option grid used by the Aptitude Test", () => {
    const { items, errors } = parseRightWrongImport(
      "A? | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | H",
    );

    expect(errors).toEqual([]);
    expect(items[0]).toMatchObject({
      options: ["1", "2", "3", "4", "5", "6", "7", "8"],
      correctIndexes: [7],
    });
  });

  it("keeps parsing the other lines while reporting the broken one", () => {
    const { items, errors } = parseRightWrongImport("A? | 1 | 2 | A\nrusak\nB? | 1 | 2 | B");

    expect(items).toHaveLength(2);
    expect(errors).toEqual([
      "Baris 2: butuh pertanyaan, minimal 2 opsi, dan kunci — atau 2 kolom untuk isian singkat.",
    ]);
  });
});
