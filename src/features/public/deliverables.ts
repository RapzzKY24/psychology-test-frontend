import type { PublicTest, UserRole } from "@/lib/api/types";

export type DeliverableFlow = "personal" | "instansi" | "wpt";

/**
 * Which document set a visitor should see. WPT/CPMI wins over the role: it
 * keeps its own report even for an institution.
 */
export function deliverableFlowFor(
  test: Pick<PublicTest, "slug">,
  role: UserRole | null,
): DeliverableFlow {
  if (test.slug === "wpt" || test.slug === "cpmi") return "wpt";
  if (role === "INSTANSI") return "instansi";
  return "personal";
}
