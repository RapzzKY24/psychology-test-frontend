import type { UserRole } from "./enums";

/**
 * Better Auth session payload from `GET /api/v1/auth/get-session`.
 * NOTE: Better Auth routes are handled by the library BEFORE the Nest
 * TransformInterceptor — this response is NOT enveloped (`{session, user}` raw,
 * `null` when signed out). api-contract.md applies to Nest controllers only.
 */
export interface BetterAuthSession {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: string;
    updatedAt: string;
    /** Additional field (input:false) — assigned via admin endpoints or seeds only. */
    role: UserRole;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: string | null;
  };
}
