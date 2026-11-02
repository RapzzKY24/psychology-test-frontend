/** Mirrors backend enum ReportStatus. */
export type ReportStatus = "DRAFT" | "ACTIVE" | "SUPERSEDED" | "REVOKED";

/** Mirrors backend enum RatingCategory — R/K/C/B/T. */
export type RatingValue = "R" | "K" | "C" | "B" | "T";

/** Mirrors backend enum Recommendation. */
export type Recommendation = "LAYAK" | "BELUM_LAYAK" | "TIDAK_LAYAK";

/** Row of `GET /api/v1/psychologist/reports`. */
export interface ReportListItem {
  id: string;
  participantId: string;
  participantName: string;
  sessionId: string;
  sessionTitle: string;
  number: string | null;
  revision: number | null;
  status: ReportStatus;
  issuedAt: string | null;
  testsApproved: number;
  testsTotal: number;
}

/** Row of `GET /api/v1/psychologist/reports/pending` — no report row yet. */
export interface ReportCandidate {
  participantId: string;
  participantName: string;
  sessionId: string;
  sessionTitle: string;
  testsApproved: number;
  testsTotal: number;
}

/** `GET /api/v1/psychologist/reports/:participantId`. */
export interface ReportFormData {
  participant: {
    id: string;
    name: string;
    age: number | null;
    education: string | null;
    destination: string | null;
  };
  session: { id: string; title: string };
  tests: Array<{
    testName: string;
    patternCode: string | null;
    status: string;
    completedAt: string | null;
  }>;
  report: {
    id: string;
    status: ReportStatus;
    ratings: Record<string, RatingValue>;
    narratives: Record<string, string>;
    recommendation: Recommendation | null;
    /** Filled once ACTIVE — the form becomes read-only at that point. */
    number: string | null;
    issuedAt: string | null;
    updatedAt: string;
  } | null;
  readiness: {
    testsApproved: boolean;
    profileComplete: boolean;
    /** Backend field names still empty, e.g. `narratives.overall`. */
    missingFields: string[];
  };
}

/** `POST /api/v1/psychologist/reports/:participantId/issue`. */
export interface IssuedReport {
  id: string;
  number: string;
  revision: number;
  status: "ACTIVE";
  issuedAt: string;
  verifyCode: string;
}

/**
 * Payload of `PUT /api/v1/psychologist/reports/:participantId`. Every key is
 * optional — the backend merges, so an untouched field keeps its saved value.
 */
export interface ReportDraftPayload {
  ratings?: Record<string, RatingValue>;
  narratives?: Record<string, string>;
  recommendation?: Recommendation | null;
}
