import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!_db) {
    // Neon's HTTP driver uses fetch, which Next.js caches in its Data Cache
    // (persisted in .next/cache across builds!). cache:'no-store' would force
    // routes dynamic, so instead cap staleness at the same 1h the pages'
    // ISR revalidate uses. `npm run db:seed` clears the cache for local dev.
    const sql = neon(process.env.DATABASE_URL, {
      fetchOptions: { next: { revalidate: 3600 } },
    });
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export { schema };
