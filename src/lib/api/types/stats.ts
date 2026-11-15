/** `GET /api/v1/public/stats` — the counts the landing page is allowed to print. */
export interface PublicStats {
  tests: number;
  categories: number;
  psychologists: number;
}
