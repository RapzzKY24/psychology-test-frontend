import type {
  CertificateFormData,
  CertificateGender,
  CertificatePayload,
  CertificateRecord,
  CertificateVerdict,
} from "@/lib/api/types";

export const VERDICT_VALUES: CertificateVerdict[] = [
  "MEMENUHI_SYARAT",
  "TIDAK_MEMENUHI_SYARAT",
];

export const VERDICT_LABELS: Record<CertificateVerdict, string> = {
  MEMENUHI_SYARAT: "Memenuhi Syarat",
  TIDAK_MEMENUHI_SYARAT: "Tidak Memenuhi Syarat",
};

export const GENDER_VALUES: CertificateGender[] = ["LAKI_LAKI", "PEREMPUAN"];

export const GENDER_LABELS: Record<CertificateGender, string> = {
  LAKI_LAKI: "Laki-laki",
  PEREMPUAN: "Perempuan",
};

/** Form state. An empty string means "not filled yet", never a value. */
export interface CertificateFormValues {
  fullName: string;
  idNumber: string;
  gender: CertificateGender | "";
  birthPlace: string;
  birthDate: string;
  /** Kept as text so the input can be cleared; converted on save. */
  age: string;
  address: string;
  verdict: CertificateVerdict | "";
  purpose: string;
  validUntil: string;
}

/** Seeds the form from the API; every key exists so inputs stay controlled. */
export function toCertificateValues(
  form: CertificateFormData | CertificateRecord,
): CertificateFormValues {
  const record = "certificate" in form ? form.certificate : form;
  const identity = record.identity;

  return {
    fullName: identity.fullName,
    idNumber: identity.idNumber,
    gender: identity.gender,
    birthPlace: identity.birthPlace,
    // The API sends a timestamp; the input wants the calendar day only.
    birthDate: identity.birthDate.slice(0, 10),
    age: identity.age > 0 ? String(identity.age) : "",
    address: identity.address,
    verdict: record.verdict ?? "",
    purpose: record.purpose ?? "",
    validUntil: record.validUntil ? record.validUntil.slice(0, 10) : "",
  };
}

function trimmed(value: string): string {
  return value.trim();
}

/**
 * Only what the psychologist actually typed goes out: the backend merges, so an
 * empty string would overwrite a saved value with nothing.
 */
export function buildCertificatePayload(values: CertificateFormValues): CertificatePayload {
  const identity: NonNullable<CertificatePayload["identity"]> = {};

  const text: Array<["fullName" | "idNumber" | "birthPlace" | "address", string]> = [
    ["fullName", values.fullName],
    ["idNumber", values.idNumber],
    ["birthPlace", values.birthPlace],
    ["address", values.address],
  ];
  for (const [key, value] of text) {
    const clean = trimmed(value);
    if (clean.length > 0) identity[key] = clean;
  }

  if (values.gender !== "") identity.gender = values.gender;
  if (values.birthDate !== "") identity.birthDate = values.birthDate;
  const age = Number(values.age);
  if (values.age !== "" && Number.isInteger(age) && age >= 0) identity.age = age;

  const payload: CertificatePayload = {};
  if (Object.keys(identity).length > 0) payload.identity = identity;
  if (values.verdict !== "") payload.verdict = values.verdict;
  if (trimmed(values.purpose).length > 0) payload.purpose = trimmed(values.purpose);
  if (values.validUntil !== "") payload.validUntil = values.validUntil;
  return payload;
}

/** Labels for the backend's `missingFields` names, so the UI never prints a key. */
const FIELD_LABELS: Record<string, string> = {
  verdict: "Vonis",
  purpose: "Tujuan",
  validUntil: "Tanggal berlaku",
  photo: "Foto 3×4",
  "identity.fullName": "Nama lengkap",
  "identity.idNumber": "NIK",
  "identity.gender": "Jenis kelamin",
  "identity.birthPlace": "Tempat lahir",
  "identity.birthDate": "Tanggal lahir",
  "identity.age": "Usia",
  "identity.address": "Alamat",
};

export function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

/**
 * What still blocks publishing, judged from the form as it stands. The backend
 * runs the same check at issue time — this copy exists so the button and the
 * hint do not lag behind an unsaved keystroke.
 */
export function missingFieldsOf(values: CertificateFormValues, photoPath: string | null): string[] {
  const missing: string[] = [];
  if (values.verdict === "") missing.push("verdict");
  if (trimmed(values.purpose).length === 0) missing.push("purpose");
  if (values.validUntil === "") missing.push("validUntil");

  const identity: Array<[string, string]> = [
    ["identity.fullName", values.fullName],
    ["identity.idNumber", values.idNumber],
    ["identity.gender", values.gender],
    ["identity.birthPlace", values.birthPlace],
    ["identity.birthDate", values.birthDate],
    ["identity.age", values.age],
    ["identity.address", values.address],
  ];
  for (const [key, value] of identity) {
    if (trimmed(value).length === 0) missing.push(key);
  }

  if (!photoPath) missing.push("photo");
  return missing;
}

export function remainingLabel(count: number): string {
  return count === 1 ? "1 kolom belum diisi" : `${count} kolom belum diisi`;
}
