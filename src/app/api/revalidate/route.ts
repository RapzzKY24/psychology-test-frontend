import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireServerRole } from "@/lib/api/server";

/**
 * Purges the ISR cache for public pages after an admin edits content, so a
 * freshly published article does not wait for the 5-minute revalidate window.
 */
const BodySchema = z.object({
  paths: z
    .array(
      z.object({
        path: z.string().startsWith("/"),
        type: z.enum(["page", "layout"]).optional(),
      }),
    )
    .min(1)
    .max(10),
});

export async function POST(request: Request) {
  const session = await requireServerRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 422 });
  }

  for (const target of parsed.data.paths) {
    revalidatePath(target.path, target.type);
  }

  return NextResponse.json({ revalidated: parsed.data.paths.length });
}
