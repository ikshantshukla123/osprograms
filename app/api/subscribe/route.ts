import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { hasDb, getDb, schema } from "@/lib/db";
import { sendEmail, verificationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!hasDb()) {
    return NextResponse.json(
      { error: "Alerts aren't live yet — database not configured. Check back soon!" },
      { status: 503 }
    );
  }

  let body: { email?: string; program_ids?: number[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const program_ids = Array.isArray(body.program_ids)
    ? body.program_ids.filter((n) => Number.isInteger(n)).slice(0, 100)
    : [];

  const db = getDb();
  const token = randomUUID();

  const existing = await db
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.email, email));

  if (existing.length > 0) {
    const sub = existing[0];
    await db
      .update(schema.subscribers)
      .set({ program_ids })
      .where(eq(schema.subscribers.id, sub.id));
    if (sub.verified) {
      return NextResponse.json({ message: "You're already subscribed — preferences updated." });
    }
    const mail = verificationEmail(sub.verify_token ?? token);
    if (!sub.verify_token) {
      await db
        .update(schema.subscribers)
        .set({ verify_token: token })
        .where(eq(schema.subscribers.id, sub.id));
    }
    await sendEmail({ to: email, ...mail });
    return NextResponse.json({ message: "Verification email re-sent — check your inbox." });
  }

  await db.insert(schema.subscribers).values({
    email,
    program_ids,
    verified: false,
    verify_token: token,
  });
  await sendEmail({ to: email, ...verificationEmail(token) });

  return NextResponse.json({
    message: "Almost done — click the link in your inbox to confirm.",
  });
}
