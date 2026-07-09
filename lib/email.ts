import { SITE_URL, SITE_NAME } from "./data";

/**
 * Minimal Resend client (plain fetch — no SDK dependency).
 * No-ops gracefully when RESEND_API_KEY is missing so local dev
 * and pre-launch deploys don't break.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", opts.to);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || `${SITE_NAME} <alerts@osprograms.dev>`,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error", res.status, body);
    return { sent: false, error: `Resend ${res.status}` };
  }
  return { sent: true };
}

export function verificationEmail(token: string) {
  return {
    subject: "Confirm your open source program alerts",
    text: [
      `Confirm your email to start receiving application-window alerts from ${SITE_NAME}.`,
      "",
      `Confirm: ${SITE_URL}/api/verify?token=${token}`,
      "",
      "You'll get a short email when a program you follow is about to open, opens, or is about to close. Nothing else.",
      "",
      `Didn't sign up? Ignore this, or unsubscribe: ${SITE_URL}/api/unsubscribe?token=${token}`,
    ].join("\n"),
  };
}

export function alertEmail(opts: {
  programName: string;
  alertType: "opens_soon" | "opened" | "closes_soon";
  whenLine: string;
  applyUrl: string;
  token: string;
}) {
  const headline = {
    opens_soon: `${opts.programName} applications open soon`,
    opened: `${opts.programName} applications are OPEN`,
    closes_soon: `Last chance: ${opts.programName} closes soon`,
  }[opts.alertType];
  return {
    subject: headline,
    text: [
      headline,
      "",
      opts.whenLine,
      "",
      `Apply: ${opts.applyUrl}`,
      `All programs: ${SITE_URL}`,
      "",
      `Unsubscribe: ${SITE_URL}/api/unsubscribe?token=${opts.token}`,
    ].join("\n"),
  };
}
