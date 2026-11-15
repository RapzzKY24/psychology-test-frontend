/** Mirrors backend PsychologistProfile (+ completeness flag from getProfile). */
export interface PsychologistProfile {
  id: string;
  userId: string;
  fullName: string;
  degree: string;
  licenseNumber: string;
  /** Printed as `SIPP NO` on the certificate; null on profiles made before it. */
  sippNumber: string | null;
  nik: string | null;
  institutionName: string | null;
  signatureImagePath: string;
}

export interface PsychologistProfileResponse {
  data: PsychologistProfile | null;
  complete: boolean;
}

/**
 * Public subset of a signing psychologist (`GET /api/v1/psychologists`) — the
 * same credentials the report prints under the signature. No NIK, no signature
 * file, no user id.
 */
export interface PublicPsychologist {
  fullName: string;
  degree: string;
  /** STR/SIK — printed as "Nomor STR/SIK" on the report. */
  licenseNumber: string;
  sippNumber: string | null;
  institutionName: string | null;
}
