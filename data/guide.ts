/**
 * Content for the /start beginner guide page.
 * Sourced from the repo README's "First-Time Contributors Guide" +
 * "Useful Resources" sections, expanded with additional well-known
 * beginner-friendly projects.
 */

export interface ProjectEntry {
  name: string;
  repo: string; // GitHub URL
  issues: string; // good-first-issue filtered URL
  note: string;
}

export interface LanguageGroup {
  language: string;
  labels: string[]; // issue labels commonly used by these projects
  projects: ProjectEntry[];
}

const gfi = (repo: string, label = "good%20first%20issue") =>
  `${repo}/issues?q=is%3Aopen+is%3Aissue+label%3A%22${label}%22`;

export const projectsByLanguage: LanguageGroup[] = [
  {
    language: "Python",
    labels: ["easy", "newcomer-friendly", "good first issue"],
    projects: [
      { name: "Django", repo: "https://github.com/django/django", issues: "https://code.djangoproject.com/query?status=!closed&easy=1", note: "The classic Python web framework — well-documented contribution process." },
      { name: "pandas", repo: "https://github.com/pandas-dev/pandas", issues: gfi("https://github.com/pandas-dev/pandas"), note: "Data analysis library; many docs and small bug issues." },
      { name: "Matplotlib", repo: "https://github.com/matplotlib/matplotlib", issues: gfi("https://github.com/matplotlib/matplotlib"), note: "Plotting library with a dedicated 'Good first issue' board." },
      { name: "scikit-learn", repo: "https://github.com/scikit-learn/scikit-learn", issues: gfi("https://github.com/scikit-learn/scikit-learn"), note: "ML library; great docs-first contribution culture." },
      { name: "FastAPI", repo: "https://github.com/fastapi/fastapi", issues: gfi("https://github.com/fastapi/fastapi"), note: "Modern API framework; translations and docs welcome newcomers." },
      { name: "Home Assistant", repo: "https://github.com/home-assistant/core", issues: gfi("https://github.com/home-assistant/core"), note: "Huge smart-home project; endless small integrations to improve." },
    ],
  },
  {
    language: "JavaScript / TypeScript",
    labels: ["good first issue", "beginner", "help wanted"],
    projects: [
      { name: "freeCodeCamp", repo: "https://github.com/freeCodeCamp/freeCodeCamp", issues: gfi("https://github.com/freeCodeCamp/freeCodeCamp", "first%20timers%20only"), note: "The most-starred repo on GitHub; built around helping first-timers." },
      { name: "React", repo: "https://github.com/facebook/react", issues: gfi("https://github.com/facebook/react"), note: "The UI library — start with docs and test contributions." },
      { name: "Node.js", repo: "https://github.com/nodejs/node", issues: gfi("https://github.com/nodejs/node"), note: "The runtime itself; has a formal first-contribution guide." },
      { name: "Excalidraw", repo: "https://github.com/excalidraw/excalidraw", issues: gfi("https://github.com/excalidraw/excalidraw"), note: "Popular whiteboard app; approachable React/TS codebase." },
      { name: "Strapi", repo: "https://github.com/strapi/strapi", issues: gfi("https://github.com/strapi/strapi"), note: "Headless CMS; active community and labelled starter issues." },
      { name: "Appsmith", repo: "https://github.com/appsmithorg/appsmith", issues: gfi("https://github.com/appsmithorg/appsmith"), note: "Low-code platform; beginner-friendly and Hacktoberfest regular." },
    ],
  },
  {
    language: "Java / Kotlin",
    labels: ["newbie", "starter", "good first issue"],
    projects: [
      { name: "Spring Framework", repo: "https://github.com/spring-projects/spring-framework", issues: gfi("https://github.com/spring-projects/spring-framework", "status%3A%20first-timers-only"), note: "The backbone of enterprise Java." },
      { name: "Elasticsearch", repo: "https://github.com/elastic/elasticsearch", issues: gfi("https://github.com/elastic/elasticsearch"), note: "Search engine; 'low hanging fruit' labelled issues." },
      { name: "Jenkins", repo: "https://github.com/jenkinsci/jenkins", issues: gfi("https://github.com/jenkinsci/jenkins"), note: "CI server and long-time GSoC org — see its program page here." },
      { name: "Mifos / Fineract", repo: "https://github.com/apache/fineract", issues: gfi("https://github.com/apache/fineract"), note: "Fintech for financial inclusion; popular with Indian contributors." },
    ],
  },
  {
    language: "C / C++",
    labels: ["junior job", "easy", "good first issue"],
    projects: [
      { name: "OpenCV", repo: "https://github.com/opencv/opencv", issues: gfi("https://github.com/opencv/opencv"), note: "Computer vision; also a GSoC org (see org finder)." },
      { name: "Godot Engine", repo: "https://github.com/godotengine/godot", issues: gfi("https://github.com/godotengine/godot"), note: "Game engine with 'junior job' labelled issues." },
      { name: "VLC", repo: "https://code.videolan.org/videolan/vlc", issues: "https://code.videolan.org/videolan/vlc/-/issues", note: "The media player — multimedia C at its most real-world." },
      { name: "ClickHouse", repo: "https://github.com/ClickHouse/ClickHouse", issues: gfi("https://github.com/ClickHouse/ClickHouse"), note: "Analytics database; well-labelled easy tasks." },
    ],
  },
  {
    language: "Go",
    labels: ["good first issue", "help wanted"],
    projects: [
      { name: "Kubernetes", repo: "https://github.com/kubernetes/kubernetes", issues: gfi("https://github.com/kubernetes/kubernetes"), note: "Cloud-native flagship; has a structured contributor ladder + LFX projects." },
      { name: "Gitea", repo: "https://github.com/go-gitea/gitea", issues: gfi("https://github.com/go-gitea/gitea"), note: "Self-hosted Git service; friendly maintainers." },
      { name: "Hugo", repo: "https://github.com/gohugoio/hugo", issues: gfi("https://github.com/gohugoio/hugo"), note: "Static site generator; docs contributions very welcome." },
      { name: "Prometheus", repo: "https://github.com/prometheus/prometheus", issues: gfi("https://github.com/prometheus/prometheus"), note: "Monitoring standard; part of CNCF (see org finder)." },
    ],
  },
  {
    language: "Rust",
    labels: ["E-easy", "good first issue"],
    projects: [
      { name: "Rust (rust-lang)", repo: "https://github.com/rust-lang/rust", issues: "https://github.com/rust-lang/rust/issues?q=is%3Aopen+label%3AE-easy", note: "The compiler itself uses 'E-easy' / 'E-mentor' labels — and Rust is in the current Outreachy cohort." },
      { name: "Bevy", repo: "https://github.com/bevyengine/bevy", issues: gfi("https://github.com/bevyengine/bevy", "D-Trivial"), note: "Game engine; 'D-Trivial' difficulty labels." },
      { name: "Tauri", repo: "https://github.com/tauri-apps/tauri", issues: gfi("https://github.com/tauri-apps/tauri"), note: "Desktop app toolkit; welcoming Discord." },
      { name: "uv / Ruff (Astral)", repo: "https://github.com/astral-sh/ruff", issues: gfi("https://github.com/astral-sh/ruff"), note: "Fast Python tooling written in Rust; very active review cycle." },
    ],
  },
  {
    language: "ML / Data Science",
    labels: ["good first issue", "documentation"],
    projects: [
      { name: "Hugging Face Transformers", repo: "https://github.com/huggingface/transformers", issues: gfi("https://github.com/huggingface/transformers"), note: "The LLM ecosystem hub; docs + model contributions." },
      { name: "PyTorch", repo: "https://github.com/pytorch/pytorch", issues: gfi("https://github.com/pytorch/pytorch"), note: "Deep learning framework; triage-friendly labels." },
      { name: "Keras", repo: "https://github.com/keras-team/keras", issues: gfi("https://github.com/keras-team/keras"), note: "High-level DL API; good-first-issue curated list." },
      { name: "MDAnalysis", repo: "https://github.com/MDAnalysis/mdanalysis", issues: gfi("https://github.com/MDAnalysis/mdanalysis"), note: "Scientific Python; also an Outreachy community." },
    ],
  },
  {
    language: "Absolute first PR",
    labels: ["first-timers-only", "good first issue"],
    projects: [
      { name: "first-contributions", repo: "https://github.com/firstcontributions/first-contributions", issues: "https://github.com/firstcontributions/first-contributions", note: "A repo that exists purely to walk you through your first pull request." },
      { name: "EddieHub", repo: "https://github.com/EddieHubCommunity", issues: "https://github.com/EddieHubCommunity/support/issues", note: "Community built around first-time contributors." },
      { name: "Documentation anywhere", repo: "https://github.com/search?q=label%3A%22good+first+issue%22+label%3Adocumentation&type=issues", issues: "https://github.com/search?q=label%3A%22good+first+issue%22+label%3Adocumentation&type=issues", note: "Most projects need docs — typo fixes and README improvements are real contributions." },
    ],
  },
];

export const nonCodeContributions = [
  { title: "Documentation", desc: "Fix typos, improve READMEs, write tutorials — the most welcomed first contribution everywhere." },
  { title: "Translation", desc: "Translate software and docs (Mozilla, Ethereum.org, and most big projects run translation programs)." },
  { title: "Design", desc: "Logos, UI mockups, graphics — Outreachy even has design internships." },
  { title: "Testing & bug reports", desc: "Reproduce bugs, test release candidates, write clear issue reports." },
  { title: "Community", desc: "Answer questions in forums/Discord, triage issues, organize meetups." },
];

export const learningPath = [
  { period: "Week 1–2", task: "Learn Git & GitHub basics", detail: "Clone, branch, commit, push, open a PR. GitHub Skills' interactive courses are the fastest route." },
  { period: "Week 3–4", task: "Make your first documentation PR", detail: "Pick any project you actually use and improve its README or docs." },
  { period: "Week 5–6", task: "Fix your first small bug", detail: "Filter by 'good first issue' in a language you know. Comment on the issue before you start." },
  { period: "Week 7–8", task: "Apply to beginner-friendly programs", detail: "By now you have real PRs to show. Target the programs marked beginner-friendly on this site." },
];

export const issueLabels = [
  { label: "good first issue", desc: "GitHub's standard beginner label" },
  { label: "help wanted", desc: "Maintainers actively want contributors" },
  { label: "first-timers-only", desc: "Reserved for your very first PR" },
  { label: "documentation", desc: "Usually the gentlest entry point" },
  { label: "hacktoberfest", desc: "Counts toward Hacktoberfest in October" },
  { label: "beginner / easy / newbie", desc: "Difficulty hints, project-specific" },
];

export const resources: { group: string; items: { name: string; url: string; desc: string }[] }[] = [
  {
    group: "Find beginner-friendly issues",
    items: [
      { name: "Good First Issues", url: "https://goodfirstissues.com/", desc: "Aggregates fresh good-first-issue labels across GitHub" },
      { name: "Up For Grabs", url: "https://up-for-grabs.net/", desc: "Projects that actively want new contributors" },
      { name: "First Timers Only", url: "https://www.firsttimersonly.com/", desc: "Issues reserved for first-time contributors" },
      { name: "CodeTriage", url: "https://www.codetriage.com/", desc: "Get a daily issue in your inbox for a project you pick" },
      { name: "Awesome for Beginners", url: "https://github.com/MunGell/awesome-for-beginners", desc: "Curated list of beginner-friendly projects by language" },
      { name: "CLOTributor", url: "https://clotributor.dev/", desc: "Discover CNCF / cloud-native issues to work on" },
    ],
  },
  {
    group: "Learn Git & GitHub",
    items: [
      { name: "GitHub Skills", url: "https://skills.github.com/", desc: "Official interactive tutorials — start here" },
      { name: "Learn Git Branching", url: "https://learngitbranching.js.org/", desc: "Visual, game-like Git practice" },
      { name: "Pro Git Book", url: "https://git-scm.com/book", desc: "The free, complete Git reference" },
    ],
  },
  {
    group: "Understand open source",
    items: [
      { name: "opensource.guide", url: "https://opensource.guide/", desc: "GitHub's complete guide to contributing and maintaining" },
      { name: "How to Contribute", url: "https://opensource.guide/how-to-contribute/", desc: "Step-by-step first contribution walkthrough" },
    ],
  },
  {
    group: "Communities",
    items: [
      { name: "r/opensource", url: "https://www.reddit.com/r/opensource/", desc: "Reddit's open source community" },
      { name: "Dev.to", url: "https://dev.to/t/opensource", desc: "Articles and discussions from contributors" },
      { name: "r/developersIndia", url: "https://www.reddit.com/r/developersIndia/", desc: "Active Indian dev community — GSoC threads every season" },
    ],
  },
];

export const faqs = [
  {
    q: "How do I start contributing to open source with no experience?",
    a: "Learn basic Git first (1–2 weeks), then make a documentation fix to a project you already use. Filter issues by the 'good first issue' label, comment to claim one, and open a small pull request. Your first PR matters more than its size.",
  },
  {
    q: "Which open source program is best for beginners?",
    a: "Hacktoberfest (October) has the lowest barrier — four accepted PRs earns the badge. GSSoC and Season of KDE are gentle structured programs. GSoC and Outreachy are more competitive and expect prior contributions to the org you apply to.",
  },
  {
    q: "Do I need to be a student for GSoC?",
    a: "No — since 2022 GSoC is open to anyone 18+ who is new to open source, not just students. Outreachy is also not student-restricted; it's for people underrepresented in tech.",
  },
  {
    q: "Can I contribute without writing code?",
    a: "Yes. Documentation, translation, design, testing, and community support are all real contributions — and Outreachy explicitly offers non-coding internships.",
  },
  {
    q: "When should I start preparing for GSoC?",
    a: "3–6 months before applications (which open in March). Pick 1–2 organizations from the org finder, start with good-first-issues, and become a known contributor before the application window opens.",
  },
];
