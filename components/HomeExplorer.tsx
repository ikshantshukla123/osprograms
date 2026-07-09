"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";
import { getProgramStatus, compareByDeadline, formatDate, type ProgramStatus } from "@/lib/status";
import Chip from "./Chip";
import ProgramCard from "./ProgramCard";
import ProgramRow from "./ProgramRow";

type QuickFilter = "all" | "open" | "paid" | "student" | "beginner";

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open now" },
  { key: "paid", label: "Paid" },
  { key: "student", label: "Student-only" },
  { key: "beginner", label: "Beginner-friendly" },
];

function isPaid(p: Program): boolean {
  return Boolean(p.stipend && !/^(none|unpaid|no stipend)/i.test(p.stipend));
}

export default function HomeExplorer({
  programs,
  todayISO,
}: {
  programs: Program[];
  todayISO: string;
}) {
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [techFilter, setTechFilter] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const today = useMemo(() => new Date(todayISO + "T00:00:00Z"), [todayISO]);

  const withStatus = useMemo(
    () =>
      programs
        .map((p) => ({ program: p, ps: getProgramStatus(p, today) }))
        .sort((a, b) => compareByDeadline(a.ps, b.ps)),
    [programs, today]
  );

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of programs) for (const t of p.tech_tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [programs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withStatus.filter(({ program, ps }) => {
      if (quick === "open" && ps.status.key !== "open") return false;
      if (quick === "paid" && !isPaid(program)) return false;
      if (quick === "student" && !program.student_only) return false;
      if (quick === "beginner" && !program.beginner_friendly) return false;
      if (
        techFilter.length > 0 &&
        !techFilter.some((t) => program.tech_tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()))
      )
        return false;
      if (q) {
        const hay = [program.name, program.short_description, program.eligibility, ...program.tech_tags]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [withStatus, quick, techFilter, query]);

  const bucket = (keys: ProgramStatus["status"]["key"][]) =>
    filtered.filter(({ ps }) => keys.includes(ps.status.key));

  const openNow = bucket(["open"]);
  const soon = bucket(["soon"]);
  const upcoming = bucket(["upcoming"]);
  const tba = bucket(["tba"]);
  const closed = bucket(["closed"]);

  return (
    <div className="space-y-10">
      {/* Filter bar — mobile-first horizontally scrollable chip rails */}
      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programs, tech, eligibility…"
          className="w-full rounded-xl ring-1 ring-inset ring-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <div className="chip-rail flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {QUICK_FILTERS.map((f) => (
            <Chip key={f.key} active={quick === f.key} onClick={() => setQuick(f.key)}>
              {f.label}
            </Chip>
          ))}
          <span className="shrink-0 w-px bg-gray-200 my-1" aria-hidden />
          {allTags.map((t) => (
            <Chip
              key={t}
              active={techFilter.includes(t)}
              onClick={() =>
                setTechFilter((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
              }
            >
              {t}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No programs match those filters.</p>
      )}

      {/* Open now — uniform cards, the visual star. When nothing is open,
          sell the nearest upcoming window instead of showing an empty state. */}
      {openNow.length > 0 ? (
        <section id="open-now">
          <SectionHeading dot="bg-emerald-500" title="Open now" count={openNow.length} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openNow.map(({ program, ps }) => (
              <ProgramCard key={program.id} program={program} ps={ps} />
            ))}
          </div>
        </section>
      ) : (
        quick === "all" && !query && techFilter.length === 0 && (
          <NextWindowHero upNext={[...soon, ...upcoming, ...tba]} />
        )
      )}

      {soon.length > 0 && (
        <section>
          <SectionHeading dot="bg-amber-500" title="Opening soon" count={soon.length} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map(({ program, ps }) => (
              <ProgramCard key={program.id} program={program} ps={ps} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <SectionHeading dot="bg-sky-500" title="Upcoming" count={upcoming.length} />
          <div>
            {upcoming.map(({ program, ps }) => (
              <ProgramRow key={program.id} program={program} ps={ps} todayISO={todayISO} />
            ))}
          </div>
        </section>
      )}

      {tba.length > 0 && (
        <section>
          <SectionHeading dot="bg-violet-400" title="Dates not announced" count={tba.length} />
          <div>
            {tba.map(({ program, ps }) => (
              <ProgramRow key={program.id} program={program} ps={ps} todayISO={todayISO} />
            ))}
          </div>
        </section>
      )}

      {closed.length > 0 && (
        <section>
          <SectionHeading dot="bg-gray-400" title="Closed / next cycle" count={closed.length} />
          <div>
            {closed.map(({ program, ps }) => (
              <ProgramRow key={program.id} program={program} ps={ps} todayISO={todayISO} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NextWindowHero({
  upNext,
}: {
  upNext: { program: Program; ps: ProgramStatus }[];
}) {
  const next = upNext[0];
  if (!next) return null;
  const { program, ps } = next;
  const cohort = ps.cohort;
  const hasCountdown = ps.status.days !== null;
  const followers = upNext.slice(1, 3);

  return (
    <section id="open-now" className="rounded-2xl bg-gray-900 text-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Nothing open today — next window
          </div>
          <Link
            href={`/programs/${program.slug}`}
            className="block text-2xl sm:text-3xl font-bold leading-tight hover:underline"
          >
            {program.name}
          </Link>
          <p className="text-sm text-gray-300">
            {hasCountdown && cohort?.opens_at ? (
              <>
                Applications open{" "}
                <span className="font-medium text-white">{formatDate(cohort.opens_at)}</span>
                {cohort.closes_at && <> · close {formatDate(cohort.closes_at)}</>}
              </>
            ) : (
              (cohort?.expected_note ?? "Dates not announced")
            )}
            {program.stipend && !/^(none|unpaid|no stipend)/i.test(program.stipend) && (
              <> · {program.stipend}</>
            )}
          </p>
        </div>

        {hasCountdown && (
          <div className="shrink-0 text-center sm:text-right">
            <div className="text-5xl font-bold tabular-nums text-amber-400">{ps.status.days}</div>
            <div className="text-xs uppercase tracking-widest text-gray-400">
              {ps.status.days === 1 ? "day to go" : "days to go"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <a
          href="#alerts"
          className="rounded-lg bg-white text-gray-900 px-5 py-2.5 text-sm font-semibold text-center hover:bg-gray-200 active:scale-95 transition-transform"
        >
          Get alerted before it opens →
        </a>
        <Link
          href={`/programs/${program.slug}`}
          className="rounded-lg ring-1 ring-inset ring-gray-600 px-5 py-2.5 text-sm font-medium text-center text-gray-200 hover:bg-gray-800"
        >
          Details
        </Link>
        {followers.length > 0 && (
          <p className="sm:ml-auto text-xs text-gray-400">
            then:{" "}
            {followers.map(({ program: p, ps: fps }, i) => (
              <span key={p.id}>
                {i > 0 && " · "}
                <Link href={`/programs/${p.slug}`} className="text-gray-300 hover:underline">
                  {p.name}
                </Link>
                {fps.status.days !== null && fps.cohort?.opens_at
                  ? ` (${formatDate(fps.cohort.opens_at)})`
                  : ""}
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}

function SectionHeading({ dot, title, count }: { dot: string; title: string; count: number }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {title}
      <span className="text-sm font-normal text-gray-400">({count})</span>
    </h2>
  );
}
