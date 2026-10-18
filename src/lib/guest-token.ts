/**
 * Guest participant-token storage (ADR-005/ADR-010).
 * The participant token is the ONLY secret this app stores in localStorage.
 *
 * Keyed per ATTEMPT id (not sessionId): the join response contains the
 * attempt ids but not the sessionId, and the runner must look the token up
 * before it can fetch the attempt.
 *
 * A small non-secret resume record (participant name + attempt ids) is also
 * kept per SESSION invite token so a candidate returned to `/join/<token>`
 * lands directly in the runner ("Lanjutkan sebagai …") instead of re-picking.
 */

const PREFIX = "pt:participant-token:attempt:";
const RESUME_PREFIX = "pt:guest-resume:session:";

export function setGuestTokenForAttempt(attemptId: string, token: string): void {
  localStorage.setItem(`${PREFIX}${attemptId}`, token);
}

export function getGuestTokenForAttempt(attemptId: string): string | null {
  return localStorage.getItem(`${PREFIX}${attemptId}`);
}

/** Non-secret record (no token) used to offer a one-tap resume on the join page. */
export interface GuestResume {
  participantName: string;
  attemptIds: string[];
}

export function setGuestResume(sessionToken: string, resume: GuestResume): void {
  localStorage.setItem(`${RESUME_PREFIX}${sessionToken}`, JSON.stringify(resume));
}

export function getGuestResumeRaw(sessionToken: string): string | null {
  return localStorage.getItem(`${RESUME_PREFIX}${sessionToken}`);
}

/** Parses a raw resume snapshot defensively (returns null on anything odd). */
export function parseGuestResume(raw: string | null): GuestResume | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GuestResume;
    if (
      typeof parsed.participantName === "string" &&
      Array.isArray(parsed.attemptIds) &&
      parsed.attemptIds.every((id) => typeof id === "string")
    ) {
      return parsed;
    }
  } catch {
    // Corrupt entry — treat as absent.
  }
  return null;
}

export function getGuestResume(sessionToken: string): GuestResume | null {
  return parseGuestResume(getGuestResumeRaw(sessionToken));
}

/** `useSyncExternalStore` subscribe — re-reads when another tab clears storage. */
export function subscribeGuestResume(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function clearGuestResume(sessionToken: string): void {
  localStorage.removeItem(`${RESUME_PREFIX}${sessionToken}`);
}
