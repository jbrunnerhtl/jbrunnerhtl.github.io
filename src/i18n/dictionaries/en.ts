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
    jobTitle: "Software Development Student",
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
    email: "Send an email",
    home: "Jan Brunner, home",
    language: "Language",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
  },
  hero: {
    // "Developer" with a line, then "+ <role>", cycling through the roles.
    role: "Developer",
    roles: ["Student", "Backend Dev", "App Builder", "Tinkerer"],
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
    scrollHint: "Scroll to projects",
  },
  about: {
    label: "About me",
    greeting: "Hi there",
    message: "Send me a message",
    photoAlt: "Jan Brunner's profile picture: a glowing spiral galaxy",
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
    view: "View project",
    moreTitle: "Smaller projects and school work on GitHub.",
    mockupLabel: "Code excerpt from {file} of {title}",
    team: "Team · {n}",
    more: "More repositories",
    all: "All {n} repositories",
    page: {
      features: "Features",
      built: "How it's built",
      code: "From the code",
      facts: "Details",
      language: "Language",
      year: "Year",
      team: "Team",
      solo: "Solo",
      people: "{n} people",
      stack: "Stack",
      github: "View on GitHub",
      next: "Next project",
      back: "All projects",
      source: "Source",
    },
    page: {
      features: "Features",
      built: "How it's built",
      code: "From the code",
      facts: "Details",
      language: "Language",
      year: "Year",
      team: "Team",
      solo: "Solo",
      people: "{n} people",
      stack: "Stack",
      github: "View on GitHub",
      next: "Next project",
      back: "All projects",
      source: "Source",
    },
    items: {
      "driving-planner": {
        title: "Driving Planner",
        summary: "A full-stack web app that connects learner drivers with nearby driving schools and follows their training.",
        description:
          "A full-stack web app for learner drivers and driving schools. Users find nearby schools (geocoded via OpenStreetMap), enroll in programs, log driven kilometers, events and tasks, and rate schools, while schools manage their own page. Vue 3 with PrimeVue, Pinia and English/German i18n talks to an Express REST API with SQLite, JWT and Swagger docs, all started with Docker Compose.",
        features: [
          "Find driving schools near you, sorted by their distance from your location.",
          "Enroll in a school's programs and follow your training.",
          "Log driven kilometres, driving lessons and other events, and tasks.",
          "Rate and comment on driving schools.",
          "School owners manage their own school page.",
          "An English and German interface with profile pictures.",
        ],
        built: [
          "The frontend is a Vue 3 single-page app with PrimeVue components, Pinia stores, Vue Router and vue-i18n for English and German. It talks to an Express 5 REST API written in TypeScript.",
          "The backend is organised by feature (schools, programs, enrollments, kilometre log, events, tasks, ratings, users, auth), each with a router, a service and a repository. Data lives in SQLite through better-sqlite3, wrapped in a small unit-of-work class that runs each change in a transaction. Passwords are hashed with bcrypt, requests are authenticated with JWT, and Swagger documents every endpoint.",
          "Schools without coordinates are geocoded in the background with OpenStreetMap's Nominatim, one request per second to respect its usage policy. Docker Compose starts the whole stack, for development with hot reload or as a release, and Jest tests cover the main routers.",
        ],
        snippetNotes: [
          "The Haversine formula gives the straight-line distance between a user and each school.",
          "Missing coordinates are looked up with Nominatim, waiting a second between requests.",
        ],
        features: [
          "Find driving schools near you, sorted by their distance from your location.",
          "Enroll in a school's programs and follow your training.",
          "Log driven kilometres, driving lessons and other events, and tasks.",
          "Rate and comment on driving schools.",
          "School owners manage their own school page.",
          "An English and German interface with profile pictures.",
        ],
        built: [
          "The frontend is a Vue 3 single-page app with PrimeVue components, Pinia stores, Vue Router and vue-i18n for English and German. It talks to an Express 5 REST API written in TypeScript.",
          "The backend is organised by feature (schools, programs, enrollments, kilometre log, events, tasks, ratings, users, auth), each with a router, a service and a repository. Data lives in SQLite through better-sqlite3, wrapped in a small unit-of-work class that runs each change in a transaction. Passwords are hashed with bcrypt, requests are authenticated with JWT, and Swagger documents every endpoint.",
          "Schools without coordinates are geocoded in the background with OpenStreetMap's Nominatim, one request per second to respect its usage policy. Docker Compose starts the whole stack, for development with hot reload or as a release, and Jest tests cover the main routers.",
        ],
        snippetNotes: [
          "The Haversine formula gives the straight-line distance between a user and each school.",
          "Missing coordinates are looked up with Nominatim, waiting a second between requests.",
        ],
      },
      flashcards: {
        title: "Flashcards",
        summary: "A JavaFX learning app that asks the cards you struggle with more often.",
        description:
          "A JavaFX desktop app for learning with digital flashcards sorted into decks. It picks cards with a weighted selection algorithm, tracks study streaks and statistics, imports and exports decks and stores them as JSON with Jackson. Built with the MVP pattern, in English and German, with light and dark themes and JUnit and Mockito tests.",
        features: [
          "Organise cards in decks with icons; cards can hold images and audio.",
          "Study mode picks the next card by weight: cards you got wrong or found hard come back more often.",
          "Rate every answer as wrong, hard, OK or easy.",
          "Statistics per rating and per day, for the last day, week, month or all time, plus a study streak.",
          "Import and export cards and decks as JSON, with a dialog for duplicates.",
          "English and German, light and dark theme, switchable at any time.",
        ],
        built: [
          "A JavaFX desktop app structured as Model–View–Presenter. The views are built in Java code, and a presenter connects them to the model.",
          "Card selection is a strategy: a CardSelector uses a random or a weighted algorithm behind one interface. A rating sets the card's weight, from 8 for wrong down to 1 for easy, and the weighted algorithm draws each card with a probability proportional to its weight.",
          "Decks, study records and streaks are stored as JSON with Jackson. Translations and theme colors come from provider classes the views bind to, so language and theme change live. JUnit 5 and Mockito test the model, the persistence and the translations. It was built by a team of four as a school project, with user stories, a specification and meeting minutes written in AsciiDoc and published on GitHub Pages.",
        ],
        snippetNotes: [
          "A rating decides how often the card comes back.",
          "Statistics can be narrowed to the last day, week or month.",
        ],
        features: [
          "Organise cards in decks with icons; cards can hold images and audio.",
          "Study mode picks the next card by weight: cards you got wrong or found hard come back more often.",
          "Rate every answer as wrong, hard, OK or easy.",
          "Statistics per rating and per day, for the last day, week, month or all time, plus a study streak.",
          "Import and export cards and decks as JSON, with a dialog for duplicates.",
          "English and German, light and dark theme, switchable at any time.",
        ],
        built: [
          "A JavaFX desktop app structured as Model–View–Presenter. The views are built in Java code, and a presenter connects them to the model.",
          "Card selection is a strategy: a CardSelector uses a random or a weighted algorithm behind one interface. A rating sets the card's weight, from 8 for wrong down to 1 for easy, and the weighted algorithm draws each card with a probability proportional to its weight.",
          "Decks, study records and streaks are stored as JSON with Jackson. Translations and theme colors come from provider classes the views bind to, so language and theme change live. JUnit 5 and Mockito test the model, the persistence and the translations. It was built by a team of four as a school project, with user stories, a specification and meeting minutes written in AsciiDoc and published on GitHub Pages.",
        ],
        snippetNotes: [
          "A rating decides how often the card comes back.",
          "Statistics can be narrowed to the last day, week or month.",
        ],
      },
      "vector-viewer": {
        title: "3D Vector Viewer",
        summary: "Build 3D vectors with sliders and watch them update live around an orbiting camera.",
        description:
          "An interactive 3D vector viewer in C# with Raylib-cs. Add vectors, set their start and end points with sliders and watch them update live in an auto-scaling, labeled coordinate grid under an orbiting camera.",
        features: [
          "Add and remove vectors with a click; each new vector gets its own color.",
          "Sliders for the start and end point: X, Y and Z from −5 to 5 in steps of 0.1.",
          "A list of all vectors; click one to select and edit it.",
          "A grid that grows with the vectors, labeled along the X and Z axes.",
          "An orbiting camera with mouse-wheel zoom, on Linux, Windows and macOS.",
        ],
        built: [
          "Written in C# on .NET 10 with Raylib-cs, the C# bindings for raylib. The solution has two projects: a console app with the window, the camera and the main loop, and a class library with the vector model, the side panel, the grid and a drawing extension.",
          "Every frame, the grid is sized to the largest vector, each vector is drawn as a cylinder with a cone as its head, and the axis labels are projected from 3D into screen coordinates. The panel with its buttons, sliders and list is drawn directly with raylib, without a UI framework.",
        ],
        snippetNotes: [
          "An extension method draws a vector as a thin cylinder with a cone as its arrowhead.",
          "Axis labels are projected into screen space and skipped when they are behind the camera.",
        ],
        features: [
          "Add and remove vectors with a click; each new vector gets its own color.",
          "Sliders for the start and end point: X, Y and Z from −5 to 5 in steps of 0.1.",
          "A list of all vectors; click one to select and edit it.",
          "A grid that grows with the vectors, labeled along the X and Z axes.",
          "An orbiting camera with mouse-wheel zoom, on Linux, Windows and macOS.",
        ],
        built: [
          "Written in C# on .NET 10 with Raylib-cs, the C# bindings for raylib. The solution has two projects: a console app with the window, the camera and the main loop, and a class library with the vector model, the side panel, the grid and a drawing extension.",
          "Every frame, the grid is sized to the largest vector, each vector is drawn as a cylinder with a cone as its head, and the axis labels are projected from 3D into screen coordinates. The panel with its buttons, sliders and list is drawn directly with raylib, without a UI framework.",
        ],
        snippetNotes: [
          "An extension method draws a vector as a thin cylinder with a cone as its arrowhead.",
          "Axis labels are projected into screen space and skipped when they are behind the camera.",
        ],
      },
      crow: {
        title: "Crow Demo Backend",
        summary: "A small C++ REST API for laptops and servers, built on the Crow framework.",
        description:
          "A C++ REST backend on the Crow framework that serves devices (laptops and servers) from a repository-pattern in-memory store. Built with CMake FetchContent.",
        features: [
          "Create, read, update and delete devices under /devices.",
          "Two device types: laptops with their battery life and servers with RAM and cores.",
          "Every JSON body is validated, and errors come back as 400 Bad Request with a message.",
          "Ids are unique; a second device with the same id is rejected.",
          "Ready-made test requests for every endpoint in an .http file.",
        ],
        built: [
          "C++ with the header-only Crow framework, which CMake downloads at build time through FetchContent. A build script configures and builds the project and starts the server on port 3000.",
          "Devices use inheritance: Laptop and Server derive from an abstract Device and override getSpecs(). Storage sits behind an IDeviceRepository interface, implemented in memory, so a database could replace it without touching the routes.",
          "The routes are registered in one small function per HTTP method. Incoming JSON is parsed with Crow's JSON reader and turned into the right device type, or rejected with an explanation.",
        ],
        snippetNotes: [
          "GET /devices returns every device's specification as JSON.",
          "The type field in the body decides which device is created, with its own checks.",
        ],
        features: [
          "Create, read, update and delete devices under /devices.",
          "Two device types: laptops with their battery life and servers with RAM and cores.",
          "Every JSON body is validated, and errors come back as 400 Bad Request with a message.",
          "Ids are unique; a second device with the same id is rejected.",
          "Ready-made test requests for every endpoint in an .http file.",
        ],
        built: [
          "C++17 with the header-only Crow framework, which CMake downloads at build time through FetchContent. A build script configures and builds the project and starts the server on port 3000.",
          "Devices use inheritance: Laptop and Server derive from an abstract Device and override getSpecs(). Storage sits behind an IDeviceRepository interface, implemented in memory, so a database could replace it without touching the routes.",
          "The routes are registered in one small function per HTTP method. Incoming JSON is parsed with Crow's JSON reader and turned into the right device type, or rejected with an explanation.",
        ],
        snippetNotes: [
          "GET /devices returns every device's specification as JSON.",
          "The type field in the body decides which device is created, with its own checks.",
        ],
      },
      "driving-tracker": {
        title: "DrivingTracker",
        summary: "A JavaFX logbook for practice drives that shows the progress towards the L17 kilometre goal.",
        description:
          "A JavaFX desktop app for logging trips and viewing driving statistics. It stores data in an embedded H2 database and has JUnit tests and a dedicated documentation site.",
        features: [
          "Log practice drives: date, start and destination, odometer readings, conditions (day, night, rain, fog, snow, ice …) and notes.",
          "Search trips by city or condition and sort them by date.",
          "See the progress towards the required kilometres: 3,000 km for L17, 1,000 km otherwise.",
          "Statistics for trips this month, the average distance and a chart of the last four calendar weeks.",
          "Import and export all trips as CSV.",
        ],
        built: [
          "In Austria, L17 lets learners drive with an accompanying person from the age of 17, after 3,000 km of practice. DrivingTracker is the logbook for those kilometres.",
          "It is a JavaFX desktop app with FXML views and controllers. The trips live in an observable list, wrapped in a filtered and a sorted list, so the table updates itself when trips are added, searched or re-sorted.",
          "Data is stored in an embedded H2 database with two tables, the trips and their conditions, through plain JDBC and prepared statements. The CSV import skips lines it can't read. JUnit tests cover the trip model, and the documentation is written in AsciiDoc and published as its own site.",
        ],
        snippetNotes: [
          "Two tables: the trips and, for each trip, its driving conditions.",
          "Progress is the total distance divided by the goal of the chosen measure.",
        ],
        features: [
          "Log practice drives: date, start and destination, odometer readings, conditions (day, night, rain, fog, snow, ice …) and notes.",
          "Search trips by city or condition and sort them by date.",
          "See the progress towards the required kilometres: 3,000 km for L17, 1,000 km otherwise.",
          "Statistics for trips this month, the average distance and a chart of the last four calendar weeks.",
          "Import and export all trips as CSV.",
        ],
        built: [
          "In Austria, L17 lets learners drive with an accompanying person from the age of 17, after 3,000 km of practice. DrivingTracker is the logbook for those kilometres.",
          "It is a JavaFX desktop app with FXML views and controllers. The trips live in an observable list, wrapped in a filtered and a sorted list, so the table updates itself when trips are added, searched or re-sorted.",
          "Data is stored in an embedded H2 database with two tables, the trips and their conditions, through plain JDBC and prepared statements. The CSV import skips lines it can't read. JUnit tests cover the trip model, and the documentation is written in AsciiDoc and published as its own site.",
        ],
        snippetNotes: [
          "Two tables: the trips and, for each trip, its driving conditions.",
          "Progress is the total distance divided by the goal of the chosen measure.",
        ],
      },
      rpn: {
        title: "RPN Calculator",
        summary: "A Reverse Polish Notation calculator in C# and Avalonia that can also plot the stack as a graph.",
        description:
          "A desktop Reverse Polish Notation calculator in C# with Avalonia UI. It has stack operations, keyboard input, a graph view and separate core, logic and test projects.",
        features: [
          "Push numbers and calculate with +, −, × and ÷ on a stack of up to five values.",
          "Swap the top values, clear the stack or remove the last digit.",
          "Full keyboard control, including the number pad.",
          "Errors such as too few values, a full stack or division by zero are shown in place.",
          "Graph mode: the stack becomes the coefficients of a polynomial, plotted from −10 to 10.",
        ],
        built: [
          "C# on .NET 8 with Avalonia UI and its dark Fluent theme. The solution has four projects: Core with the calculator interface and exceptions, Logic with the stack calculator and the function evaluator, the app, and xUnit tests.",
          "The interface is built in C# code instead of XAML. Keys are mapped to the same handlers as the buttons, so mouse and keyboard behave the same.",
          "For the graph, the stack is read as the coefficients of c₀ + c₁x + c₂x² + …, evaluated in steps of 0.01 and drawn as line segments on an Avalonia canvas with axes and tick marks.",
        ],
        snippetNotes: [
          "The stack values become the coefficients of a polynomial.",
          "Keyboard shortcuts reuse the button handlers.",
        ],
        features: [
          "Push numbers and calculate with +, −, × and ÷ on a stack of up to five values.",
          "Swap the top values, clear the stack or remove the last digit.",
          "Full keyboard control, including the number pad.",
          "Errors such as too few values, a full stack or division by zero are shown in place.",
          "Graph mode: the stack becomes the coefficients of a polynomial, plotted from −10 to 10.",
        ],
        built: [
          "C# on .NET 8 with Avalonia UI and its dark Fluent theme. The solution has four projects: Core with the calculator interface and exceptions, Logic with the stack calculator and the function evaluator, the app, and xUnit tests.",
          "The interface is built in C# code instead of XAML. Keys are mapped to the same handlers as the buttons, so mouse and keyboard behave the same.",
          "For the graph, the stack is read as the coefficients of c₀ + c₁x + c₂x² + …, evaluated in steps of 0.01 and drawn as line segments on an Avalonia canvas with axes and tick marks.",
        ],
        snippetNotes: [
          "The stack values become the coefficients of a polynomial.",
          "Keyboard shortcuts reuse the button handlers.",
        ],
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
    heading: "Let's build something.",
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
