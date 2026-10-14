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
    statRepos: "Public repositories",
    statContest: "Cloudflight Contest 2024",
    statYears: "{n}+ yrs",
    statSince: "Coding since {year}",
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
    live: "Live",
    view: "View project",
    moreTitle: "Smaller projects and school work on GitHub.",
    team: "Team · {n}",
    more: "More repositories",
    all: "All {n} repositories",
    page: {
      features: "Features",
      built: "How it's built",
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
        architecture: {
          label: "Architecture of Driving Planner",
          layers: {
            client: { name: "Client · Vue 3" },
            api: {
              name: "API · Express 5",
              note: "One router, service and repository per feature: schools, programs, enrollments, kilometre log, events, tasks, ratings, users, auth",
            },
            data: { name: "Data" },
            background: { name: "Background · External" },
          },
          blocks: {
            views: {
              name: "Views",
              label: "Vue Router · PrimeVue · i18n",
              text: "The pages of the single-page app, built from PrimeVue components and switched by Vue Router. vue-i18n provides English and German.",
            },
            stores: {
              name: "Stores",
              label: "Pinia",
              text: "Pinia stores hold the state that several pages share, such as the driving schools, their ratings and the signed-in user. They load it through the API services.",
            },
            client: {
              name: "API client",
              label: "fetch · 5-minute cache",
              text: "One service per area calls the REST API through a shared client that adds the JWT from the session. Lists such as the driving schools are cached in memory for five minutes.",
            },
            router: {
              name: "Router",
              label: "JWT check · Swagger",
              text: "One Express router per feature. Middleware checks the JWT, and admin-only routes check the role as well. Swagger documents every endpoint.",
            },
            service: {
              name: "Service",
              label: "Logic · Haversine",
              text: "A feature's logic. For each request it opens a unit of work, read-only for reads and with a transaction for changes. The school service sorts schools by their straight-line distance to the user (Haversine formula).",
            },
            repository: {
              name: "Repository",
              label: "SQL per feature",
              text: "Runs a feature's SQL queries through the unit of work the service hands it.",
            },
            uow: {
              name: "Unit of Work",
              label: "one transaction per change",
              text: "Holds one database connection. For changes it opens a transaction, and at the end the service decides whether to commit or roll back.",
            },
            sqlite: {
              name: "SQLite",
              label: "better-sqlite3 · bcrypt",
              text: "All data lives in one SQLite file, accessed with better-sqlite3. Passwords are stored as bcrypt hashes.",
            },
            geocoder: {
              name: "Geocoder",
              label: "runs in the background",
              text: "Starts five seconds after the server. It looks up coordinates for driving schools that have an address but no coordinates yet and writes each result back in its own short transaction.",
            },
            nominatim: {
              name: "Nominatim",
              label: "OpenStreetMap · 1 request/s",
              text: "OpenStreetMap's geocoding service. The geocoder waits one second between requests, as the usage policy requires.",
            },
          },
          links: { rest: "REST · JWT", transaction: "Transaction", coordinates: "Coordinates" },
        },
      },
      flashcards: {
        title: "Flashcards",
        summary: "A JavaFX app for learning with flashcards, with rated answers, statistics and a study streak.",
        description:
          "A JavaFX desktop app for learning with digital flashcards sorted into decks. It quizzes each deck in random order, records a rating for every answer, tracks study streaks and statistics, imports and exports decks and stores them as JSON with Jackson. Built with the MVP pattern, in English and German, with light and dark themes and JUnit and Mockito tests.",
        features: [
          "Organise cards in decks with icons; cards can hold images and audio.",
          "Study mode goes through a deck once, in random order.",
          "Rate every answer as wrong, hard, OK or easy.",
          "Statistics per rating and per day, for the last day, week, month or all time, plus a study streak.",
          "Import and export cards and decks as JSON, with a dialog for duplicates.",
          "English and German, light and dark theme, switchable at any time.",
        ],
        built: [
          "A JavaFX desktop app structured as Model–View–Presenter. The views are built in Java code, and a presenter connects them to the model.",
          "A smarter card selection is prepared as a strategy: a CardSelector uses a random or a weighted algorithm behind one interface. A rating sets the card's weight, from 8 for wrong down to 1 for easy, and the weighted algorithm draws each card with a probability proportional to its weight. Unit tests cover it, but the study mode still shuffles the deck and doesn't use it yet.",
          "Decks, study records and streaks are stored as JSON with Jackson. Translations and theme colors come from provider classes the views bind to, so language and theme change live. JUnit 5 and Mockito test the model, the persistence and the translations. It was built by a team of four as a school project, with user stories, a specification and meeting minutes written in AsciiDoc and published on GitHub Pages.",
        ],
        architecture: {
          label: "Architecture of Flashcards",
          layers: {
            view: { name: "View · JavaFX" },
            presenter: { name: "Presenter" },
            model: { name: "Model" },
            storage: { name: "Storage" },
          },
          blocks: {
            providers: {
              name: "Providers",
              label: "language · theme",
              text: "TranslationProvider and ThemeProvider hold the current language and theme. The views bind their texts and colours to them, so a switch takes effect at once.",
            },
            views: {
              name: "Views",
              label: "built in Java code",
              text: "Every screen (home, decks, study mode, statistics, settings and the dialogs) is built in Java code, without FXML. The views display data and report what the user does.",
            },
            presenter: {
              name: "MainPresenter",
              label: "navigation · search · import",
              text: "One presenter connects the views with the model. It handles navigation with back and forward, the search, and importing and exporting decks, and it updates the views.",
            },
            study: {
              name: "Study mode",
              label: "shuffled queue",
              text: "Puts a deck's cards into a queue in random order and goes through it once. Each answer is rated as wrong, hard, OK or easy and stored with the card.",
            },
            model: {
              name: "Model",
              label: "decks · cards · streak",
              text: "Holds the decks with their cards and study records, and the study streak. It loads and saves them through the persistence layer.",
            },
            stats: {
              name: "Statistics",
              label: "day · week · month · all",
              text: "StatisticsAggregator counts the ratings of one deck or of all decks, for the last day, week or month or for all time.",
            },
            selector: {
              name: "Card selector",
              label: "strategy · not yet wired in",
              text: "A strategy for picking the next card: at random, or weighted so that cards rated wrong (8) or hard (4) come back more often than OK (2) or easy (1) ones, with 3 for unrated cards. Unit tests cover it, but the study mode doesn't use it yet.",
            },
            persistence: {
              name: "Persistence",
              label: "Jackson · JSON",
              text: "Saves the decks and the streak as JSON with Jackson, and imports and exports single cards or whole decks.",
            },
          },
          links: { events: "Events · updates", calls: "Calls", json: "JSON" },
        },
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
        architecture: {
          label: "Architecture of the 3D Vector Viewer",
          layers: {
            app: { name: "App · VectorViewer" },
            frame: { name: "Every frame", note: "Grid, arrows and panel live in the class library VectorViewerClasses" },
            model: { name: "Model" },
          },
          blocks: {
            window: {
              name: "Window & camera",
              label: "raylib · 60 FPS",
              text: "Program.cs opens a resizable, maximised window running at 60 frames per second and sets up a perspective 3D camera aimed at the origin. Then the main loop starts.",
            },
            camera: {
              name: "Camera",
              label: "orbits · zoom",
              text: "Each frame begins by moving the camera along its orbit around the origin. The mouse wheel zooms.",
            },
            grid: {
              name: "Grid",
              label: "grows · axis labels",
              text: "GridSetup sizes the grid to the largest vector and labels the X and Z axes. Each label's 3D position is projected to the screen and left out when it lies behind the camera.",
            },
            arrows: {
              name: "Arrows",
              label: "cylinder · cone",
              text: "In 3D mode every vector is drawn as a thin cylinder with a cone as its tip, by an extension method on Vector3.",
            },
            panel: {
              name: "Panel",
              label: "buttons · sliders · list",
              text: "The side panel is drawn last, directly with raylib and without a UI framework. While it draws its buttons, sliders and list it also handles the mouse, so a change shows in the next frame.",
            },
            vec: {
              name: "Vec",
              label: "start · end · colour",
              text: "A vector is a start point, an end point and a colour. The panel keeps the list and gives each new vector the next colour of a fixed palette.",
            },
          },
          links: { start: "Main loop", next: "Next frame", vectors: "Vectors" },
        },
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
          "Devices use inheritance: Laptop and Server derive from an abstract Device and override getSpecs(). Storage is described by an IDeviceRepository interface and implemented in memory; the routes are given the in-memory class directly.",
          "The routes are registered in one small function per HTTP method. Incoming JSON is parsed with Crow's JSON reader and turned into the right device type, or rejected with an explanation.",
        ],
        architecture: {
          label: "Architecture of the Crow Demo Backend",
          layers: {
            http: { name: "HTTP" },
            app: { name: "Crow app · main.cpp" },
            storage: { name: "Storage" },
          },
          blocks: {
            client: {
              name: "Client",
              label: "e.g. requests.http",
              text: "Any HTTP client. The repository includes ready-made requests for every endpoint in test/requests.http.",
            },
            routes: {
              name: "Routes",
              label: "one function per method",
              text: "create_getRoutes, create_postRoutes, create_putRoutes and create_deleteRoutes each register the /devices routes of one HTTP method on the Crow app.",
            },
            check: {
              name: "check_body",
              label: "validate · pick type",
              text: "Reads the JSON body, checks the required fields and creates a laptop or a server depending on the field type. Every problem becomes a 400 Bad Request with the error message.",
            },
            devices: {
              name: "Laptop · Server",
              label: "inherit from Device",
              text: "Laptop (battery life) and Server (RAM and cores) inherit from the abstract class Device and override getSpecs(), which GET returns as the description.",
            },
            store: {
              name: "InMemoryDeviceRepository",
              label: "std::vector · unique IDs",
              text: "Keeps the devices in a vector in memory. Adding a device whose ID already exists fails, and POST answers it with a 400. The routes are given this class directly.",
            },
            contract: {
              name: "IDeviceRepository",
              label: "interface",
              text: "The interface with add, get, get all, update and delete that the in-memory store implements.",
            },
          },
          links: { json: "JSON · port 3000", device: "Device*", implements: "implements" },
        },
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
          "It is a JavaFX desktop app with FXML views and controllers. The trips live in an observable list, wrapped in a filtered and a sorted list, so the list view updates itself when trips are added, searched or re-sorted.",
          "Data is stored in an embedded H2 database with two tables, the trips and their conditions, through plain JDBC and prepared statements. The CSV import skips lines it can't read. JUnit tests cover the trip model, and the documentation is written in AsciiDoc and published as its own site.",
        ],
        architecture: {
          label: "Architecture of DrivingTracker",
          layers: {
            ui: { name: "UI · JavaFX" },
            lists: { name: "TripManager · JavaFX lists" },
            data: { name: "Data" },
          },
          blocks: {
            views: {
              name: "FXML views",
              label: "main · navbar · statistics",
              text: "Three FXML files describe the main view, the navigation bar and the statistics view.",
            },
            controllers: {
              name: "Controllers",
              label: "one per view",
              text: "Each view has a controller. MainController shows, adds and edits the trips, and StatisticController shows the progress towards the kilometre goal and the charts.",
            },
            csv: {
              name: "CSV",
              label: "import · export",
              text: "The navigation bar exports all trips to a CSV file and imports trips from one. Lines it cannot read are skipped.",
            },
            observable: {
              name: "ObservableList",
              label: "all trips",
              text: "TripManager loads all trips from the database into an observable list. Adding, editing or deleting a trip changes both the list and the database.",
            },
            filtered: {
              name: "FilteredList",
              label: "search",
              text: "Wraps the list with the search: a trip stays visible if its start city, its destination or one of its conditions contains the search text.",
            },
            sorted: {
              name: "SortedList",
              label: "newest · oldest",
              text: "Wraps the filtered list and sorts it by date, newest or oldest first.",
            },
            listview: {
              name: "ListView",
              label: "updates itself",
              text: "Shows the sorted list. Because each list passes changes on to the next, the view updates itself when trips are added, searched or re-sorted.",
            },
            db: {
              name: "DatabaseConnection",
              label: "JDBC · prepared statements",
              text: "Reads and writes the trips with JDBC and prepared statements. Saving a changed trip also adds and removes its conditions.",
            },
            h2: {
              name: "H2",
              label: "TRIP · TRIP_CONDITION",
              text: "An embedded H2 database stored in a file, with two tables: the trips and, for each trip, its conditions such as night, rain or snow.",
            },
          },
          links: { manager: "TripManager", jdbc: "JDBC" },
        },
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
        architecture: {
          label: "Architecture of the RPN Calculator",
          layers: {
            app: { name: "RpnCalcApp · RpnCalc.Test" },
            logic: { name: "RpnCalc.Logic" },
            core: { name: "RpnCalc.Core" },
          },
          blocks: {
            window: {
              name: "MainWindow",
              label: "Avalonia · UI in C#",
              text: "The whole interface is built in C# code instead of XAML, with Avalonia's Fluent theme. Keyboard shortcuts call the same handlers as the buttons, so both behave the same.",
            },
            graph: {
              name: "DrawingWindow",
              label: "canvas · steps of 0.01",
              text: "Draws the polynomial from x = −10 to 10 in steps of 0.01 as line segments on an Avalonia canvas with axes. If no part of the curve fits, it throws GraphOutOfRangeException.",
            },
            tests: {
              name: "Tests",
              label: "xUnit",
              text: "xUnit tests for the stack calculator and for evaluating the polynomial.",
            },
            stack: {
              name: "StackCalculator",
              label: "Stack<double> · max. 5",
              text: "The calculator on a stack of at most five values: push, the four basic operations, swap and clear. Errors such as too few values or division by zero are thrown as exceptions.",
            },
            function: {
              name: "FunctionCalculator",
              label: "stack → polynomial",
              text: "Reads the stack as the coefficients of c₀ + c₁x + c₂x² + …, with the bottom value as c₀, and evaluates the polynomial at x.",
            },
            contract: {
              name: "IRpnCalculator",
              label: "interface",
              text: "Describes what an RPN calculator offers: the stack, push and pop, the four operations, swap, clear and a snapshot of the stack.",
            },
            errors: {
              name: "Exceptions",
              label: "overflow · underflow · ÷ 0 · …",
              text: "One exception per error: stack overflow and underflow, division by zero, adding an empty number, and a graph that doesn't fit.",
            },
          },
          links: { uses: "uses", implements: "implements · throws" },
        },
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
    heading: "This page doesn't exist.",
    text: "The link may be broken, or the page has moved.",
    back: "Back to the homepage",
  },
};

export type Dictionary = typeof en;
