import { apiFetch } from "@/lib/api/client";

export interface RegisterInstitutionPayload {
  companyName: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

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
