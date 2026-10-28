import { apiFetch } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface MonthlyRevenue {
  /** `YYYY-MM` in Asia/Jakarta. */
  month: string;
  orders: number;
  invoices: number;
  total: number;
}

export interface AdminRevenueStats {
  months: MonthlyRevenue[];
  currentMonth: { total: number; paidCount: number };
  pendingResults: number;
}

export function fetchAdminRevenue(months: number): Promise<ApiSuccess<AdminRevenueStats>> {
  return apiFetch<AdminRevenueStats>(`/admin/stats/revenue?months=${months}`);
}
