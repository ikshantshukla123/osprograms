import type { Cohort, Program } from "./types";

export type StatusKey = "open" | "soon" | "upcoming" | "tba" | "closed";

export interface Status {
  key: StatusKey;
  label: string;
  days: number | null; // days until close (open) or until open (soon/upcoming)
}

const DAY_MS = 86_400_000;

/** Midnight UTC for a 'YYYY-MM-DD' string — keeps day math timezone-stable. */
function utcDate(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function todayUtc(today: Date): number {
  return Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
}

/**
 * Single source of truth for application status.
 * Status is NEVER stored — always computed from opens_at/closes_at vs today.
 */
export function getStatus(cohort: Cohort, today: Date = new Date()): Status {
  if (!cohort.dates_announced || !cohort.opens_at || !cohort.closes_at) {
    return {
      key: "tba",
      label: cohort.expected_note || "Dates not announced",
      days: null,
    };
  }
  const now = todayUtc(today);
  const opens = utcDate(cohort.opens_at);
  const closes = utcDate(cohort.closes_at);

  if (now >= opens && now <= closes) {
    const d = Math.max(1, Math.ceil((closes - now) / DAY_MS) || 1);
    return {
      key: "open",
      label: d === 1 ? "Open — closes today/tomorrow" : `Open — closes in ${d} days`,
      days: d,
    };
  }
  if (now < opens) {
    const d = Math.ceil((opens - now) / DAY_MS);
    return d <= 45
      ? { key: "soon", label: `Opens in ${d} days`, days: d }
      : { key: "upcoming", label: "Upcoming", days: d };
  }
  return { key: "closed", label: "Closed", days: null };
}

const PRIORITY: StatusKey[] = ["open", "soon", "upcoming", "tba", "closed"];

export interface ProgramStatus {
  status: Status;
  cohort: Cohort | null;
}

/**
 * A program's display status = status of its nearest relevant cohort
 * (open > soon > upcoming > tba > closed priority).
 */
export function getProgramStatus(program: Program, today: Date = new Date()): ProgramStatus {
  let best: ProgramStatus = { status: { key: "closed", label: "Closed", days: null }, cohort: null };
  let bestRank = PRIORITY.length;

  for (const cohort of program.cohorts) {
    const status = getStatus(cohort, today);
    const rank = PRIORITY.indexOf(status.key);
    if (
      rank < bestRank ||
      (rank === bestRank && status.days !== null && best.status.days !== null && status.days < best.status.days)
    ) {
      best = { status, cohort };
      bestRank = rank;
    }
  }
  if (program.cohorts.length === 0) {
    best = { status: { key: "tba", label: "Dates not announced", days: null }, cohort: null };
  }
  return best;
}

/** Deadline-first ordering inside the same status bucket. */
export function compareByDeadline(a: ProgramStatus, b: ProgramStatus): number {
  const rankDiff = PRIORITY.indexOf(a.status.key) - PRIORITY.indexOf(b.status.key);
  if (rankDiff !== 0) return rankDiff;
  const da = a.status.days ?? Infinity;
  const db = b.status.days ?? Infinity;
  return da - db;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Relative time string: 'in 12 days' / '3 days ago' / 'today'. */
export function relativeDays(iso: string | null, today: Date = new Date()): string {
  if (!iso) return "";
  const diff = Math.round((utcDate(iso) - todayUtc(today)) / DAY_MS);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
}
