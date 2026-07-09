import type { Program } from "@/lib/types";

/**
 * Hand-verified seed data (from the repo README + official pages).
 * Rule: never publish unverified dates — if a window isn't confirmed,
 * dates_announced=false + expected_note instead.
 *
 * This file is the source of truth until DATABASE_URL is configured;
 * `npm run db:seed` pushes it into Neon.
 */

let cohortId = 1;
const c = (
  program_id: number,
  name: string,
  fields: Partial<Omit<Program["cohorts"][number], "id" | "program_id" | "name">>
) => ({
  id: cohortId++,
  program_id,
  name,
  opens_at: null,
  closes_at: null,
  program_start: null,
  program_end: null,
  dates_announced: true,
  expected_note: null,
  ...fields,
});

export const seedPrograms: Program[] = [
  {
    id: 1,
    slug: "gsoc",
    name: "Google Summer of Code",
    short_description:
      "Google's global program pairing new contributors with open source organizations for a paid 12–22 week project.",
    stipend: "$1,500 – $6,600",
    duration: "12–22 weeks",
    eligibility: "18+ years old, open to all (students and non-students)",
    eligibility_notes:
      "You must be new to open source or a beginner contributor to the org you apply to. Stipend varies by project size and country purchasing power parity.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://summerofcode.withgoogle.com/",
    apply_url: "https://summerofcode.withgoogle.com/get-started",
    tech_tags: ["Python", "C++", "JavaScript", "Java", "Rust", "Go", "ML"],
    active: true,
    cohorts: [
      c(1, "2026", {
        opens_at: "2026-03-16",
        closes_at: "2026-03-31",
        program_start: "2026-05-25",
        program_end: "2026-11-02",
      }),
      c(1, "2027", {
        dates_announced: false,
        expected_note: "Contributor applications expected ~March 2027",
      }),
    ],
  },
  {
    id: 2,
    slug: "outreachy",
    name: "Outreachy",
    short_description:
      "Paid remote internships in open source for people subject to systemic bias and underrepresented in tech.",
    stipend: "$7,000",
    duration: "13 weeks",
    eligibility: "People from groups underrepresented in tech; not a student-only program",
    eligibility_notes:
      "Hemisphere rule gotcha: Indian students count as Northern Hemisphere — as a student you can usually only do the May–August cohort, not December. Two cohorts per year (May & December).",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://www.outreachy.org/",
    apply_url: "https://www.outreachy.org/apply/",
    tech_tags: ["Python", "JavaScript", "Docs", "Design", "Linux"],
    active: true,
    cohorts: [
      c(2, "December 2026 cohort", {
        dates_announced: false,
        expected_note: "Initial applications expected ~August 2026",
      }),
      c(2, "May 2026 cohort", {
        dates_announced: false,
        expected_note: "Applications closed; internship runs Jun–Aug 2026",
      }),
    ],
  },
  {
    id: 3,
    slug: "lfx",
    name: "LFX Mentorship",
    short_description:
      "Linux Foundation's structured remote mentorships across CNCF, Hyperledger, kernel, and other LF projects. Three terms per year.",
    stipend: "$3,000 – $6,600 (varies by region)",
    duration: "12 weeks",
    eligibility: "Open to all, 18+",
    eligibility_notes:
      "Stipend depends on your country tier. Each project selects its own mentees — apply to 3 max per term. Terms: Spring (Mar–May), Summer (Jun–Aug), Fall (Sep–Nov).",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://mentorship.lfx.linuxfoundation.org/",
    apply_url: "https://mentorship.lfx.linuxfoundation.org/",
    tech_tags: ["Go", "Kubernetes", "Linux", "Rust", "C", "Cloud"],
    active: true,
    cohorts: [
      c(3, "Fall 2026 term", {
        dates_announced: false,
        expected_note: "Applications expected ~July–August 2026",
      }),
      c(3, "Summer 2026 term", {
        dates_announced: false,
        expected_note: "Applications closed; term runs Jun–Aug 2026",
      }),
    ],
  },
  {
    id: 4,
    slug: "mlh-fellowship",
    name: "MLH Fellowship",
    short_description:
      "Major League Hacking's 12-week remote program: real-world software engineering in small pods with mentorship.",
    stipend: "Need-based educational stipend",
    duration: "12 weeks",
    eligibility: "18+, students and recent grads; 3 batches per year",
    eligibility_notes:
      "Recent batches have shown limited or no matches for applicants residing in India and some other regions — verify current batch eligibility before applying.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://fellowship.mlh.io/",
    apply_url: "https://fellowship.mlh.io/",
    tech_tags: ["JavaScript", "Python", "Open Source", "SRE"],
    active: true,
    cohorts: [
      c(4, "Fall 2026 batch", {
        dates_announced: false,
        expected_note: "Fall batch applications typically open ~June–July",
      }),
    ],
  },
  {
    id: 5,
    slug: "gssoc",
    name: "GirlScript Summer of Code",
    short_description:
      "India's largest beginner-oriented open source program by the GirlScript Foundation; contribute to curated projects over ~3 months.",
    stipend: "None (certificates, swag, prizes)",
    duration: "~3 months",
    eligibility: "Open to all (not restricted to women); very popular with Indian students",
    eligibility_notes:
      "Leaderboard-based; great first program. Registration is free. 2026 applications opened Mar 24 at the launch event; selections ran end of March–early April (close date approximate). Watch the official site/socials — dates shift year to year.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://gssoc.girlscript.tech/",
    apply_url: "https://gssoc.girlscript.tech/",
    tech_tags: ["JavaScript", "Python", "Web", "Beginner"],
    active: true,
    cohorts: [
      c(5, "2026", {
        opens_at: "2026-03-24",
        closes_at: "2026-04-01", // selections "end of March / early April" — approximate
      }),
      c(5, "2027", {
        dates_announced: false,
        expected_note: "Applications expected ~March 2027 (2026 opened Mar 24)",
      }),
    ],
  },
  {
    id: 6,
    slug: "hacktoberfest",
    name: "Hacktoberfest",
    short_description:
      "DigitalOcean's annual month-long celebration of open source: make 4 accepted PRs in October, earn badges and swag.",
    stipend: "None (digital badges, swag)",
    duration: "1 month (October)",
    eligibility: "Open to everyone worldwide",
    eligibility_notes:
      "Registration usually opens in late September. Look for repos with the `hacktoberfest` topic and `good first issue` labels. Spammy PRs get disqualified.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://hacktoberfest.com/",
    apply_url: "https://hacktoberfest.com/",
    tech_tags: ["Beginner", "Any language", "Docs"],
    active: true,
    cohorts: [
      c(6, "2026", {
        opens_at: "2026-10-01",
        closes_at: "2026-10-31",
      }),
    ],
  },
  {
    id: 7,
    slug: "season-of-kde",
    name: "Season of KDE",
    short_description:
      "KDE community's mentorship program — code and non-code projects in the KDE ecosystem with strong mentor support.",
    stipend: "None (certificate + swag)",
    duration: "~8 weeks (Jan–Mar)",
    eligibility: "Open to all; students especially welcome",
    eligibility_notes:
      "Smaller and friendlier than GSoC — a good stepping stone. Join KDE Matrix channels early and discuss your proposal before applying.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://season.kde.org/",
    apply_url: "https://season.kde.org/",
    tech_tags: ["C++", "Qt", "Linux", "Docs"],
    active: true,
    cohorts: [
      c(7, "2026", {
        opens_at: "2025-12-15",
        closes_at: "2026-01-14",
        program_start: "2026-01-23",
        program_end: "2026-03-20",
      }),
      c(7, "2027", {
        dates_announced: false,
        expected_note: "Applications expected ~December 2026",
      }),
    ],
  },
  {
    id: 8,
    slug: "season-of-docs",
    name: "Google Season of Docs",
    short_description:
      "Google's program funding professional technical writers to work on open source documentation projects.",
    stipend: "Project grant (varies, typically $5,000–$15,000 per project)",
    duration: "~6 months",
    eligibility: "Technical writers (not student-restricted)",
    eligibility_notes:
      "Organizations receive the grant and hire the writer directly. Aimed at documentation professionals rather than developers.",
    student_only: false,
    beginner_friendly: false,
    remote: true,
    official_url: "https://developers.google.com/season-of-docs",
    apply_url: "https://developers.google.com/season-of-docs",
    tech_tags: ["Docs", "Technical writing"],
    active: true,
    cohorts: [
      c(8, "2026", {
        dates_announced: false,
        expected_note: "2026 program dates not announced",
      }),
    ],
  },
  {
    id: 9,
    slug: "summer-of-bitcoin",
    name: "Summer of Bitcoin",
    short_description:
      "Global summer internship introducing university students to Bitcoin open source development and design.",
    stipend: "$3,000 (paid in Bitcoin)",
    duration: "12 weeks",
    eligibility: "University students, 18+",
    eligibility_notes:
      "Has both a code track and a design track. Selection includes a screening test and proposal round early in the year.",
    student_only: true,
    beginner_friendly: false,
    remote: true,
    official_url: "https://www.summerofbitcoin.org/",
    apply_url: "https://www.summerofbitcoin.org/",
    tech_tags: ["C++", "Rust", "Go", "Bitcoin"],
    active: true,
    cohorts: [
      c(9, "2027", {
        dates_announced: false,
        expected_note: "Applications expected ~January 2027",
      }),
      c(9, "2026", {
        dates_announced: false,
        expected_note: "Applications closed; program runs May–Aug 2026",
      }),
    ],
  },
  {
    id: 10,
    slug: "c4gt",
    name: "Code for GovTech (C4GT)",
    short_description:
      "India's Digital Public Goods mentoring program — 3-month paid projects on government-tech open source.",
    stipend: "₹1,00,000",
    duration: "3 months",
    eligibility: "Students, working professionals, and tech enthusiasts (India-focused)",
    eligibility_notes:
      "Dedicated Mentoring Program (DMP) runs a summer cycle; community program runs year-round. Dates vary by year — verify on the official site.",
    student_only: false,
    beginner_friendly: false,
    remote: true,
    official_url: "https://app.codeforgovtech.in/",
    apply_url: "https://app.codeforgovtech.in/",
    tech_tags: ["JavaScript", "Python", "Java", "GovTech"],
    active: true,
    cohorts: [
      c(10, "DMP 2026", {
        dates_announced: false,
        expected_note: "2026 cycle underway; next applications expected ~April 2027",
      }),
    ],
  },
  {
    id: 11,
    slug: "fossee",
    name: "FOSSEE Summer Fellowship",
    short_description:
      "IIT Bombay's fellowship on FOSS projects (Python, Scilab, OpenFOAM, eSim…) — screening-task based selection.",
    stipend: "Paid (stipend-based)",
    duration: "~8 weeks",
    eligibility: "Students in India",
    eligibility_notes:
      "Selection via screening tasks rather than proposals. Some projects may expect on-site presence at IIT Bombay.",
    student_only: true,
    beginner_friendly: true,
    remote: true,
    official_url: "https://fossee.in/",
    apply_url: "https://fossee.in/fellowship",
    tech_tags: ["Python", "Scilab", "eSim", "ML"],
    active: true,
    cohorts: [
      c(11, "2027", {
        dates_announced: false,
        expected_note: "Applications expected ~February–March 2027",
      }),
    ],
  },
  {
    id: 12,
    slug: "ssoc",
    name: "Social Summer of Code",
    short_description:
      "Community-run summer program for open source beginners with social-impact projects.",
    stipend: "None (certificates, swag)",
    duration: "~2 months (Jun–Aug)",
    eligibility: "Open to all",
    eligibility_notes: "Registration typically opens ~April; coding June–August.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://ssoc.devfolio.co/",
    apply_url: "https://ssoc.devfolio.co/",
    tech_tags: ["Web", "Beginner", "JavaScript"],
    active: true,
    cohorts: [
      c(12, "2026", {
        dates_announced: false,
        expected_note: "2026 coding phase runs Jun–Aug; registrations closed",
      }),
    ],
  },
  {
    id: 13,
    slug: "linux-kernel-mentorship",
    name: "Linux Kernel Mentorship Program",
    short_description:
      "Linux Foundation mentorship focused specifically on Linux kernel development, bug fixing, and testing.",
    stipend: "None (community-driven program)",
    duration: "12 weeks (aligned with LFX terms)",
    eligibility: "Open to all; C programming knowledge expected",
    eligibility_notes:
      "Runs through the LFX Mentorship platform, Spring/Summer/Fall terms. Complete the application tasks (patches to the kernel) early.",
    student_only: false,
    beginner_friendly: false,
    remote: true,
    official_url: "https://wiki.linuxfoundation.org/lkmp",
    apply_url: "https://mentorship.lfx.linuxfoundation.org/",
    tech_tags: ["C", "Linux", "Kernel"],
    active: true,
    cohorts: [
      c(13, "Fall 2026 term", {
        dates_announced: false,
        expected_note: "Applications expected ~July–August 2026",
      }),
    ],
  },
  {
    id: 14,
    slug: "24-pull-requests",
    name: "24 Pull Requests",
    short_description:
      "Advent-calendar-style December challenge: send 24 pull requests to open source projects between Dec 1–24.",
    stipend: "None (recognition, badges)",
    duration: "24 days (Dec 1–24)",
    eligibility: "Everyone",
    eligibility_notes: "Very beginner-friendly — any size contribution counts, including docs.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://24pullrequests.com/",
    apply_url: "https://24pullrequests.com/",
    tech_tags: ["Beginner", "Any language"],
    active: true,
    cohorts: [
      c(14, "2026", {
        opens_at: "2026-12-01",
        closes_at: "2026-12-24",
      }),
    ],
  },
  {
    id: 15,
    slug: "ospp",
    name: "OSPP (Open Source Promotion Plan)",
    short_description:
      "Chinese Academy of Sciences' summer program pairing students worldwide with open source communities — GSoC-style projects with stipends.",
    stipend: "¥4,000 – ¥12,000 (by difficulty)",
    duration: "~3 months (Jul–Sep)",
    eligibility: "Students 18+ worldwide",
    eligibility_notes:
      "Site and some communities are Chinese-first but international students are welcome; many projects are in English.",
    student_only: true,
    beginner_friendly: false,
    remote: true,
    official_url: "https://summer-ospp.ac.cn/",
    apply_url: "https://summer-ospp.ac.cn/",
    tech_tags: ["C++", "Rust", "Java", "Databases"],
    active: true,
    cohorts: [
      c(15, "2026", {
        dates_announced: false,
        expected_note: "Student applications closed; coding runs Jul–Sep 2026",
      }),
      c(15, "2027", {
        dates_announced: false,
        expected_note: "Applications expected ~April 2027",
      }),
    ],
  },
  {
    id: 16,
    slug: "esoc",
    name: "European Summer of Code",
    short_description:
      "European program matching contributors — especially open source newcomers — with mentoring organizations, in two spring batches.",
    stipend: "Stipends available (varies by project)",
    duration: "~3 months",
    eligibility: "Open worldwide, especially contributors new to open source",
    eligibility_notes: "Two application batches in spring; projects start April/May.",
    student_only: false,
    beginner_friendly: true,
    remote: true,
    official_url: "https://www.esoc.dev/",
    apply_url: "https://www.esoc.dev/",
    tech_tags: ["JavaScript", "Python", "Web"],
    active: true,
    cohorts: [
      c(16, "2026 Batch 1", {
        opens_at: "2026-02-18",
        closes_at: "2026-03-18",
        program_start: "2026-04-15",
      }),
      c(16, "2026 Batch 2", {
        opens_at: "2026-03-19",
        closes_at: "2026-04-16",
        program_start: "2026-05-15",
      }),
    ],
  },
  {
    id: 17,
    slug: "igalia-ce",
    name: "Igalia Coding Experience",
    short_description:
      "Igalia's paid mentored program on browsers, graphics, and compilers (WebKit, Chromium, Mesa…).",
    stipend: "$7,000",
    duration: "~3 months (flexible)",
    eligibility: "Open to all; aimed at people starting in open source",
    eligibility_notes:
      "Rolling / periodic openings rather than a fixed annual window — watch the Igalia blog and site.",
    student_only: false,
    beginner_friendly: false,
    remote: true,
    official_url: "https://www.igalia.com/coding-experience/",
    apply_url: "https://www.igalia.com/coding-experience/",
    tech_tags: ["C++", "Browsers", "Graphics", "Compilers"],
    active: true,
    cohorts: [
      c(17, "Rolling", {
        dates_announced: false,
        expected_note: "Rolling / periodic openings — check the official page",
      }),
    ],
  },
];
