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
 * toInstansiInvoice). `paymentUrl` is the Midtrans Snap hosted page;
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
  /** Hosted payment page (Midtrans Snap); null for VA and manual providers. */
  paymentUrl: string | null;
  /** Snap token for the embedded popup; null for VA and manual providers. */
  paymentToken: string | null;
  expiresAt: string | null;
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
