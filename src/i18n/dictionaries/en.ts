// English copy. Every other locale must match this shape (enforced by the Dictionary type).
// Project facts are sourced from https://github.com/jbrunnerhtl.

export const en = {
  meta: {
    title: "Jan Brunner — Software Development Student",
    description:
      "Portfolio of Jan Brunner, a software development student at HTL Leonding (Upper Austria). Java, TypeScript, C#, C++ and Rust projects from github.com/jbrunnerhtl.",
    ogDescription: "Projects and skills of Jan Brunner, HTL Leonding.",
    keywords: ["Jan Brunner", "jbrunnerhtl", "HTL Leonding", "software development", "portfolio", "Upper Austria", "Java", "TypeScript", "C#", "C++", "Rust"],
  },
  profile: {
    location: "Upper Austria",
    heroLine: "Software Development Student · HTL Leonding, Upper Austria",
  },
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    sections: "Sections",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    github: "GitHub profile",
    language: "Language",
  },
  hero: {
    tagline:
      "I build things across the stack: Java desktop apps, TypeScript APIs, C++ backends and services with Docker and Kubernetes.",
    viewProjects: "View projects",
    statRepos: "Public repositories",
    statContest: "Cloudflight Contest 2024",
    statYears: "{n}+ yrs",
    statSince: "Coding since {year}",
    statsLabel: "GitHub",
    statsTitle: "My work",
    statsTitleHighlight: "in numbers.",
    statLanguages: "Most used on GitHub",
    scrollHint: "Scroll to about",
  },
  about: {
    label: "About",
    title: "A student who likes to",
    titleHighlight: "build things end to end.",
    p1Before: "I'm Jan Brunner, a software development student at ",
    p1Highlight: "HTL Leonding",
    p1After:
      " in Upper Austria. I've been programming since {year}. Most of my projects start at school, and I use them to try out new languages and frameworks.",
    p2: "On GitHub you'll find JavaFX desktop apps with embedded databases, Express APIs with JWT auth, a Crow-based C++ backend and Quarkus services on Kubernetes. I also write documentation as code with AsciiDoc and publish it on GitHub Pages.",
    timeline: "Timeline",
    milestones: [
      {
        year: "2024",
        title: "Cloudflight Coding Contest — Top 15",
        description: "Placed in the top 15 at the Cloudflight Coding Contest.",
      },
      {
        year: "2022 — now",
        title: "HTL Leonding",
        description:
          "Software development education in Upper Austria: Java, C#, databases, web and systems programming.",
      },
      {
        year: "2022",
        title: "First lines of code",
        description: "Started programming and never stopped.",
      },
    ],
  },
  projects: {
    label: "Projects",
    title: "Selected work,",
    titleHighlight: "straight from GitHub.",
    intro:
      "Six repositories covering most of what I work with: desktop apps, web apps and backends.",
    live: "Live",
    team: "Team · {n}",
    more: "More repositories",
    all: "All {n} repositories",
    items: {
      "driving-planner": {
        title: "Driving Planner",
        description:
          "A full-stack web app for learner drivers and driving schools. Users find nearby schools (geocoded via OpenStreetMap), enroll in programs, log driven kilometers, events and tasks, and rate schools, while schools manage their own page. Vue 3 with PrimeVue, Pinia and English/German i18n talks to an Express REST API with SQLite, JWT and Swagger docs, all started with Docker Compose.",
      },
      flashcards: {
        title: "Flashcards",
        description:
          "A JavaFX desktop app for learning with digital flashcards sorted into decks. It picks cards with a weighted selection algorithm, tracks study streaks and statistics, imports and exports decks and stores them as JSON with Jackson. Built with the MVP pattern, in English and German, with light and dark themes and JUnit and Mockito tests.",
      },
      "vector-viewer": {
        title: "3D Vector Viewer",
        description:
          "An interactive 3D vector viewer in C# with Raylib-cs. Add vectors, set their start and end points with sliders and watch them update live in an auto-scaling, labeled coordinate grid under an orbiting camera.",
      },
      crow: {
        title: "Crow Demo Backend",
        description:
          "A C++ REST backend on the Crow framework that serves devices (laptops and servers) from a repository-pattern in-memory store. Built with CMake FetchContent.",
      },
      "driving-tracker": {
        title: "DrivingTracker",
        description:
          "A JavaFX desktop app for logging trips and viewing driving statistics. It stores data in an embedded H2 database and has JUnit tests and a dedicated documentation site.",
      },
      rpn: {
        title: "RPN Calculator",
        description:
          "A desktop Reverse Polish Notation calculator in C# with Avalonia UI. It has stack operations, keyboard input, a graph view and separate core, logic and test projects.",
      },
    },
    repoNotes: {
      "quarus-db-syp": "Quarkus + PostgreSQL on Kubernetes",
      "Rust-Todo-List": "CLI todo app with clap & serde",
      "Project-Fitness-and-Health": "Team website with workout plans & shop",
      "Address-Book": "JavaFX contacts with H2",
      Medical: "JavaFX waiting-room manager",
      Cryptographie: "Encryption console app",
      Leetcode: "LeetCode solutions",
    },
  },
  skills: {
    label: "Skills",
    title: "What I've shipped with",
    titleHighlight: "so far.",
    intro: "Every item here appears in at least one of my public repositories.",
    groups: {
      languages: "Languages",
      frameworks: "Frameworks",
      data: "Data",
      tooling: "Tooling",
    },
  },
  contact: {
    label: "Contact",
    title: "Let's build",
    titleHighlight: "something.",
    text: "Open to collaborations, internships and interesting problems. Write me an email or find me on GitHub.",
    email: "Write an email",
    copy: "Copy email address",
    copied: "Copied!",
    follow: "GitHub",
    followers: "{n} followers and counting",
  },
  notFound: {
    title: "Page not found",
    heading: "This page doesn't exist.",
    text: "The link may be broken, or the page has moved.",
    back: "Back to the homepage",
  },
};

export type Dictionary = typeof en;
