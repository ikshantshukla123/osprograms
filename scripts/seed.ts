/**
 * Push the hand-verified seed data into Neon.
 * Usage: DATABASE_URL=postgres://... npm run db:seed
 * Run `npm run db:push` first to create the tables.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { seedPrograms } from "../data/programs";
import { seedOrgs } from "../data/orgs";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env and run with: npx tsx --env-file=.env scripts/seed.ts");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });

  for (const p of seedPrograms) {
    const [row] = await db
      .insert(schema.programs)
      .values({
        slug: p.slug,
        name: p.name,
        short_description: p.short_description,
        stipend: p.stipend,
        duration: p.duration,
        eligibility: p.eligibility,
        eligibility_notes: p.eligibility_notes,
        student_only: p.student_only,
        beginner_friendly: p.beginner_friendly,
        remote: p.remote,
        official_url: p.official_url,
        apply_url: p.apply_url,
        tech_tags: p.tech_tags,
        active: p.active,
      })
      .onConflictDoUpdate({
        target: schema.programs.slug,
        set: {
          name: p.name,
          short_description: p.short_description,
          stipend: p.stipend,
          duration: p.duration,
          eligibility: p.eligibility,
          eligibility_notes: p.eligibility_notes,
          student_only: p.student_only,
          beginner_friendly: p.beginner_friendly,
          remote: p.remote,
          official_url: p.official_url,
          apply_url: p.apply_url,
          tech_tags: p.tech_tags,
          active: p.active,
        },
      })
      .returning({ id: schema.programs.id });

    // Replace cohorts wholesale — seed is the source of truth at seed time.
    await db.delete(schema.cohorts).where(eq(schema.cohorts.program_id, row.id));
    for (const c of p.cohorts) {
      await db.insert(schema.cohorts).values({
        program_id: row.id,
        name: c.name,
        opens_at: c.opens_at,
        closes_at: c.closes_at,
        program_start: c.program_start,
        program_end: c.program_end,
        dates_announced: c.dates_announced,
        expected_note: c.expected_note,
      });
    }
    console.log(`✓ ${p.name} (${p.cohorts.length} cohorts)`);
  }

  for (const o of seedOrgs) {
    await db
      .insert(schema.orgs)
      .values({
        name: o.name,
        slug: o.slug,
        description: o.description,
        website: o.website,
        tech: o.tech,
        gsoc_years: o.gsoc_years,
        programs: o.programs,
        good_first_issues_url: o.good_first_issues_url,
        chat_url: o.chat_url,
        source: o.source,
      })
      .onConflictDoUpdate({
        target: schema.orgs.slug,
        set: {
          description: o.description,
          tech: o.tech,
          gsoc_years: o.gsoc_years,
          programs: o.programs,
          website: o.website,
          good_first_issues_url: o.good_first_issues_url,
          chat_url: o.chat_url,
        },
      });
  }
  console.log(`✓ ${seedOrgs.length} orgs`);
  console.log("Seed complete.");
}

main();
