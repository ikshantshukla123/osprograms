import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrograms, getProgramBySlug, SITE_URL } from "@/lib/data";
import { getStatus, getProgramStatus, formatDate, relativeDays } from "@/lib/status";
import StatusBadge from "@/components/StatusBadge";
import SubscribeForm from "@/components/SubscribeForm";

export const revalidate = 3600;

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  const ps = getProgramStatus(program);
  return {
    title: `${program.name} — ${ps.status.label} | dates, stipend, eligibility`,
    description: `${program.name}: ${program.stipend ?? "stipend varies"}, ${
      program.duration ?? ""
    }. ${program.eligibility ?? ""} Current status: ${ps.status.label}.`,
    alternates: { canonical: `${SITE_URL}/programs/${program.slug}` },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const todayISO = new Date().toISOString().slice(0, 10);
  const today = new Date(todayISO + "T00:00:00Z");
  const ps = getProgramStatus(program, today);

  const all = await getPrograms();
  const similar = all
    .filter(
      (p) =>
        p.id !== program.id &&
        (p.tech_tags.some((t) => program.tech_tags.includes(t)) ||
          p.beginner_friendly === program.beginner_friendly)
    )
    .slice(0, 4);

  const announcedCohorts = program.cohorts.filter((c) => c.dates_announced && c.opens_at);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${program.name} — application window`,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: program.official_url },
    ...(announcedCohorts[0]
      ? { startDate: announcedCohorts[0].opens_at, endDate: announcedCohorts[0].closes_at }
      : {}),
    organizer: { "@type": "Organization", name: program.name, url: program.official_url },
    description: program.short_description ?? undefined,
  };

  const summaryRows: [string, React.ReactNode][] = [
    ["Stipend", <strong key="s">{program.stipend ?? "—"}</strong>],
    ["Duration", program.duration ?? "—"],
    ["Cohorts per year", String(new Set(program.cohorts.map((c) => c.name)).size) ],
    ["Eligibility", program.eligibility ?? "—"],
    ["Remote", program.remote ? "Yes" : "No / hybrid"],
    ["Student-only", program.student_only ? "Yes" : "No"],
    ["Beginner-friendly", program.beginner_friendly ? "Yes" : "Not especially"],
    [
      "Official site",
      <a key="u" href={program.official_url} rel="noopener nofollow" target="_blank" className="text-sky-700 underline break-all">
        {program.official_url}
      </a>,
    ],
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">All programs</Link> <span aria-hidden>/</span>{" "}
        <span className="text-gray-600">{program.name}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{program.name}</h1>
          <StatusBadge status={ps.status} />
        </div>
        <p className="text-gray-600">{program.short_description}</p>
        <div className="flex flex-wrap gap-1.5">
          {program.tech_tags.map((t) => (
            <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {t}
            </span>
          ))}
        </div>
        <a
          href={program.apply_url ?? program.official_url}
          rel="noopener nofollow"
          target="_blank"
          className="inline-block rounded-lg bg-gray-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700"
        >
          Apply on official site ↗
        </a>
      </header>

      {/* Standardized summary table — identical structure on every program page */}
      <section className="bg-white rounded-xl ring-1 ring-gray-200 overflow-hidden">
        <h2 className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
          At a glance
        </h2>
        <dl>
          {summaryRows.map(([label, value]) => (
            <div key={label} className="flex gap-4 px-4 py-2.5 text-sm border-b border-gray-50 last:border-0">
              <dt className="w-36 shrink-0 text-gray-400">{label}</dt>
              <dd className="text-gray-800">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {program.eligibility_notes && (
        <section className="rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4">
          <h2 className="text-sm font-semibold text-amber-900 mb-1">⚠ Worth knowing</h2>
          <p className="text-sm text-amber-800">{program.eligibility_notes}</p>
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Application windows</h2>
        <div className="space-y-2">
          {program.cohorts.map((cohort) => {
            const status = getStatus(cohort, today);
            return (
              <div key={cohort.id} className="bg-white rounded-xl ring-1 ring-gray-200 p-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900">{cohort.name}</div>
                  <div className="text-sm text-gray-500">
                    {cohort.dates_announced && cohort.opens_at ? (
                      <>
                        Apply {formatDate(cohort.opens_at)} → {formatDate(cohort.closes_at)}{" "}
                        <span className="text-gray-400">
                          ({relativeDays(status.key === "closed" ? cohort.closes_at : cohort.opens_at, today)})
                        </span>
                        {cohort.program_start && (
                          <> · Program {formatDate(cohort.program_start)} → {formatDate(cohort.program_end)}</>
                        )}
                      </>
                    ) : (
                      cohort.expected_note ?? "Dates not announced"
                    )}
                  </div>
                </div>
                <StatusBadge status={status} size="sm" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-white ring-1 ring-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900">Get alerted for {program.name}</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Email before this window opens and before it closes.
        </p>
        <SubscribeForm
          programs={all.map((p) => ({ id: p.id, name: p.name }))}
          preselectedId={program.id}
          compact
        />
      </section>

      {similar.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Similar programs</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {similar.map((p) => {
              const sps = getProgramStatus(p, today);
              return (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="bg-white rounded-xl ring-1 ring-gray-200 p-3 hover:ring-sky-300 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                >
                  <span className="min-w-0 text-sm font-medium text-gray-800 truncate">{p.name}</span>
                  <span className="shrink-0 self-start sm:self-auto sm:max-w-[55%]">
                    <StatusBadge status={sps.status} size="sm" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
