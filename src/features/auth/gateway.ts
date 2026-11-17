/**
 * Entry state for the /masuk gateway. Pure on purpose: the step rules are the
 * part worth testing, while the component only renders what this returns.
 */

export type AuthPeran = "pribadi" | "instansi";
export type AuthStatus = "sudah" | "belum";
export type AuthMode = "masuk" | "daftar";
export type EntryStep = "peran" | "status" | "form";
export type AuthFormKind = "signin" | "signup" | "instansi-signup";

export interface AuthEntryState {
  step: EntryStep;
  mode: AuthMode;
  peran: AuthPeran;
}

export interface AuthEntryParams {
  /** `1` set by proxy.ts when a session cookie is already gone. */
  langsung?: string | null;
  mode?: string | null;
  peran?: string | null;
}

function parsePeran(value: string | null | undefined): AuthPeran | null {
  return value === "pribadi" || value === "instansi" ? value : null;
}

function parseMode(value: string | null | undefined): AuthMode | null {
  return value === "masuk" || value === "daftar" ? value : null;
}

/**
 * - `langsung=1` or an explicit `mode` → straight to the form (deep links and
 *   expired-session redirects must not see the quiz again).
 * - a valid `peran` → skip the first question, still ask "sudah/belum".
 * - otherwise → start at the first question.
 */
export function resolveEntryState(params: AuthEntryParams): AuthEntryState {
  const peran = parsePeran(params.peran);
  const explicitMode = parseMode(params.mode);
  const resolvedPeran = peran ?? "pribadi";

  if (params.langsung === "1" || explicitMode) {
    return { step: "form", mode: explicitMode ?? "masuk", peran: resolvedPeran };
  }

  if (peran) {
    return { step: "status", mode: "masuk", peran };
  }

  return { step: "peran", mode: "masuk", peran: resolvedPeran };
}

export function modeForStatus(status: AuthStatus): AuthMode {
  return status === "sudah" ? "masuk" : "daftar";
}

export function formFor(mode: AuthMode, peran: AuthPeran): AuthFormKind {
  if (mode === "masuk") return "signin";
  return peran === "instansi" ? "instansi-signup" : "signup";
}

export function toggleMode(mode: AuthMode): AuthMode {
  return mode === "masuk" ? "daftar" : "masuk";
}
