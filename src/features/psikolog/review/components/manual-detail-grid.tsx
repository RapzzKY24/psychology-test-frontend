import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ManualMark } from "@/lib/api/types";
import { MANUAL_MARK_LABELS } from "@/lib/manual-marks";

interface ManualDetailGridProps {
  items: Array<{ id: string; order: number; content: Record<string, unknown> }>;
  responses: Array<{ itemId: string; value: unknown }>;
}

/**
 * The eight drawings, laid out in the sheet's own order. The picture is the
 * answer, so there is nothing to compare against a key — the psychologist
 * reads the boxes, and this only puts them side by side.
 *
 * The image comes from the attempt-scoped route, not from a static mount, so
 * the browser has to send the session cookie: a plain `<img>` does that, an
 * optimiser would not.
 */
export function ManualDetailGrid({ items, responses }: ManualDetailGridProps) {
  // Shape of ManualResponseSchema — the path the upload route returned.
  const drawn = new Map(
    responses.map((response) => {
      const value = response.value as { imageUrl?: unknown } | undefined;
      const url = typeof value?.imageUrl === "string" ? value.imageUrl : null;
      return [response.itemId, url];
    }),
  );
  const boxes = [...items].sort((a, b) => a.order - b.order);
  const filled = boxes.filter((item) => drawn.get(item.id)).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gambar per kotak</CardTitle>
        <p className="text-sm text-muted-foreground">
          {filled} dari {boxes.length} kotak digambar
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {boxes.map((item) => {
            const url = drawn.get(item.id);
            const box = typeof item.content.box === "number" ? item.content.box : item.order;
            const mark = item.content.mark as ManualMark | undefined;

            return (
              <figure key={item.id} className="space-y-2">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-white">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- the route needs the session cookie
                    <img
                      src={url}
                      alt={`Gambar kotak ${box}`}
                      className="size-full object-contain"
                    />
                  ) : (
                    <span className="px-3 text-center text-xs text-muted-foreground">
                      Tidak digambar
                    </span>
                  )}
                </div>
                <figcaption className="space-y-0.5">
                  <p className="text-sm font-medium">Kotak {box}</p>
                  <p className="text-xs text-muted-foreground">
                    {mark ? MANUAL_MARK_LABELS[mark] : "—"}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
