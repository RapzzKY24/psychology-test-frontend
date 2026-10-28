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
