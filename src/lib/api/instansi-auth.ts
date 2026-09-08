import { apiFetch } from "./client";
import type { InstansiSignUpInput } from "@/features/auth/schemas";

/** Wire payload: form input minus the client-only confirmation field. */
export type RegisterInstitutionPayload = Omit<InstansiSignUpInput, "confirmPassword">;

export interface RegisteredInstitution {
  user: { id: string; email: string; role: string };
  institution: { id: string; name: string };
}

/** POST /api/v1/register-institution — BE sets the HttpOnly session cookie. */
export function registerInstitution(payload: RegisterInstitutionPayload) {
  return apiFetch<RegisteredInstitution>("/register-institution", {
    method: "POST",
    body: payload,
  });
}
