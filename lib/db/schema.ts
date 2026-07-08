import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  date,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  short_description: text("short_description"),
  stipend: text("stipend"),
  duration: text("duration"),
  eligibility: text("eligibility"),
  eligibility_notes: text("eligibility_notes"),
  student_only: boolean("student_only").default(false),
  beginner_friendly: boolean("beginner_friendly").default(false),
  remote: boolean("remote").default(true),
  official_url: text("official_url").notNull(),
  apply_url: text("apply_url"),
  tech_tags: text("tech_tags").array().default([]),
  active: boolean("active").default(true),
});

export const cohorts = pgTable("cohorts", {
  id: serial("id").primaryKey(),
  program_id: integer("program_id").references(() => programs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  opens_at: date("opens_at"),
  closes_at: date("closes_at"),
  program_start: date("program_start"),
  program_end: date("program_end"),
  dates_announced: boolean("dates_announced").default(true),
  expected_note: text("expected_note"),
});

export const orgs = pgTable("orgs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  description: text("description"),
  website: text("website"),
  tech: text("tech").array().default([]),
  gsoc_years: integer("gsoc_years").array().default([]),
  programs: text("programs").array().default([]),
  good_first_issues_url: text("good_first_issues_url"),
  chat_url: text("chat_url"),
  source: text("source").default("gsocorganizations.dev"),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  program_ids: integer("program_ids").array().default([]),
  verified: boolean("verified").default(false),
  verify_token: text("verify_token"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const site_stats = pgTable("site_stats", {
  key: text("key").primaryKey(), // e.g. 'visits'
  value: integer("value").notNull().default(0),
});

export const sent_alerts = pgTable(
  "sent_alerts",
  {
    id: serial("id").primaryKey(),
    subscriber_id: integer("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
    cohort_id: integer("cohort_id").references(() => cohorts.id, { onDelete: "cascade" }),
    alert_type: text("alert_type"), // 'opens_soon' | 'opened' | 'closes_soon'
    sent_at: timestamp("sent_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [unique().on(t.subscriber_id, t.cohort_id, t.alert_type)]
);
