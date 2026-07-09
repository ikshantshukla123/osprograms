import { NextResponse } from "next/server";
import { and, eq, gte, lte, isNotNull } from "drizzle-orm";
import { hasDb, getLiveDb, schema } from "@/lib/db";
import { sendEmail, alertEmail } from "@/lib/email";
import { formatDate } from "@/lib/status";

export const maxDuration = 60;

/**
 * Daily alert job (Vercel Cron — see vercel.json).
 *   opens_at within [today, today+7]  -> 'opens_soon'
 *   opens_at = today                  -> 'opened'
 *   closes_at within [today, today+3] -> 'closes_soon'
 * Idempotent via sent_alerts UNIQUE(subscriber, cohort, type).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const db = getLiveDb();
  const today = new Date().toISOString().slice(0, 10);
  const plus = (days: number) => {
    const d = new Date(today + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const announced = and(
    eq(schema.cohorts.dates_announced, true),
    isNotNull(schema.cohorts.opens_at)
  );

  const [opensSoon, opened, closesSoon, subscribers, alreadySent, programRows] =
    await Promise.all([
      db.select().from(schema.cohorts).where(and(announced, gte(schema.cohorts.opens_at, today), lte(schema.cohorts.opens_at, plus(7)))),
      db.select().from(schema.cohorts).where(and(announced, eq(schema.cohorts.opens_at, today))),
      db.select().from(schema.cohorts).where(and(announced, gte(schema.cohorts.closes_at, today), lte(schema.cohorts.closes_at, plus(3)))),
      db.select().from(schema.subscribers).where(eq(schema.subscribers.verified, true)),
      db.select().from(schema.sent_alerts),
      db.select().from(schema.programs),
    ]);

  const sentSet = new Set(alreadySent.map((a) => `${a.subscriber_id}:${a.cohort_id}:${a.alert_type}`));
  const programById = new Map(programRows.map((p) => [p.id, p]));

  const jobs: {
    cohort: (typeof opensSoon)[number];
    type: "opens_soon" | "opened" | "closes_soon";
  }[] = [
    // 'opened' takes precedence over 'opens_soon' for the same day
    ...opened.map((cohort) => ({ cohort, type: "opened" as const })),
    ...opensSoon.filter((c) => c.opens_at !== today).map((cohort) => ({ cohort, type: "opens_soon" as const })),
    ...closesSoon.map((cohort) => ({ cohort, type: "closes_soon" as const })),
  ];

  let sent = 0;
  for (const { cohort, type } of jobs) {
    const program = cohort.program_id ? programById.get(cohort.program_id) : undefined;
    if (!program) continue;

    for (const sub of subscribers) {
      const wants =
        !sub.program_ids || sub.program_ids.length === 0 || sub.program_ids.includes(program.id);
      if (!wants) continue;
      const key = `${sub.id}:${cohort.id}:${type}`;
      if (sentSet.has(key)) continue;

      const whenLine =
        type === "closes_soon"
          ? `Applications close ${formatDate(cohort.closes_at)}.`
          : type === "opened"
            ? `Applications are open now and close ${formatDate(cohort.closes_at)}.`
            : `Applications open ${formatDate(cohort.opens_at)} and close ${formatDate(cohort.closes_at)}.`;

      const mail = alertEmail({
        programName: `${program.name} (${cohort.name})`,
        alertType: type,
        whenLine,
        applyUrl: program.apply_url ?? program.official_url,
        token: sub.verify_token ?? "",
      });
      const result = await sendEmail({ to: sub.email, ...mail });
      if (result.sent) {
        await db
          .insert(schema.sent_alerts)
          .values({ subscriber_id: sub.id, cohort_id: cohort.id, alert_type: type })
          .onConflictDoNothing();
        sentSet.add(key);
        sent++;
      }
    }
  }

  return NextResponse.json({ ok: true, candidates: jobs.length, emails_sent: sent });
}
