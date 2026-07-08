import type { Metadata } from "next";
import { getOrgs, SITE_URL } from "@/lib/data";
import OrgExplorer from "@/components/OrgExplorer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Find your target organization — GSoC, Outreachy & LFX orgs by tech stack",
  description:
    "Pick the org to start contributing to now to prepare for GSoC, Outreachy, or LFX. Filter multi-year participant organizations by tech stack, with good-first-issue and chat links.",
  alternates: { canonical: `${SITE_URL}/orgs` },
};

export default async function OrgsPage() {
  const orgs = await getOrgs();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Find your target organization
        </h1>
        <p className="text-gray-500 max-w-2xl">
          The best preparation for GSoC or Outreachy is contributing <em>before</em> applications
          open. These orgs participate year after year — pick one matching your stack and start
          with a good first issue.
        </p>
      </header>
      <OrgExplorer orgs={orgs} />
      <p className="text-xs text-gray-400 pt-4">
        GSoC historical participation data via{" "}
        <a href="https://www.gsocorganizations.dev/" rel="noopener" className="underline">
          gsocorganizations.dev
        </a>
        .
      </p>
    </div>
  );
}
