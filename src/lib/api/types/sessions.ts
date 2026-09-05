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
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
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

/**
 * `GET /api/v1/admin/sessions/:id` — verified against
 * sessions.prisma-repository.findDetailById (2026-09-06): participants is a
 * COUNT and attempts is a summary object, NOT arrays.
 */
export interface SessionAttemptsSummary {
  total: number;
  inProgress: number;
  completed: number;
}

export interface SessionDetail {
  /** Full TestSession row (admin-only endpoint; pinHash present — never rendered). */
  session: SessionSummary;
  tests: Array<{ id: string; testId: string; testName: string; order: number }>;
  participants: number;
  attempts: SessionAttemptsSummary;
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
