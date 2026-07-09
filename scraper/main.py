"""
Change-detection scraper for program timeline pages.

For each watched URL: fetch, strip boilerplate, hash the text, and compare
against the committed snapshot in scraper/snapshots/. If anything changed,
open a GitHub issue (via `gh` CLI) so the maintainer can verify the new
dates and update the cohorts table in Neon. Statuses are never scraped —
only humans write dates, the site computes status.

Second job: refresh the curated orgs table from gsocorganizations.dev.

Env: GH_TOKEN (for gh CLI), DATABASE_URL (optional, for the org upsert).
"""

import hashlib
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
SNAPSHOTS = ROOT / "snapshots"
USER_AGENT = "OSProgramsTracker/1.0 (+https://github.com/ikshantshukla/List-of-OpenSource-Programs)"
TIMEOUT = 20
SLEEP_BETWEEN = 2


def get_database_url() -> str | None:
    """DATABASE_URL, tolerating surrounding quotes/whitespace (common when
    the value is copy-pasted from a .env file into a CI secret)."""
    url = os.environ.get("DATABASE_URL", "").strip().strip("'\"").strip()
    return url or None


def extract_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)


def check_pages() -> list[dict]:
    watchlist = json.loads((ROOT / "watchlist.json").read_text())
    SNAPSHOTS.mkdir(exist_ok=True)
    changed = []

    for program in watchlist["programs"]:
        for i, url in enumerate(program["urls"]):
            snap_id = program["id"] if i == 0 else f"{program['id']}-{i}"
            snap_file = SNAPSHOTS / f"{snap_id}.txt"
            try:
                resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
                resp.raise_for_status()
            except requests.RequestException as exc:
                print(f"[warn] {program['id']}: fetch failed for {url}: {exc}", file=sys.stderr)
                continue

            text = extract_text(resp.text)
            new_hash = hashlib.sha256(text.encode()).hexdigest()
            old_hash = None
            if snap_file.exists():
                old = snap_file.read_text()
                old_hash = hashlib.sha256(old.encode()).hexdigest()

            if new_hash != old_hash:
                snap_file.write_text(text)
                if old_hash is not None:  # first run just primes snapshots
                    changed.append({"id": program["id"], "url": url})
                    print(f"[changed] {program['id']}: {url}")
                else:
                    print(f"[primed] {program['id']}: {url}")
            else:
                print(f"[ok] {program['id']}: {url}")

            time.sleep(SLEEP_BETWEEN)

    return changed


def open_issue(changed: list[dict]) -> None:
    ids = ", ".join(sorted({c["id"] for c in changed}))
    title = f"Program page changed: {ids}"
    lines = [
        "The weekly scrape detected content changes on these program pages.",
        "Verify whether application dates changed and update the `cohorts` table in Neon.",
        "",
    ]
    for c in changed:
        lines.append(f"- **{c['id']}**: {c['url']}")
    lines += [
        "",
        "_Reminder: only verified dates go in the DB. ISR picks up changes within an hour._",
    ]
    body = "\n".join(lines)
    try:
        subprocess.run(
            ["gh", "issue", "create", "--title", title, "--body", body],
            check=True,
        )
        print(f"[issue] opened: {title}")
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        print(f"[warn] could not open GitHub issue: {exc}", file=sys.stderr)


def sync_orgs() -> None:
    """Refresh org records from gsocorganizations.dev for orgs already curated in Neon."""
    database_url = get_database_url()
    if not database_url:
        print("[orgs] DATABASE_URL not set — skipping org sync")
        return
    try:
        import psycopg2
    except ImportError:
        print("[orgs] psycopg2 not installed — skipping org sync", file=sys.stderr)
        return

    try:
        resp = requests.get(
            "https://api.gsocorganizations.dev/organizations.json",
            headers={"User-Agent": USER_AGENT},
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
        remote_orgs = resp.json()
    except (requests.RequestException, ValueError) as exc:
        print(f"[orgs] fetch failed: {exc}", file=sys.stderr)
        return

    by_name = {o.get("name", "").strip().lower(): o for o in remote_orgs}

    try:
        conn = psycopg2.connect(database_url)
    except Exception as exc:
        print(f"[orgs] DB connection failed — skipping org sync: {exc}", file=sys.stderr)
        return
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM orgs")
    updated = 0
    for org_id, name in cur.fetchall():
        remote = by_name.get(name.strip().lower())
        if not remote:
            continue
        years = sorted(int(y) for y in remote.get("years", {}).keys() if str(y).isdigit())
        tech = remote.get("technologies", [])[:8]
        cur.execute(
            "UPDATE orgs SET gsoc_years = %s, tech = %s, source = 'gsocorganizations.dev' WHERE id = %s",
            (years, tech, org_id),
        )
        updated += 1
    conn.commit()
    cur.close()
    conn.close()
    print(f"[orgs] refreshed {updated} orgs from gsocorganizations.dev")


# Org slug -> Outreachy community slug, where they differ.
OUTREACHY_ALIASES = {
    "mozilla": "firefox",
    "cncf": "cncf-tracing",
    "linux-foundation": "linux-kernel",
}
OUTREACHY_RECENT_ROUNDS = 6


def sync_outreachy() -> None:
    """Set/unset the 'outreachy' flag on orgs based on participation in recent cohorts.

    Source: outreachy.org/past-projects/ -> last N round pages -> /communities/<slug>/ links.
    """
    database_url = get_database_url()
    if not database_url:
        print("[outreachy] DATABASE_URL not set — skipping")
        return
    try:
        import psycopg2
    except ImportError:
        print("[outreachy] psycopg2 not installed — skipping", file=sys.stderr)
        return

    import re

    headers = {"User-Agent": USER_AGENT}
    try:
        index = requests.get("https://www.outreachy.org/past-projects/", headers=headers, timeout=TIMEOUT).text
    except requests.RequestException as exc:
        print(f"[outreachy] index fetch failed: {exc}", file=sys.stderr)
        return

    round_paths = re.findall(r'href="(/[^"]+)"[^>]*>[^<]*internship (?:cohort|round)<', index)
    recent = round_paths[-OUTREACHY_RECENT_ROUNDS:]

    communities: set[str] = set()
    for path in recent:
        try:
            page = requests.get(f"https://www.outreachy.org{path}", headers=headers, timeout=TIMEOUT).text
            communities.update(re.findall(r"/communities/([a-z0-9-]+)/", page))
        except requests.RequestException as exc:
            print(f"[outreachy] round fetch failed {path}: {exc}", file=sys.stderr)
        time.sleep(SLEEP_BETWEEN)
    communities.discard("cfp")
    if not communities:
        print("[outreachy] no communities found — page structure may have changed; skipping")
        return

    try:
        conn = psycopg2.connect(database_url)
    except Exception as exc:
        print(f"[outreachy] DB connection failed — skipping: {exc}", file=sys.stderr)
        return
    cur = conn.cursor()
    cur.execute("SELECT id, slug, programs FROM orgs")
    changed = 0
    for org_id, slug, progs in cur.fetchall():
        progs = progs or []
        participates = (OUTREACHY_ALIASES.get(slug, slug)) in communities
        has_flag = "outreachy" in progs
        if participates and not has_flag:
            progs = progs + ["outreachy"]
        elif not participates and has_flag:
            progs = [p for p in progs if p != "outreachy"]
        else:
            continue
        cur.execute("UPDATE orgs SET programs = %s WHERE id = %s", (progs, org_id))
        changed += 1
        print(f"[outreachy] {slug}: outreachy={'on' if participates else 'off'}")
    conn.commit()
    cur.close()
    conn.close()
    print(f"[outreachy] {len(communities)} communities across last {len(recent)} rounds; {changed} org(s) updated")


if __name__ == "__main__":
    changed = check_pages()
    if changed:
        open_issue(changed)
    sync_orgs()
    sync_outreachy()
    print(f"Done. {len(changed)} page(s) changed.")
