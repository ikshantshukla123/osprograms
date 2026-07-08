import type { Status } from "@/lib/status";

const STYLES: Record<Status["key"], { badge: string; dot: string }> = {
  open: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  soon: { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  upcoming: { badge: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  tba: { badge: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-400" },
  closed: { badge: "bg-gray-100 text-gray-500 ring-gray-200", dot: "bg-gray-400" },
};

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: Status;
  size?: "sm" | "md";
}) {
  const s = STYLES[status.key];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap ${s.badge} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${status.key === "open" ? "animate-pulse" : ""}`} />
      {status.label}
    </span>
  );
}
