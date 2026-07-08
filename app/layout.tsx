import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/data";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — GSoC, Outreachy, LFX & more deadlines`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Live application status for every major open source program — GSoC, Outreachy, LFX Mentorship, MLH Fellowship, Hacktoberfest and more. Deadlines, stipends, eligibility, and email alerts.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 shrink-0">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>OS Programs Tracker</span>
            </Link>
            <SiteNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 space-y-2">
            <p>
              Free, open source, and accuracy-first. Statuses are computed live from verified
              dates — never hand-set. Always confirm on the official program page before applying.
            </p>
            <p>
              GSoC historical org data via{" "}
              <a
                href="https://www.gsocorganizations.dev/"
                className="underline hover:text-gray-700"
                rel="noopener"
              >
                gsocorganizations.dev
              </a>
              . Built with Next.js, Neon, and Resend.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
