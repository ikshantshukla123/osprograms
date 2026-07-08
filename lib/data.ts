import type { Program, Org, Cohort } from "./types";
import { seedPrograms } from "@/data/programs";
import { seedOrgs } from "@/data/orgs";
import { hasDb, getDb, schema } from "./db";

/**
 * Data layer: reads from Neon when DATABASE_URL is set, otherwise falls
 * back to the hand-verified in-repo seed so the site builds and runs
 * before the database is configured.
 */

export async function getPrograms(): Promise<Program[]> {
  if (!hasDb()) return seedPrograms.filter((p) => p.active);
  const db = getDb();
  const [programRows, cohortRows] = await Promise.all([
    db.select().from(schema.programs),
    db.select().from(schema.cohorts),
  ]);
  if (programRows.length === 0) return seedPrograms.filter((p) => p.active);

  const byProgram = new Map<number, Cohort[]>();
  for (const row of cohortRows) {
    const list = byProgram.get(row.program_id ?? -1) ?? [];
    list.push({
      id: row.id,
      program_id: row.program_id ?? -1,
      name: row.name,
      opens_at: row.opens_at,
      closes_at: row.closes_at,
      program_start: row.program_start,
      program_end: row.program_end,
      dates_announced: row.dates_announced ?? true,
      expected_note: row.expected_note,
    });
    byProgram.set(row.program_id ?? -1, list);
  }
  return programRows
    .filter((p) => p.active !== false)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: p.short_description,
      stipend: p.stipend,
      duration: p.duration,
      eligibility: p.eligibility,
      eligibility_notes: p.eligibility_notes,
      student_only: p.student_only ?? false,
      beginner_friendly: p.beginner_friendly ?? false,
      remote: p.remote ?? true,
      official_url: p.official_url,
      apply_url: p.apply_url,
      tech_tags: p.tech_tags ?? [],
      active: p.active ?? true,
      cohorts: byProgram.get(p.id) ?? [],
    }));
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const programs = await getPrograms();
  return programs.find((p) => p.slug === slug) ?? null;
}

export async function getOrgs(): Promise<Org[]> {
  if (!hasDb()) return seedOrgs;
  const db = getDb();
  const rows = await db.select().from(schema.orgs);
  if (rows.length === 0) return seedOrgs;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug ?? String(r.id),
    description: r.description,
    website: r.website,
    tech: r.tech ?? [],
    gsoc_years: r.gsoc_years ?? [],
    programs: r.programs ?? [],
    good_first_issues_url: r.good_first_issues_url,
    chat_url: r.chat_url,
    source: r.source ?? "gsocorganizations.dev",
  }));
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_NAME = "Open Source Programs Tracker";
