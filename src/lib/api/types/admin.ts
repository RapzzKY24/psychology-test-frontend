import type { InvoiceStatus, UserRole } from "./enums";

/** Row of `GET /api/v1/admin/users` (admin-users.controller.ts). */
export interface AdminUser {
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
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
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
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
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
  id: string;
  institutionId: string;
  number: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string | null;
  notes: string | null;
}

/** `GET /api/v1/admin/invoices/:id` — the popup behind a table row. */
export interface AdminInvoiceDetail {
  id: string;
  number: string;
  status: InvoiceStatus;
  amount: number;
  issuedAt: string;
  dueDate: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  verifiedBySource: string | null;
  paymentType: string | null;
  notes: string | null;
  institution: { id: string; name: string } | null;
  session: {
    id: string;
    title: string;
    slotLimit: number;
    status: string;
    testNames: string[];
  } | null;
}

export interface CreateInvoiceInput {
  institutionId: string;
  amount: number;
  dueDate?: string;
  notes?: string;
}

/** Row of `GET /api/v1/admin/payments` (AdminPaymentListItemSchema, verified 2026-09-05). */
export interface AdminPaymentListItem {
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
  orderId: string;
  userName: string;
  userEmail: string;
  testName: string;
  amount: number;
  uniqueCode: number;
  createdAt: string;
  expiresAt: string;
  claimed: boolean;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  verifiedBy: { id: string; name: string; email: string } | null;
}

/** `POST /api/v1/admin/payments/:id/verify` — wasLate = late-verify of an EXPIRED order. */
export interface VerifyPaymentResult {
  orderId: string;
  status: "PAID";
  wasLate: boolean;
  sessionId: string;
  attemptId: string;
}


