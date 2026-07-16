/**
 * action-result.ts — Shared return shape for every AUTOMEX Server Action.
 * One generic type reused by contact, quote, booking, and newsletter
 * actions, so every form component handles errors the exact same way.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      message: string;
      /** DRF's flat {field: [errors]} shape, only present on 400s — used to call react-hook-form's setError per field. */
      fieldErrors?: Record<string, string[]>;
    };