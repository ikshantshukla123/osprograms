import Link from "next/link";
import type { Program } from "@/lib/types";
import type { ProgramStatus } from "@/lib/status";
import { formatDate, relativeDays } from "@/lib/status";
import StatusBadge from "./StatusBadge";

/** Dense row — remoteok-style, used for upcoming/TBA/closed lists. */
export default function ProgramRow({
  program,
  ps,
  todayISO,
}: {
  program: Program;
  ps: ProgramStatus;
  todayISO: string;
}) {
  const cohort = ps.cohort;
  const today = new Date(todayISO + "T00:00:00Z");
  const dateLine =
    cohort?.dates_announced && cohort.opens_at
      ? ps.status.key === "closed"
        ? `closed ${formatDate(cohort.closes_at)}`
        : `${formatDate(cohort.opens_at)} (${relativeDays(cohort.opens_at, today)})`
      : cohort?.expected_note ?? "Dates not announced";

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex items-center gap-3 bg-white px-4 py-3 ring-1 ring-gray-200 first:rounded-t-xl last:rounded-b-xl -mt-px transition-colors duration-100 hover:bg-sky-50/60 hover:ring-gray-300 hover:relative hover:z-10 active:bg-sky-100"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-gray-900 truncate transition-colors group-hover:text-sky-700">{program.name}</span>
          <span className="hidden sm:inline text-gray-300 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden>→</span>
          {program.stipend && !/^(none|unpaid|no stipend)/i.test(program.stipend) && (
            <span className="hidden sm:inline shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
              Paid
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate">{dateLine}</div>
      </div>
      <div className="hidden md:block text-sm text-gray-500 w-40 truncate">{program.stipend ?? "—"}</div>
      <StatusBadge status={ps.status} size="sm" />
    </Link>
  );
}
