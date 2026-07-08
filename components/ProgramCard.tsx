import Link from "next/link";
import type { Program } from "@/lib/types";
import type { ProgramStatus } from "@/lib/status";
import { formatDate } from "@/lib/status";
import StatusBadge from "./StatusBadge";

/** Uniform card — used for the 'Open now' and 'Opening soon' sections. */
export default function ProgramCard({ program, ps }: { program: Program; ps: ProgramStatus }) {
  const cohort = ps.cohort;
  return (
    <div className="group bg-white rounded-xl ring-1 ring-gray-200 p-4 flex flex-col gap-3 transition-all duration-150 hover:ring-sky-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] active:shadow-none">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/programs/${program.slug}`} className="min-w-0 font-semibold text-gray-900 leading-snug group-hover:text-sky-700 hover:underline transition-colors">
          {program.name}
        </Link>
        <StatusBadge status={ps.status} size="sm" />
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{program.short_description}</p>

      <dl className="text-sm space-y-1">
        <div className="flex gap-2">
          <dt className="text-gray-400 w-16 shrink-0">Stipend</dt>
          <dd className="text-gray-800 font-medium">{program.stipend ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-400 w-16 shrink-0">Window</dt>
          <dd className="text-gray-800">
            {cohort?.dates_announced && cohort.opens_at
              ? `${formatDate(cohort.opens_at)} → ${formatDate(cohort.closes_at)}`
              : cohort?.expected_note ?? "TBA"}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-400 w-16 shrink-0">Who</dt>
          <dd className="text-gray-800 line-clamp-1">{program.eligibility ?? "—"}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-1">
        {program.tech_tags.slice(0, 4).map((t) => (
          <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <a
          href={program.apply_url ?? program.official_url}
          rel="noopener nofollow"
          target="_blank"
          className="flex-1 text-center rounded-lg bg-gray-900 text-white text-sm font-medium py-2 transition-transform hover:bg-gray-700 active:scale-95"
        >
          Apply ↗
        </a>
        <Link
          href={`/programs/${program.slug}`}
          className="flex-1 text-center rounded-lg ring-1 ring-inset ring-gray-300 text-sm font-medium py-2 text-gray-700 transition-transform hover:bg-gray-50 active:scale-95"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
