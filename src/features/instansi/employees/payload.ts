import type { EmployeeInput } from "./schemas";

export interface EmployeeCreatePayload {
  name: string;
  destinationCountry: string;
  idType: EmployeeInput["idType"];
  idNumber: string;
  birthDate?: string;
  phone?: string;
  notes?: string;
}

export type EmployeeUpdatePayload = Partial<Omit<EmployeeCreatePayload, "idNumber">>;

function toIsoDatetime(dateOnly: string | undefined): string | undefined {
  if (!dateOnly || dateOnly.length === 0) return undefined;
  return new Date(`${dateOnly}T00:00:00`).toISOString();
}

/**
 * Maps form values to the backend contract:
 * - blank optionals become undefined (dropped from JSON),
 * - date-only input becomes full ISO datetime (BE requires datetime).
 */
export function toCreatePayload(values: EmployeeInput): EmployeeCreatePayload {
  return {
    name: values.name,
    destinationCountry: values.destinationCountry,
    idType: values.idType,
    idNumber: values.idNumber,
    birthDate: toIsoDatetime(values.birthDate),
    phone: values.phone || undefined,
    notes: values.notes || undefined,
  };
}

/** Edit mode strips idNumber (BE update schema omits it). */
export function toUpdatePayload(values: EmployeeInput): EmployeeUpdatePayload {
  return {
    name: values.name,
    destinationCountry: values.destinationCountry,
    idType: values.idType,
    birthDate: toIsoDatetime(values.birthDate),
    phone: values.phone || undefined,
    notes: values.notes || undefined,
  };
}
