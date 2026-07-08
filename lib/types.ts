export interface Cohort {
  id: number;
  program_id: number;
  name: string;
  opens_at: string | null; // ISO date 'YYYY-MM-DD'
  closes_at: string | null;
  program_start: string | null;
  program_end: string | null;
  dates_announced: boolean;
  expected_note: string | null;
}

export interface Program {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  stipend: string | null;
  duration: string | null;
  eligibility: string | null;
  eligibility_notes: string | null;
  student_only: boolean;
  beginner_friendly: boolean;
  remote: boolean;
  official_url: string;
  apply_url: string | null;
  tech_tags: string[];
  active: boolean;
  cohorts: Cohort[];
}

export interface Org {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  tech: string[];
  gsoc_years: number[];
  programs: string[]; // 'gsoc' | 'outreachy' | 'lfx' | ...
  good_first_issues_url: string | null;
  chat_url: string | null;
  source: string;
}
