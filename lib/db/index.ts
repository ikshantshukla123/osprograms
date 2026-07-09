import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _liveDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * DB client for statically rendered pages (ISR). Neon's HTTP driver uses
 * fetch, which Next.js caches in its Data Cache (persisted in .next/cache
 * across builds!). cache:'no-store' would force routes dynamic, so cap
 * staleness at the same 1h the pages' ISR revalidate uses.
 * `npm run db:seed` clears the cache for local dev.
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL, {
      fetchOptions: { next: { revalidate: 3600 } },
    });
    _db = drizzle(sql, { schema });
  }
  return _db;
}

/**
 * DB client for API route handlers (dynamic). Bypasses the Data Cache
 * entirely — mutations and live reads (visit counter, subscribe, alert
 * cron) must never be served from a cached fetch: identical query bodies
 * would otherwise return stale results or skip writes altogether.
 */
export function getLiveDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!_liveDb) {
    const sql = neon(process.env.DATABASE_URL, {
      fetchOptions: { cache: "no-store" },
    });
    _liveDb = drizzle(sql, { schema });
  }
  return _liveDb;
}

export { schema };
