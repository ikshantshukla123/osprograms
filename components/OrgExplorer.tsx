"use client";

import { useMemo, useState } from "react";
import type { Org } from "@/lib/types";
import Chip from "./Chip";

const PROGRAM_BADGES: Record<string, string> = {
  gsoc: "bg-blue-50 text-blue-700 ring-blue-200",
  outreachy: "bg-pink-50 text-pink-700 ring-pink-200",
  lfx: "bg-teal-50 text-teal-700 ring-teal-200",
};

export default function OrgExplorer({ orgs }: { orgs: Org[] }) {
  const [tech, setTech] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const allTech = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orgs) for (const t of o.tech) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 18);
  }, [orgs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      if (tech.length > 0 && !tech.some((t) => o.tech.includes(t))) return false;
      if (q && ![o.name, o.description ?? "", ...o.tech].join(" ").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [orgs, tech, query]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizations…"
          className="w-full rounded-xl ring-1 ring-inset ring-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <div className="chip-rail flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {allTech.map((t) => (
            <Chip
              key={t}
              active={tech.includes(t)}
              onClick={() => setTech((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}
            >
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-400">{filtered.length} organizations</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((org) => {
          const yrs = org.gsoc_years;
          return (
            <div key={org.id} className="group bg-white rounded-xl ring-1 ring-gray-200 p-4 flex flex-col gap-2.5 transition-all duration-150 hover:ring-sky-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] active:shadow-none">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 leading-snug transition-colors group-hover:text-sky-700">{org.name}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{org.description}</p>

              <div className="flex flex-wrap gap-1">
                {org.tech.slice(0, 5).map((t) => (
                  <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {yrs.length > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${PROGRAM_BADGES.gsoc}`}>
                    GSoC {yrs[0]}–{yrs[yrs.length - 1]} · {yrs.length}×
                  </span>
                )}
                {org.programs.filter((p) => p !== "gsoc").map((p) => (
                  <span
                    key={p}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${PROGRAM_BADGES[p] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`}
                  >
                    {p === "lfx" ? "LFX" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium">
                {org.website && (
                  <a href={org.website} rel="noopener nofollow" target="_blank" className="text-sky-700 hover:underline">
                    Website
                  </a>
                )}
                {org.good_first_issues_url && (
                  <a href={org.good_first_issues_url} rel="noopener nofollow" target="_blank" className="text-emerald-700 hover:underline">
                    Good first issues
                  </a>
                )}
                {org.chat_url && (
                  <a href={org.chat_url} rel="noopener nofollow" target="_blank" className="text-gray-500 hover:underline">
                    Chat
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
