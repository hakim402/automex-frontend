/**
 * env.server.ts — Server-only access to the AUTOMEX_API_KEY
 *
 * This file is deliberately separate from lib/env.ts. The `server-only`
 * import below makes the Next.js build fail loudly if any Client Component
 * ever imports this file (directly or transitively)  the API key must
 * never reach the browser bundle.
 */
import "server-only";

export function getAutomexApiKey(): string {
  return process.env.AUTOMEX_API_KEY?.trim() ?? "";
}

/**
 * Call once from a server-only startup path (e.g. alongside validateEnv()
 * in app/layout.tsx) if you want a loud failure on missing key rather than
 * a silent 403 from every AUTOMEX API call.
 */
export function validateAutomexEnv(): void {
  if (typeof window !== "undefined") return;

  if (!getAutomexApiKey()) {
    throw new Error(
      "[automex-env] AUTOMEX_API_KEY is missing.\n" +
        "Add it to your .env file — get it via:\n" +
        '  python manage.py create_api_key --name "automex-frontend-web"'
    );
  }
}