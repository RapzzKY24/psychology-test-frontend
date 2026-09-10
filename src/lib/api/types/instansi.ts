import type { IdType } from "./enums";

/** Mirrors backend InstitutionParticipant (owner-scoped, NIK visible to owner). */
export interface Employee {
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
  id: string;
  name: string;
  destinationCountry: string;
  idType: IdType;
  idNumber: string;
  birthDate: string | null;
  phone: string | null;
  notes: string | null;
}

export interface EmployeeInput {
  name: string;
  destinationCountry: string;
  idType: IdType;
  idNumber: string;
  birthDate?: string;
  phone?: string;
  notes?: string;
}
