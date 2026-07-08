import type { Metadata } from "next";
import Link from "next/link";
import { getPrograms, SITE_URL } from "@/lib/data";
import { getProgramStatus } from "@/lib/status";
import StatusBadge from "@/components/StatusBadge";
import {
  projectsByLanguage,
  nonCodeContributions,
  learningPath,
  issueLabels,
  resources,
  faqs,
} from "@/data/guide";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How to Start Contributing to Open Source — Beginner's Guide 2026",
  description:
    "A practical path into open source: an 8-week learning plan, beginner-friendly projects by language (Python, JavaScript, Rust, Go, ML), good-first-issue links, non-code contributions, and which programs to target first.",
  alternates: { canonical: `${SITE_URL}/start` },
};

export default async function StartPage() {
  const programs = await getPrograms();
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = new Date(todayISO + "T00:00:00Z");
  const beginnerPrograms = programs
    .filter((p) => p.beginner_friendly)
    .map((p) => ({ program: p, ps: getProgramStatus(p, today) }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Start contributing to open source
        </h1>
        <p className="text-gray-500 max-w-2xl">
          No experience needed — a practical path from your first Git commit to your first
          accepted program application. Everything below links to real issues you can pick up today.
        </p>
      </header>

      {/* 8-week learning path */}
      <section id="learning-path">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">The 8-week path</h2>
        <ol className="space-y-3">
          {learningPath.map((step, i) => (
            <li key={step.period} className="flex gap-4 bg-white rounded-xl ring-1 ring-gray-200 p-4">
              <span className="shrink-0 h-8 w-8 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{step.period}</div>
                <div className="font-medium text-gray-900">{step.task}</div>
                <p className="text-sm text-gray-600 mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Beginner-friendly programs — live statuses, internal links */}
      <section id="programs">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Best programs for beginners</h2>
        <p className="text-sm text-gray-500 mb-4">
          Live status from the <Link href="/" className="underline hover:text-gray-700">tracker</Link> — these are the ones marked beginner-friendly.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {beginnerPrograms.map(({ program, ps }) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="group bg-white rounded-xl ring-1 ring-gray-200 p-3 flex items-center justify-between gap-2 transition-colors hover:ring-sky-300 hover:bg-sky-50/40 active:bg-sky-100"
            >
              <span className="text-sm font-medium text-gray-800 truncate group-hover:text-sky-700">{program.name}</span>
              <StatusBadge status={ps.status} size="sm" />
            </Link>
          ))}
        </div>
      </section>

      {/* Projects by language */}
      <section id="projects">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Beginner-friendly projects by language</h2>
        <p className="text-sm text-gray-500 mb-4">
          Every "Issues" link is pre-filtered to that project's beginner label. Comment on an issue
          to claim it before you start.
        </p>
        <div className="space-y-6">
          {projectsByLanguage.map((group) => (
            <div key={group.language}>
              <h3 className="font-semibold text-gray-900 mb-2 flex flex-wrap items-center gap-2">
                {group.language}
                <span className="flex flex-wrap gap-1">
                  {group.labels.map((l) => (
                    <code key={l} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                      {l}
                    </code>
                  ))}
                </span>
              </h3>
              <div>
                {group.projects.map((p) => (
                  <div
                    key={p.name}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-white px-4 py-3 ring-1 ring-gray-200 first:rounded-t-xl last:rounded-b-xl -mt-px hover:bg-sky-50/60 transition-colors"
                  >
                    <div className="sm:w-44 shrink-0 font-medium text-gray-900">{p.name}</div>
                    <p className="flex-1 text-sm text-gray-600">{p.note}</p>
                    <div className="flex gap-3 text-sm font-medium shrink-0">
                      <a href={p.repo} rel="noopener nofollow" target="_blank" className="text-gray-500 hover:underline">
                        Repo
                      </a>
                      <a href={p.issues} rel="noopener nofollow" target="_blank" className="text-emerald-700 hover:underline">
                        Issues ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Preparing for a specific program instead?{" "}
          <Link href="/orgs" className="font-medium text-gray-900 underline">
            Use the org finder
          </Link>{" "}
          to pick an organization that actually mentors in GSoC, Outreachy, or LFX.
        </p>
      </section>

      {/* Issue labels */}
      <section id="labels">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue labels worth searching for</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {issueLabels.map((l) => (
            <div key={l.label} className="bg-white rounded-xl ring-1 ring-gray-200 p-3 text-sm">
              <code className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-medium">{l.label}</code>
              <span className="text-gray-600 ml-2">{l.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Non-code */}
      <section id="non-code">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No code? Still counts</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {nonCodeContributions.map((c) => (
            <div key={c.title} className="bg-white rounded-xl ring-1 ring-gray-200 p-4">
              <div className="font-medium text-gray-900">{c.title}</div>
              <p className="text-sm text-gray-600 mt-0.5">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section id="resources">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Useful resources</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {resources.map((group) => (
            <div key={group.group}>
              <h3 className="font-semibold text-gray-900 mb-2">{group.group}</h3>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a href={item.url} rel="noopener nofollow" target="_blank" className="font-medium text-sky-700 hover:underline">
                      {item.name}
                    </a>
                    <span className="text-gray-500"> — {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-white rounded-xl ring-1 ring-gray-200 p-4">
              <summary className="cursor-pointer select-none font-medium text-gray-900 marker:text-gray-400">
                {f.q}
              </summary>
              <p className="text-sm text-gray-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gray-900 text-white p-6 sm:p-8 text-center space-y-3">
        <h2 className="text-lg font-semibold">Ready? Don't miss the next application window.</h2>
        <p className="text-sm text-gray-300">
          Check what's <Link href="/" className="underline">open right now</Link> or get an email
          before the next program opens.
        </p>
        <Link
          href="/#alerts"
          className="inline-block rounded-lg bg-white text-gray-900 px-6 py-2.5 text-sm font-medium hover:bg-gray-200 active:scale-95 transition-transform"
        >
          Set up free alerts
        </Link>
      </section>
    </div>
  );
}
