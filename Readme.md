<div align="center">

# 🟢 OS Programs Tracker

**Every open source program. One page. Live deadlines.**

A self-updating website that tracks GSoC, Outreachy, LFX Mentorship, MLH Fellowship,
Hacktoberfest and 12+ more programs — with application status computed live from
verified dates, standardized stipend & eligibility info, an org finder, and email
alerts before application windows open.

[![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js)](https://nextjs.org/)
[![Neon](https://img.shields.io/badge/Postgres-Neon-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Scraper](https://img.shields.io/badge/Scraper-Python_+_Actions-3776AB?logo=python&logoColor=white)](.github/workflows/scrape.yml)

</div>

---

## Why this exists

Deadlines for programs like GSoC and Outreachy are scattered across a dozen sites,
and most "list of programs" pages go stale within months. This project fixes both:

- **Status is never stored** — `open / opens in 12 days / closed` is computed from
  verified dates on every render, so it can't go stale.
- **Unverified dates are never published** — if a program hasn't announced, the site
  says *"applications expected ~August"* instead of guessing. Accuracy is the brand.
- **A scraper watches the official pages** — when a timeline page changes, it opens a
  GitHub issue so a human can verify and update the dates. Machines detect, humans decide.

## Features

| Page | What it does |
|---|---|
| **Home `/`** | Deadline-first view: *Open now* cards → *Opening soon* → *Upcoming* → *TBA* → *Closed*. Search + filter chips (Paid / Student-only / Beginner-friendly / tech). |
| **Program pages `/programs/[slug]`** | Standardized at-a-glance table (stipend, duration, eligibility, gotchas), every cohort with live status, similar programs, JSON-LD. |
| **Org finder `/orgs`** | 46 orgs across GSoC / Outreachy / LFX with tech filters, participation badges, good-first-issue + chat links. |
| **Beginner guide `/start`** | 8-week learning path, 35 beginner-friendly projects by language with pre-filtered issue links, FAQ. |
| **Email alerts** | Double-opt-in subscriptions; daily cron emails *opens soon / opened / closes soon* — idempotent, unsubscribe in every email. |

## Tech stack

- **Next.js 15** (App Router, TypeScript) — static generation + ISR (1h), tiny client JS
- **Neon** serverless Postgres via **drizzle-orm**, with an in-repo seed fallback so the
  app runs with zero configuration
- **Resend** for verification + alert emails
- **Python scraper** (requests + BeautifulSoup) run weekly by **GitHub Actions**:
  change detection on 17 official pages, org data refresh from
  [gsocorganizations.dev](https://www.gsocorganizations.dev/), Outreachy participation
  sync from outreachy.org cohort pages
- **Tailwind CSS v4**, mobile-first

## Getting started

```bash
git clone https://github.com/ikshantshukla123/osprograms.git
cd osprograms
npm install

# runs immediately on the in-repo seed data — no DB needed
npm run dev
```

To go DB-backed, create a free [Neon](https://neon.tech) project and a
[Resend](https://resend.com) key, then:

```bash
cp .env.example .env    # fill in DATABASE_URL, RESEND_API_KEY
npm run db:push         # create tables
npm run db:seed         # load hand-verified programs, cohorts, orgs
npm run dev
```

### Deploy (Vercel)

1. Import the repo into Vercel, set `DATABASE_URL`, `RESEND_API_KEY`,
   `NEXT_PUBLIC_SITE_URL` (and optionally `CRON_SECRET`).
2. Verify a sending domain in Resend (sandbox only delivers to your own inbox).
3. Add `DATABASE_URL` as a GitHub Actions secret so the weekly scraper can sync orgs.
4. `vercel.json` already schedules the daily alert cron at `/api/cron/alerts`.

## How data stays correct

```
official page changes ──▶ scraper (weekly) ──▶ GitHub issue ──▶ maintainer verifies
                                                                    │
site recomputes statuses hourly ◀── Neon cohorts table ◀── updates dates
```

The scraper never writes dates. To update data: edit `data/programs.ts`,
run `npm run db:seed`, commit — git stays the audit trail.

## Contributing

Spotted a wrong or newly-announced date? Open an issue or PR with a link to the
**official** announcement — official sources only, that's the whole point. Program
entries live in [`data/programs.ts`](data/programs.ts), orgs in
[`data/orgs.ts`](data/orgs.ts), watched URLs in
[`scraper/watchlist.json`](scraper/watchlist.json).

## Credits

- GSoC historical org data: [gsocorganizations.dev](https://www.gsocorganizations.dev/)
- Outreachy participation data: [outreachy.org](https://www.outreachy.org/past-projects/)
- Program details are hand-verified against each program's official website
- Program list originally inspired by community-curated open source program lists

---

<div align="center">

Free · Open source · No accounts, no spam — just deadlines you won't miss.

</div>
