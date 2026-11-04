import type { IdType, InvoiceStatus } from "./enums";
import type { SessionDetail, SessionSummary } from "./sessions";

/** Mirrors backend InstitutionParticipant (owner-scoped, NIK visible to owner). */
export interface Employee {
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
  id: string;
  name: string;
  destinationCountry: string;
  idType: IdType;
  idNumber: string;
  birthDate: string | null;
  phone: string | null;
  notes: string | null;
}

/**
 * Session-linked invoice (`GET /instansi/invoices/:id`, verified 2026-10-18 —
 * toInstansiInvoice). `paymentUrl` is the hosted payment page (Snap or Doku);
 * `vaNumber` only appears on historical rows from the retired VA provider.
 */
export interface InstansiInvoice {
  id: string;
  number: string;
  amount: number;
  status: InvoiceStatus;
  sessionId: string | null;
  vaNumber: string | null;
  vaBankCode: string | null;
  /** Hosted payment page (Snap or Doku Checkout); null for manual providers. */
  paymentUrl: string | null;
  /** Snap token for the embedded popup; null for VA and manual providers. */
  paymentToken: string | null;
  expiresAt: string | null;
}

/**
 * `GET /instansi/invoices` row — the invoice plus the batch it pays for
 * (joined server-side, so the list needs no second request).
 */
export interface InstansiInvoiceListItem extends InstansiInvoice {
  sessionTitle: string | null;
  slotLimit: number | null;
}

/** `POST /instansi/sessions` → the created batch (session + its invoice). */
export interface InstansiBatchCreateResult {
  session: SessionSummary;
  invoice: InstansiInvoice;
}

/**
 * `GET /instansi/sessions/:id` — session detail plus the batch invoice
 * (null until provisioned). The invoice `amount` drives the roster editor.
 */
export interface InstansiSessionDetail extends SessionDetail {
  invoice: InstansiInvoice | null;
}

/** `POST /instansi/sessions/:id/participants/:participantId/reset`. */
export interface ResetSeatResult {
  id: string;
  name: string;
  candidateNumber: string | null;
  claimed: boolean;
}

/**
 * `GET /instansi/results` — institution-scoped approved results
 * (toInstansiResultItem). `scores` is an opaque JSON blob.
 */
export interface InstansiResultItem {
  resultId: string;
  participantName: string;
  testName: string;
  patternCode: string;
  scores: unknown;
  approvedAt: string | null;
  /** The live certificate, when one was issued. Institutions may only download it. */
  certificate: { id: string; number: string } | null;
}

/**
 * `GET /instansi/reports` — issued reports for the caller's institution.
 * Only ACTIVE and REVOKED rows are returned; drafts stay with the psychologist.
 */
export interface InstansiReportItem {
  id: string;
  participantId: string;
  participantName: string;
  sessionId: string;
  sessionTitle: string;
  number: string | null;
  revision: number | null;
  status: "DRAFT" | "ACTIVE" | "SUPERSEDED" | "REVOKED";
  issuedAt: string | null;
  testsApproved: number;
  testsTotal: number;
}

export interface EmployeeInput {
  name: string;
  destinationCountry: string;
  idType: IdType;
  idNumber: string;
  birthDate?: string;
  phone?: string;
  notes?: string;
}
