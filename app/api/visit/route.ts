import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { hasDb, getLiveDb, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET returns the visitor count; POST increments it (once per browser session, client-enforced). */
export async function GET() {
  if (!hasDb()) return NextResponse.json({ count: null });
  const db = getLiveDb();
  const rows = await db.select().from(schema.site_stats);
  const count = rows.find((r) => r.key === "visits")?.value ?? 0;
  return NextResponse.json({ count });
}

export async function POST() {
  if (!hasDb()) return NextResponse.json({ count: null });
  const db = getLiveDb();
  const [row] = await db
    .insert(schema.site_stats)
    .values({ key: "visits", value: 1 })
    .onConflictDoUpdate({
      target: schema.site_stats.key,
      set: { value: sql`${schema.site_stats.value} + 1` },
    })
    .returning({ value: schema.site_stats.value });
  return NextResponse.json({ count: row.value });
}
