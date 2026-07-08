import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasDb, getDb, schema } from "@/lib/db";

export async function GET(req: Request) {
  if (!hasDb()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const db = getDb();
  const rows = await db
    .delete(schema.subscribers)
    .where(eq(schema.subscribers.verify_token, token))
    .returning({ email: schema.subscribers.email });

  if (rows.length === 0) {
    return NextResponse.json({ error: "Invalid token — you may already be unsubscribed" }, { status: 404 });
  }
  return new NextResponse("You've been unsubscribed. No more emails from us. 👋", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
