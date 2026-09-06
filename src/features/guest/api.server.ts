import { apiFetchServer } from "@/lib/api/server";
import type { PublicSessionPreviewDto } from "./schemas";

/** Server-only preview fetch for the RSC join page (public endpoint). */
export function fetchSessionPreviewServer(token: string): Promise<ApiSuccessLike> {
  return apiFetchServer<PublicSessionPreviewDto>(`/public/sessions/${token}`);
}

interface ApiSuccessLike {
  data: PublicSessionPreviewDto;
  meta?: unknown;
  message?: string;
}
