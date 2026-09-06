/**
 * Guest participant-token storage (ADR-005/ADR-010).
 * The ONLY thing this app stores in localStorage.
 *
 * Keyed per ATTEMPT id (not sessionId): the join response contains the
 * attempt ids but not the sessionId, and the runner must look the token up
 * before it can fetch the attempt.
 */

const PREFIX = "pt:participant-token:attempt:";

export function setGuestTokenForAttempt(attemptId: string, token: string): void {
  localStorage.setItem(`${PREFIX}${attemptId}`, token);
}

export function getGuestTokenForAttempt(attemptId: string): string | null {
  return localStorage.getItem(`${PREFIX}${attemptId}`);
}
