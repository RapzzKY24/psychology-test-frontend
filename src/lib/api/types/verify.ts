/**
 * `GET /api/v1/invoices/verify/:token` — hasil scan QR di PDF invoice.
 * Nomor VA hanya muncul selama invoice masih menunggu pembayaran.
 */
export interface InvoiceVerification {
  number: string;
  institutionName: string;
  amount: number;
  status: "UNPAID" | "PAID" | "CANCELLED";
  issuedAt: string;
  dueDate: string | null;
  paidAt: string | null;
  payment: { bank: string; vaNumber: string } | null;
}

/**
 * `GET /api/v1/public/reports/verify/:code` — QR on the report PDF. The holder
 * name is masked and a revoked report never carries its recommendation.
 */
export interface ReportVerification {
  valid: boolean;
  number?: string;
  revision?: number;
  status?: "ACTIVE" | "REVOKED";
  holderName?: string;
  sessionTitle?: string;
  issuedAt?: string;
  recommendation?: "LAYAK" | "BELUM_LAYAK" | "TIDAK_LAYAK";
  revokedAt?: string;
  revokeReason?: string;
}

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
