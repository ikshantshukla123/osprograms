import Link from "next/link";
import { getPrograms, SITE_NAME } from "@/lib/data";
import HomeExplorer from "@/components/HomeExplorer";
import SubscribeForm from "@/components/SubscribeForm";
import VisitorCounter from "@/components/VisitorCounter";
import { getProgramStatus } from "@/lib/status";

export const revalidate = 3600; // ISR — statuses recompute at least hourly

export default async function HomePage() {
  const programs = await getPrograms();
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = new Date(todayISO + "T00:00:00Z");
  const openCount = programs.filter((p) => getProgramStatus(p, today).status.key === "open").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center space-y-3 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Every open source program.
          <br className="sm:hidden" /> One page. Live deadlines.
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          GSoC, Outreachy, LFX, MLH, Hacktoberfest and {programs.length - 5}+ more — application
          status computed live from verified dates, with stipends and eligibility in one standard format.
        </p>
        <p className="text-sm">
          <Link href="/start" className="font-medium text-sky-700 hover:underline">
            New to open source? Start here →
          </Link>
        </p>
        <p className="text-xs text-gray-400">
          {openCount > 0 ? `${openCount} open right now · ` : ""}
          Last verified{" "}
          <time dateTime={todayISO}>
            {today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
          </time>
        </p>
        <VisitorCounter />
      </section>

      <HomeExplorer programs={programs} todayISO={todayISO} />

      <section
        id="alerts"
        className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 sm:p-8 max-w-2xl mx-auto scroll-mt-20"
      >
        <h2 className="text-lg font-semibold text-gray-900">Never miss a window</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          {SITE_NAME} emails you before applications open and before they close.
        </p>
        <SubscribeForm programs={programs.map((p) => ({ id: p.id, name: p.name }))} />
      </section>
    </div>
  );
}
