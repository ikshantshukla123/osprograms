"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";
import { getProgramStatus, compareByDeadline, type ProgramStatus } from "@/lib/status";
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

      {/* Open now — uniform cards, the visual star */}
      {(openNow.length > 0 || (quick === "all" && !query && techFilter.length === 0)) && (
        <section id="open-now">
          <SectionHeading dot="bg-emerald-500" title="Open now" count={openNow.length} />
          {openNow.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openNow.map(({ program, ps }) => (
                <ProgramCard key={program.id} program={program} ps={ps} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl ring-1 ring-dashed ring-gray-300 bg-white/60 p-6 text-sm text-gray-500 text-center">
              Nothing is accepting applications today.{" "}
              <a href="#alerts" className="font-medium text-gray-900 underline">
                Get an email the moment that changes →
              </a>
            </div>
          )}
        </section>
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

function SectionHeading({ dot, title, count }: { dot: string; title: string; count: number }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {title}
      <span className="text-sm font-normal text-gray-400">({count})</span>
    </h2>
  );
}
