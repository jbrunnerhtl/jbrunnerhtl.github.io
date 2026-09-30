// Language-independent facts, sourced from https://github.com/jbrunnerhtl
// (profile README, public repositories, their READMEs and source trees).
// Translatable copy (titles, descriptions, notes) lives in src/i18n/dictionaries.

import type { Dictionary } from "@/i18n/dictionaries/en";

export type ProjectId = keyof Dictionary["projects"]["items"];
export type RepoName = keyof Dictionary["projects"]["repoNotes"];

export interface ProjectItem {
  id: ProjectId;
  repo: string;
  language: string;
  stack: string[];
  demoUrl?: string;
  year: string;
  /** Full repository URL, for projects outside the profile (e.g. school organizations). */
  repoUrl?: string;
  /** Short repository name shown on the card instead of `repo`. */
  repoLabel?: string;
  /** Number of team members; solo projects leave it out. */
  teamSize?: number;
}

export interface SkillGroup {
  id: keyof Dictionary["skills"]["groups"];
  items: string[];
}

const GITHUB = "https://github.com/jbrunnerhtl";

export const PORTFOLIO_DATA = {
  profile: {
    name: "Jan Brunner",
    givenName: "Jan",
    familyName: "Brunner",
    handle: "jbrunnerhtl",
    email: "brunnerjan1102@gmail.com",
    school: "HTL Leonding",
    schoolUrl: "https://www.htl-leonding.at/",
    codingSince: 2022,
    githubUrl: GITHUB,
  },
  // Used when the GitHub API is unreachable at build time.
  fallbackStats: {
    publicRepos: 26,
    followers: 11,
  },
  projects: [
    {
      id: "driving-planner",
      repo: "sommerprojekt-wmc-summer-project-brunner-mostbauer-maric",
      repoUrl:
        "https://github.com/2526-wmc-3bhif-classroom-org/sommerprojekt-wmc-summer-project-brunner-mostbauer-maric",
      repoLabel: "brunner-mostbauer-maric",
      language: "TypeScript",
      stack: ["Vue", "TypeScript", "PrimeVue", "Pinia", "Express", "SQLite", "JWT", "Docker"],
      year: "2026",
      teamSize: 3,
    },
    {
      id: "flashcards",
      repo: "2526-3bhif-syp-project-flashcards",
      repoUrl: "https://github.com/2526-3bhif-syp/2526-3bhif-syp-project-flashcards",
      repoLabel: "project-flashcards",
      language: "Java",
      stack: ["Java", "JavaFX", "Jackson", "JUnit", "Mockito", "Maven"],
      demoUrl: "https://2526-3bhif-syp.github.io/2526-3bhif-syp-project-flashcards/",
      year: "2026",
      teamSize: 4,
    },
    {
      id: "vector-viewer",
      repo: "3d-vector-graphic",
      language: "C#",
      stack: ["C#", ".NET 10", "Raylib-cs"],
      year: "2026",
    },
    {
      id: "crow",
      repo: "Crow-demo-backend",
      language: "C++",
      stack: ["C++", "Crow", "CMake", "REST"],
      year: "2026",
    },
    {
      id: "driving-tracker",
      repo: "DrivingTracker",
      language: "Java",
      stack: ["Java", "JavaFX", "H2", "JUnit", "Maven"],
      demoUrl: "https://jbrunnerhtl.github.io/Driving_Tracker_Java_Docs/",
      year: "2026",
    },
    {
      id: "rpn",
      repo: "RpnCalculator",
      language: "C#",
      stack: ["C#", ".NET 8", "Avalonia", "xUnit"],
      year: "2025",
    },
  ] satisfies ProjectItem[],
  moreRepos: [
    { name: "quarus-db-syp", language: "Java" },
    { name: "Rust-Todo-List", language: "Rust" },
    { name: "Address-Book", language: "Java" },
    { name: "Project-Fitness-and-Health", language: "HTML" },
    { name: "Medical", language: "Java" },
    { name: "Cryptographie", language: "C#" },
    { name: "Leetcode", language: "C#" },
  ] satisfies { name: RepoName; language: string }[],
  skills: [
    { id: "languages", items: ["Java", "TypeScript", "C#", "C++", "Rust", "SQL", "PL/SQL", "Shell"] },
    { id: "frameworks", items: ["React", "Express", "JavaFX", "Quarkus", "Avalonia", "Crow"] },
    { id: "data", items: ["PostgreSQL", "SQLite", "H2"] },
    { id: "tooling", items: ["Git", "Docker", "Kubernetes", "Maven", "CMake", "AsciiDoc", "Linux"] },
  ] satisfies SkillGroup[],
};

export const repoUrl = (repo: string) => `${GITHUB}/${repo}`;
