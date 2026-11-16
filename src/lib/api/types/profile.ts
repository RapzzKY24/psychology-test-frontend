import type { Education, Gender } from "./attempts";

/**
 * `GET /api/v1/me/profile` — the caller's account row plus the declarations
 * recorded on their latest attempt. The attempt copy is read-only: gender and
 * education are stored per attempt so a norm cannot be swapped after the items
 * were shown.
 */
export interface MeProfileLastAttempt {
  testName: string;
  startedAt: string;
  birthDate: string | null;
  gender: Gender | null;
  education: Education | null;
}

export interface MeProfile {
  name: string;
  email: string;
  phone: string | null;
  lastAttempt: MeProfileLastAttempt | null;
}

/** `PATCH /api/v1/me/profile` — only the fields the participant owns. */
export interface MeProfilePayload {
  name?: string;
  phone?: string | null;
}
