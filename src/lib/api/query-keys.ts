/**
 * Query-key factory — the ONLY way keys are built (no inline arrays in hooks).
 * Granularity mirrors cache invalidation needs per feature.
 */
export const qk = {
  auth: {
    session: ["auth", "session"] as const,
  },
  tests: {
    all: ["tests"] as const,
    list: (filters?: { page?: number; category?: string }) =>
      ["tests", "list", filters ?? {}] as const,
    detail: (slug: string) => ["tests", "detail", slug] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (orderId: string) => ["orders", "detail", orderId] as const,
  },
  attempts: {
    all: ["attempts"] as const,
    detail: (attemptId: string) => ["attempts", "detail", attemptId] as const,
    result: (attemptId: string) => ["attempts", "result", attemptId] as const,
  },
  meResults: {
    all: ["me-results"] as const,
    list: (filters?: { page?: number }) => ["me-results", "list", filters ?? {}] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    list: (filters?: { page?: number; status?: string }) =>
      ["reviews", "list", filters ?? {}] as const,
    detail: (resultId: string) => ["reviews", "detail", resultId] as const,
  },
  admin: {
    users: {
      all: ["admin", "users"] as const,
      list: (filters?: { page?: number; role?: string }) =>
        ["admin", "users", "list", filters ?? {}] as const,
    },
    tests: {
      all: ["admin", "tests"] as const,
      list: (filters?: { page?: number; status?: string; category?: string }) =>
        ["admin", "tests", "list", filters ?? {}] as const,
      detail: (id: string) => ["admin", "tests", "detail", id] as const,
    },
    sessions: {
      all: ["admin", "sessions"] as const,
      list: (filters?: { page?: number }) => ["admin", "sessions", "list", filters ?? {}] as const,
      detail: (id: string) => ["admin", "sessions", "detail", id] as const,
    },
    institutions: {
      all: ["admin", "institutions"] as const,
      list: (filters?: { page?: number }) =>
        ["admin", "institutions", "list", filters ?? {}] as const,
    },
    payments: {
      all: ["admin", "payments"] as const,
      list: (filters?: { page?: number; status?: string; amount?: number }) =>
        ["admin", "payments", "list", filters ?? {}] as const,
    },
    invoices: {
      all: ["admin", "invoices"] as const,
      list: (filters?: { page?: number; status?: string }) =>
        ["admin", "invoices", "list", filters ?? {}] as const,
    },
    results: {
      all: ["admin", "results"] as const,
      list: (filters?: { page?: number; status?: string; sessionId?: string }) =>
        ["admin", "results", "list", filters ?? {}] as const,
      detail: (attemptId: string) => ["admin", "results", "detail", attemptId] as const,
    },
  },
} as const;
