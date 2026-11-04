export type CertificateStatus = "DRAFT" | "ACTIVE" | "SUPERSEDED" | "REVOKED";

export type CertificateVerdict = "MEMENUHI_SYARAT" | "TIDAK_MEMENUHI_SYARAT";

export type CertificateGender = "LAKI_LAKI" | "PEREMPUAN";

/**
 * The identity block as the certificate prints it. Typed by the psychologist —
 * no participant row carries gender, birthplace or address. An empty string
 * means "not filled yet", never a value.
 */
export interface CertificateIdentity {
  fullName: string;
  idNumber: string;
  gender: CertificateGender | "";
  birthPlace: string;
  /** ISO date (YYYY-MM-DD). */
  birthDate: string;
  age: number;
  address: string;
}

/** `GET /api/v1/certificates/:id` and the draft routes. */
export interface CertificateRecord {
  id: string;
  resultId: string;
  status: CertificateStatus;
  identity: CertificateIdentity;
  verdict: CertificateVerdict | null;
  purpose: string | null;
  validUntil: string | null;
  photoPath: string | null;
  filledById: string | null;
  number: string | null;
  seq: number | null;
  year: number | null;
  revision: number | null;
  supersedesId: string | null;
  verifyCode: string | null;
  issuedAt: string | null;
  revokedAt: string | null;
  /** Present once the row is REVOKED. */
  revokeReason: string | null;
  updatedAt: string;
}

/** What the editor loads: the row, the result behind it, and how far it is. */
export interface CertificateFormData {
  certificate: CertificateRecord;
  result: {
    resultId: string;
    testName: string;
    testSlug: string;
    participantName: string | null;
    sessionTitle: string | null;
  };
  readiness: {
    profileComplete: boolean;
    /** Field names, translated by `fieldLabel` — never printed raw. */
    missingFields: string[];
  };
}

/** `GET /api/v1/certificates` — drafts and issued rows, newest first. */
export interface CertificateListItem {
  id: string;
  number: string | null;
  revision: number | null;
  status: CertificateStatus;
  testName: string;
  holderName: string;
  issuedAt: string | null;
  updatedAt: string;
}

/** `GET /api/v1/certificates/pending` — approved results with no certificate. */
export interface PendingCertificateResult {
  resultId: string;
  testName: string;
  testSlug: string;
  participantName: string | null;
  approvedAt: string | null;
  sessionTitle: string | null;
}

/** `POST /api/v1/certificates/:id/issue`. */
export interface IssuedCertificate {
  id: string;
  number: string;
  revision: number;
  status: "ACTIVE";
  issuedAt: string;
  verifyCode: string;
}

/** Partial save — omitted keys keep what is stored. */
export interface CertificatePayload {
  identity?: Partial<Omit<CertificateIdentity, "gender">> & {
    gender?: CertificateGender;
  };
  verdict?: CertificateVerdict | null;
  purpose?: string | null;
  validUntil?: string | null;
}
