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
