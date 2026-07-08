"use client";

import { useEffect, useState } from "react";

/**
 * Counts one visit per browser session (sessionStorage flag), then shows
 * the all-time total. Renders nothing until loaded / if the DB is absent,
 * so it never breaks the static page.
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const counted = sessionStorage.getItem("visit-counted");
    fetch("/api/visit", { method: counted ? "GET" : "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") {
          setCount(d.count);
          sessionStorage.setItem("visit-counted", "1");
        }
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-inset ring-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500"
      title="Unique browser sessions since launch"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gray-400" fill="currentColor" aria-hidden>
        <path d="M8 3C4.5 3 1.7 5.9 1 8c.7 2.1 3.5 5 7 5s6.3-2.9 7-5c-.7-2.1-3.5-5-7-5Zm0 8.2A3.2 3.2 0 1 1 8 4.8a3.2 3.2 0 0 1 0 6.4Zm0-1.7A1.5 1.5 0 1 0 8 6.5a1.5 1.5 0 0 0 0 3Z" />
      </svg>
      {count.toLocaleString("en-IN")} visitors so far
    </span>
  );
}
