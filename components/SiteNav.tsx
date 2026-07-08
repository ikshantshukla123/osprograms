"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Programs", match: (p: string) => p === "/" || p.startsWith("/programs") },
  { href: "/orgs", label: "Find an org", match: (p: string) => p.startsWith("/orgs") },
  { href: "/start", label: "Start here", match: (p: string) => p.startsWith("/start") },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600">
        {LINKS.map((l) => {
          const active = l.match(pathname);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        <Link
          href="/#alerts"
          className="ml-1 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 active:scale-95 transition-transform"
        >
          Get alerts
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 active:bg-gray-200"
      >
        {open ? (
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-14 z-30 bg-white border-b border-gray-200 shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 text-[15px] font-medium">
            {LINKS.map((l) => {
              const active = l.match(pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2.5 rounded-lg ${
                    active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 active:bg-gray-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/#alerts"
              onClick={() => setOpen(false)}
              className="mt-1 px-3 py-2.5 rounded-lg bg-gray-900 text-white text-center active:scale-[0.98] transition-transform"
            >
              Get alerts
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
