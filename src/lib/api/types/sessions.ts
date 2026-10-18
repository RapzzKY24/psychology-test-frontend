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
 * sessions.prisma-repository.findDetailById (2026-09-06, updated same day:
 * participants now returns the full rows; attempts is a summary object).
 */
export interface SessionAttemptsSummary {
  total: number;
  inProgress: number;
  completed: number;
}

export interface SessionParticipantRow {
  id: string;
  name: string;
  email: string | null;
  candidateNumber: string | null;
  joinedAt: string;
  /** Linked institution employee (null for ad-hoc participants). */
  employeeId: string | null;
  /** True once a device has locked the seat (participant token issued). */
  claimed: boolean;
  /** Responses submitted across this seat's attempts. */
  answeredCount: number;
}

export interface SessionDetail {
  /** Full TestSession row (admin-only endpoint; pinHash present — never rendered). */
  session: SessionSummary;
  tests: Array<{ id: string; testId: string; testName: string; order: number }>;
  participants: SessionParticipantRow[];
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
