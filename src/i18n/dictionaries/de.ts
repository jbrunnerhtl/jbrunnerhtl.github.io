import type { Dictionary } from "./en";

// Deutsche Texte. Muss exakt dieselbe Struktur wie en.ts haben (prüft der Typ Dictionary).

export const de: Dictionary = {
  meta: {
    title: "Jan Brunner — Softwareentwicklung, HTL Leonding",
    description:
      "Portfolio von Jan Brunner, Schüler der Softwareentwicklung an der HTL Leonding (Oberösterreich). Projekte in Java, TypeScript, C#, C++ und Rust von github.com/jbrunnerhtl.",
    ogDescription: "Projekte und Skills von Jan Brunner, HTL Leonding.",
    keywords: ["Jan Brunner", "jbrunnerhtl", "HTL Leonding", "Softwareentwicklung", "Portfolio", "Oberösterreich", "Java", "TypeScript", "C#", "C++", "Rust"],
  },
  profile: {
    location: "Oberösterreich",
    jobTitle: "Schüler der Softwareentwicklung",
    heroLine: "Softwareentwicklung · HTL Leonding, Oberösterreich",
  },
  nav: {
    about: "Über mich",
    projects: "Projekte",
    skills: "Skills",
    contact: "Kontakt",
    sections: "Abschnitte",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    github: "GitHub-Profil",
    email: "E-Mail schreiben",
    home: "Jan Brunner, Startseite",
    language: "Sprache",
    lightMode: "Zum hellen Modus wechseln",
    darkMode: "Zum dunklen Modus wechseln",
  },
  hero: {
    role: "Entwickler",
    roles: ["Schüler", "Backend-Dev", "App-Bauer", "Tüftler"],
    tagline:
      "Ich baue Software über den ganzen Stack: Java-Desktop-Apps, TypeScript-APIs, C++-Backends und Services mit Docker und Kubernetes.",
    viewProjects: "Projekte ansehen",
    statRepos: "Öffentliche Repositories",
    statContest: "Cloudflight Contest 2024",
    statYears: "{n}+ Jahre",
    statSince: "Programmiert seit {year}",
    statsLabel: "GitHub",
    statsTitle: "Meine Arbeit",
    statsTitleHighlight: "in Zahlen.",
    statLanguages: "Meistgenutzt auf GitHub",
    scrollHint: "Zu den Projekten scrollen",
  },
  about: {
    label: "Über mich",
    title: "Ein Schüler, der Dinge gern",
    titleHighlight: "von Anfang bis Ende baut.",
    p1Before: "Ich bin Jan Brunner und lerne Softwareentwicklung an der ",
    p1Highlight: "HTL Leonding",
    p1After:
      " in Oberösterreich. Ich programmiere seit {year}. Die meisten meiner Projekte entstehen in der Schule, und ich nutze sie, um neue Sprachen und Frameworks auszuprobieren.",
    p2: "Auf GitHub findest du JavaFX-Desktop-Apps mit eingebetteten Datenbanken, Express-APIs mit JWT-Auth, ein C++-Backend auf Basis von Crow und Quarkus-Services auf Kubernetes. Dokumentation schreibe ich als Code mit AsciiDoc und veröffentliche sie auf GitHub Pages.",
    timeline: "Werdegang",
    milestones: [
      {
        year: "2024",
        title: "Cloudflight Coding Contest — Top 15",
        description: "Platz unter den Top 15 beim Cloudflight Coding Contest.",
      },
      {
        year: "2022 — heute",
        title: "HTL Leonding",
        description:
          "Ausbildung in Softwareentwicklung in Oberösterreich: Java, C#, Datenbanken, Web- und Systemprogrammierung.",
      },
      {
        year: "2022",
        title: "Die ersten Zeilen Code",
        description: "Mit dem Programmieren angefangen und nie wieder aufgehört.",
      },
    ],
  },
  projects: {
    label: "Projekte",
    title: "Ausgewählte Arbeiten,",
    titleHighlight: "direkt von GitHub.",
    intro:
      "Sechs Repositories, die das meiste abdecken, womit ich arbeite: Desktop-Apps, Web-Apps und Backends.",
    live: "Live",
    view: "Projekt ansehen",
    moreTitle: "Kleinere Projekte und Schularbeiten auf GitHub.",
    mockupLabel: "Codeausschnitt aus {file} von {title}",
    team: "Team · {n}",
    more: "Weitere Repositories",
    all: "Alle {n} Repositories",
    items: {
      "driving-planner": {
        title: "Driving Planner",
        summary: "Eine Full-Stack-Web-App, die Fahrschüler mit Fahrschulen in der Nähe verbindet und ihre Ausbildung begleitet.",
        description:
          "Eine Full-Stack-Web-App für Fahrschüler und Fahrschulen. Man findet Fahrschulen in der Nähe (Geocoding über OpenStreetMap), meldet sich für Programme an, erfasst gefahrene Kilometer, Termine und Aufgaben und bewertet Fahrschulen, während Fahrschulen ihre eigene Seite verwalten. Ein Vue-3-Frontend mit PrimeVue, Pinia und Deutsch/Englisch spricht mit einer Express-REST-API mit SQLite, JWT und Swagger-Doku, gestartet mit Docker Compose.",
      },
      flashcards: {
        title: "Flashcards",
        summary: "Eine JavaFX-Lern-App, die Karten, bei denen du dir schwertust, öfter abfragt.",
        description:
          "Eine JavaFX-Desktop-App zum Lernen mit digitalen Karteikarten, sortiert in Stapel. Sie wählt Karten mit einem gewichteten Auswahl-Algorithmus, zählt Lern-Streaks und Statistiken, importiert und exportiert Stapel und speichert sie als JSON mit Jackson. Gebaut nach dem MVP-Pattern, auf Deutsch und Englisch, mit hellem und dunklem Theme und Tests mit JUnit und Mockito.",
      },
      "vector-viewer": {
        title: "3D-Vektor-Viewer",
        summary: "3D-Vektoren mit Schiebereglern bauen und live um eine kreisende Kamera beobachten.",
        description:
          "Ein interaktiver 3D-Vektor-Viewer in C# mit Raylib-cs. Vektoren hinzufügen, Start- und Endpunkt per Slider setzen und live in einem mitwachsenden, beschrifteten Koordinatengitter mit kreisender Kamera verfolgen.",
      },
      crow: {
        title: "Crow Demo Backend",
        summary: "Eine kleine C++-REST-API für Laptops und Server auf Basis des Crow-Frameworks.",
        description:
          "Ein REST-Backend in C++ auf dem Crow-Framework, das Geräte (Laptops und Server) aus einem In-Memory-Speicher nach dem Repository-Pattern ausliefert. Gebaut mit CMake FetchContent.",
      },
      "driving-tracker": {
        title: "DrivingTracker",
        summary: "Ein JavaFX-Fahrtenbuch für Übungsfahrten, das den Fortschritt zum L17-Kilometerziel zeigt.",
        description:
          "Eine JavaFX-Desktop-App, um Fahrten zu erfassen und Fahrstatistiken anzuzeigen. Die Daten liegen in einer eingebetteten H2-Datenbank, dazu gibt es JUnit-Tests und eine eigene Dokumentationsseite.",
      },
      rpn: {
        title: "RPN-Rechner",
        summary: "Ein UPN-Taschenrechner in C# und Avalonia, der den Stack auch als Graph zeichnen kann.",
        description:
          "Ein Desktop-Rechner für umgekehrte polnische Notation in C# mit Avalonia UI. Er hat Stack-Operationen, Tastatureingabe, eine Graph-Ansicht und getrennte Projekte für Core, Logik und Tests.",
      },
    },
    repoNotes: {
      "quarus-db-syp": "Quarkus + PostgreSQL auf Kubernetes",
      "Rust-Todo-List": "CLI-To-do-App mit clap & serde",
      "Project-Fitness-and-Health": "Team-Website mit Trainingsplänen & Shop",
      "Address-Book": "JavaFX-Kontakte mit H2",
      Medical: "JavaFX-Wartezimmer-Verwaltung",
      Cryptographie: "Verschlüsselungs-Konsolenapp",
      Leetcode: "LeetCode-Lösungen",
    },
  },
  skills: {
    label: "Skills",
    title: "Damit habe ich",
    titleHighlight: "bisher gebaut.",
    intro: "Alles hier kommt in mindestens einem meiner öffentlichen Repositories vor.",
    groups: {
      languages: "Sprachen",
      frameworks: "Frameworks",
      data: "Daten",
      tooling: "Werkzeuge",
    },
  },
  contact: {
    label: "Kontakt",
    title: "Lass uns",
    titleHighlight: "etwas bauen.",
    text: "Offen für Zusammenarbeit, Praktika und spannende Probleme. Schreib mir eine E-Mail oder finde mich auf GitHub.",
    email: "E-Mail schreiben",
    copy: "E-Mail-Adresse kopieren",
    copied: "Kopiert!",
    follow: "GitHub",
    followers: "{n} Follower und es werden mehr",
  },
  notFound: {
    title: "Seite nicht gefunden",
    heading: "Diese Seite gibt es nicht.",
    text: "Der Link ist vielleicht kaputt, oder die Seite wurde verschoben.",
    back: "Zurück zur Startseite",
  },
};
