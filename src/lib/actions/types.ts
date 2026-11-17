/** Hasil standar server action: sukses membawa data, gagal membawa pesan (Bahasa Indonesia). */
export type ActionResult<T = undefined> =
  | { ok: true; message: string; data: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export function ok<T>(message: string, data: T): ActionResult<T>;
export function ok(message: string): ActionResult;
export function ok<T>(message: string, data?: T): ActionResult<T | undefined> {
  return { ok: true, message, data };
}

export function fail(message: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, message, fieldErrors };
}
