/** `GET /api/v1/public/verify/:code` — 200 with `valid` either way; never any scores. */
export interface VerifyCodeResult {
  valid: boolean;
  testName?: string;
  /** Masked by the backend (e.g. "B***i"). */
  participantName?: string;
  completedAt?: string;
  approvedAt?: string;
  approvedBy?: {
    fullName: string;
    degree: string;
    licenseNumber: string;
  };
}
