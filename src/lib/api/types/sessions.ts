import type { SessionKind, SessionStatus } from "./enums";

/** Body of `POST /api/v1/admin/sessions` (CreateSessionSchema, verified). */
export interface CreateSessionInput {
  title: string;
  institutionId?: string;
  testIds: string[];
  slotLimit: number;
  /** ISO string; must be in the future. */
  expiresAt: string;
  pin?: string;
}

/** Session row — `token` is the invite-link token (`/join/<token>`). */
export interface SessionSummary {
  id: string;
  title: string;
  kind: SessionKind;
  institutionId: string | null;
  token: string;
  slotLimit: number;
  expiresAt: string;
  status: SessionStatus;
  createdAt?: string;
}

/** `GET /api/v1/admin/sessions/:id` (SessionDetail from sessions.repository.ts, verified). */
export interface SessionDetail {
  session: SessionSummary;
  tests: Array<{ id: string; testId: string; testName: string; order: number }>;
  participants: Array<{
    id: string;
    name: string;
    email: string | null;
    candidateNumber: string | null;
    joinedAt: string;
  }>;
  attempts: Array<{
    id: string;
    testId: string;
    participantId: string | null;
    userId: string | null;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
  }>;
}

/** Body of `POST /api/v1/public/sessions/:token/join` (JoinSessionSchema, verified). */
export interface JoinSessionInput {
  name: string;
  email?: string;
  candidateNumber?: string;
  pin?: string;
}

/**
 * Join success payload. `participantToken` is ONE-TIME (ADR-005): the server
 * stores only a hash — the FE must surface it for saving before moving on.
 */
export interface JoinSessionResult {
  participant: {
    id: string;
    name: string;
    email: string | null;
    candidateNumber: string | null;
  };
  participantToken: string;
  attempts: Array<{ id: string; testId: string; testName: string }>;
}
