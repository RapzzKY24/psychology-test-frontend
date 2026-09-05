import type { InvoiceStatus, UserRole } from "./enums";

/** Row of `GET /api/v1/admin/users` (admin-users.controller.ts). */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/** Body of `POST /api/v1/admin/users`. */
export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Body of `PATCH /api/v1/admin/users/:id/role` — own-role change → 409 cannot_change_own_role. */
export interface UpdateRoleInput {
  role: UserRole;
}

/** Row of `GET /api/v1/admin/institutions`. */
export interface Institution {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  phone: string | null;
  notes: string | null;
}

export interface InstitutionInput {
  name: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  notes?: string;
}

/** Row of `GET /api/v1/admin/invoices` (number auto: INV-YYYY-NNNN). */
export interface Invoice {
  id: string;
  institutionId: string;
  number: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string | null;
  notes: string | null;
}

export interface CreateInvoiceInput {
  institutionId: string;
  amount: number;
  dueDate?: string;
  notes?: string;
}

/** Row of `GET /api/v1/admin/payments`. */
export interface PaymentRecord {
  id: string;
  userId: string;
  userName?: string;
  testId: string;
  testName?: string;
  basePrice: number;
  uniqueCode: number;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
  userClaimedAt: string | null;
  createdAt?: string;
}

/** `POST /api/v1/admin/payments/:id/verify` — wasLate = late-verify of an EXPIRED order. */
export interface VerifyPaymentResult {
  orderId: string;
  status: "PAID";
  wasLate: boolean;
  sessionId: string;
  attemptId: string;
}

/** Psychologist profile (`GET/PUT /api/v1/psychologist/me/profile` — non-standard: `complete` sibling). */
export interface PsychologistProfileResponse {
  data: {
    fullName: string;
    degree: string;
    licenseNumber: string;
    signatureImagePath?: string | null;
  };
  complete: boolean;
}
