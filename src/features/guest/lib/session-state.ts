/** Deadline check kept outside the component body (render purity). */
export function isSessionExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}
