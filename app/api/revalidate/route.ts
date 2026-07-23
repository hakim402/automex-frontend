// app/api/revalidate/route.ts
//
// On-demand ISR revalidation webhook — called by the Django backend
// whenever content is created, updated, or deleted.
//
// Expected payload:
//   { path?: string; tag?: string; secret: string }
//
// - path  → calls revalidatePath(path) to purge a specific URL
// - tag   → calls revalidateTag(tag) to purge all fetch() calls
//           tagged with that tag (e.g. "services", "blog-posts")
// - Both can be sent; both will be applied.
//
// The REVALIDATION_SECRET env var acts as a shared secret between
// Django and Next.js so only the backend can trigger purges.

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { path?: string; tag?: string; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Shared secret check
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret) {
    console.error("[revalidate] REVALIDATION_SECRET env var is not set — rejecting all requests.");
    return NextResponse.json({ error: "Server not configured for revalidation" }, { status: 500 });
  }

  if (body.secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const purged: string[] = [];

  if (body.path) {
    revalidatePath(body.path);
    purged.push(`path=${body.path}`);
  }

  if (body.tag) {
    revalidateTag(body.tag, "seconds");
    purged.push(`tag=${body.tag}`);
  }

  if (purged.length === 0) {
    return NextResponse.json({ error: "No path or tag provided" }, { status: 400 });
  }

  console.log(`[revalidate] Purged: ${purged.join(", ")}`);
  return NextResponse.json({ revalidated: true, purged });
}
