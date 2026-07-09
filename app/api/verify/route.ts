import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasDb, getLiveDb, schema } from "@/lib/db";
import { SITE_URL } from "@/lib/data";

export async function GET(req: Request) {
  if (!hasDb()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const db = getLiveDb();
  const rows = await db
    .update(schema.subscribers)
    .set({ verified: true })
    .where(eq(schema.subscribers.verify_token, token))
    .returning({ id: schema.subscribers.id });

  if (rows.length === 0) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
  }
  return NextResponse.redirect(`${SITE_URL}/?verified=1`);
}
