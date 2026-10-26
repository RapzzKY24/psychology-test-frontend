/** Slot count pre-filled at checkout before the operator edits it. */
export const DEFAULT_SLOT_LIMIT = 50;

/** Backend cap for one batch (CreateInstansiSessionSchema: max 1000). */
export const MAX_SLOT_LIMIT = 1000;

/** One page of the institution roster for the employee picker. */
export const EMPLOYEE_PICKER_LIMIT = 100;

/** Poll cadence for a session detail whose batch invoice is still UNPAID. */
export const SESSION_DETAIL_POLL_MS = 8000;

/** Published tests rarely change — cache them for the checkout session. */
export const INSTANSI_TESTS_STALE_MS = 5 * 60 * 1000;
