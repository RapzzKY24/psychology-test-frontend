// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ManualDetailGrid } from "@/features/psikolog/review/components/manual-detail-grid";

afterEach(cleanup);

const ITEMS = [
  { id: "item-1", order: 1, content: { box: 1, mark: "DOT" } },
  { id: "item-2", order: 2, content: { box: 2, mark: "CURVE" } },
];

describe("ManualDetailGrid", () => {
  it("shows a saved drawing in its own box", () => {
    render(
      <ManualDetailGrid
        items={ITEMS}
        responses={[
          {
            itemId: "item-1",
            value: { imageUrl: "/api/v1/public/attempts/a/items/item-1/image" },
          },
        ]}
      />,
    );

    expect(screen.getByAltText("Gambar kotak 1")).toBeTruthy();
    expect(screen.getByText("1 dari 2 kotak digambar")).toBeTruthy();
  });

  it("marks a box that was left blank instead of hiding it", () => {
    render(<ManualDetailGrid items={ITEMS} responses={[]} />);

    expect(screen.getByText("0 dari 2 kotak digambar")).toBeTruthy();
    expect(screen.getAllByText("Tidak digambar")).toHaveLength(2);
  });

  it("names the printed mark under each box", () => {
    render(<ManualDetailGrid items={ITEMS} responses={[]} />);

    expect(screen.getByText("Kotak 1")).toBeTruthy();
    expect(screen.getByText("Satu titik")).toBeTruthy();
    expect(screen.getByText("Garis bergelombang pendek")).toBeTruthy();
  });
});
