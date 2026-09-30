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
    greeting: "Servus",
    message: "Schreib mir eine Nachricht",
    photoAlt: "Profilbild von Jan Brunner: eine leuchtende Spiralgalaxie",
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
    page: {
      features: "Funktionen",
      built: "So ist es gebaut",
      code: "Aus dem Code",
      facts: "Details",
      language: "Sprache",
      year: "Jahr",
      team: "Team",
      solo: "Solo",
      people: "{n} Personen",
      stack: "Stack",
      github: "Auf GitHub ansehen",
      next: "Nächstes Projekt",
      back: "Alle Projekte",
      source: "Quelle",
    },
    items: {
      "driving-planner": {
        title: "Driving Planner",
        summary: "Eine Full-Stack-Web-App, die Fahrschüler mit Fahrschulen in der Nähe verbindet und ihre Ausbildung begleitet.",
        description:
          "Eine Full-Stack-Web-App für Fahrschüler und Fahrschulen. Man findet Fahrschulen in der Nähe (Geocoding über OpenStreetMap), meldet sich für Programme an, erfasst gefahrene Kilometer, Termine und Aufgaben und bewertet Fahrschulen, während Fahrschulen ihre eigene Seite verwalten. Ein Vue-3-Frontend mit PrimeVue, Pinia und Deutsch/Englisch spricht mit einer Express-REST-API mit SQLite, JWT und Swagger-Doku, gestartet mit Docker Compose.",
        features: [
          "Fahrschulen in der Nähe finden, sortiert nach ihrer Entfernung vom eigenen Wohnort.",
          "Sich für Programme einer Fahrschule anmelden und die Ausbildung verfolgen.",
          "Gefahrene Kilometer, Fahrstunden und andere Termine sowie Aufgaben eintragen.",
          "Fahrschulen bewerten und kommentieren.",
          "Fahrschulen verwalten ihre eigene Seite.",
          "Oberfläche auf Englisch und Deutsch, mit Profilbildern.",
        ],
        built: [
          "Das Frontend ist eine Vue-3-Single-Page-App mit PrimeVue-Komponenten, Pinia-Stores, Vue Router und vue-i18n für Englisch und Deutsch. Es spricht mit einer REST-API auf Basis von Express 5, geschrieben in TypeScript.",
          "Das Backend ist nach Features gegliedert (Fahrschulen, Programme, Anmeldungen, Kilometerlog, Termine, Aufgaben, Bewertungen, Benutzer, Auth), jedes mit Router, Service und Repository. Die Daten liegen über better-sqlite3 in SQLite, gekapselt in einer kleinen Unit-of-Work-Klasse, die jede Änderung in einer Transaktion ausführt. Passwörter werden mit bcrypt gehasht, Anfragen per JWT authentifiziert, und Swagger dokumentiert jeden Endpunkt.",
          "Fahrschulen ohne Koordinaten werden im Hintergrund über Nominatim von OpenStreetMap geokodiert, mit einer Anfrage pro Sekunde, wie es die Nutzungsbedingungen verlangen. Docker Compose startet den ganzen Stack, zum Entwickeln mit Hot Reload oder als Release, und Jest-Tests decken die wichtigsten Router ab.",
        ],
        snippetNotes: [
          "Die Haversine-Formel liefert die Luftlinie zwischen Benutzer und Fahrschule.",
          "Fehlende Koordinaten werden bei Nominatim nachgeschlagen, mit einer Sekunde Pause zwischen den Anfragen.",
        ],
      },
      flashcards: {
        title: "Flashcards",
        summary: "Eine JavaFX-Lern-App, die Karten, bei denen du dir schwertust, öfter abfragt.",
        description:
          "Eine JavaFX-Desktop-App zum Lernen mit digitalen Karteikarten, sortiert in Stapel. Sie wählt Karten mit einem gewichteten Auswahl-Algorithmus, zählt Lern-Streaks und Statistiken, importiert und exportiert Stapel und speichert sie als JSON mit Jackson. Gebaut nach dem MVP-Pattern, auf Deutsch und Englisch, mit hellem und dunklem Theme und Tests mit JUnit und Mockito.",
        features: [
          "Karten in Stapeln mit Icons ordnen; Karten können Bilder und Audio enthalten.",
          "Der Lernmodus wählt die nächste Karte nach Gewicht: Falsche und schwierige Karten kommen öfter.",
          "Jede Antwort als falsch, schwierig, OK oder leicht bewerten.",
          "Statistiken nach Bewertung und Tag, für den letzten Tag, die letzte Woche, den letzten Monat oder insgesamt, dazu eine Lernserie.",
          "Karten und Stapel als JSON importieren und exportieren, mit einem Dialog für Duplikate.",
          "Englisch und Deutsch, helles und dunkles Theme, jederzeit umschaltbar.",
        ],
        built: [
          "Eine JavaFX-Desktop-App nach dem Model-View-Presenter-Muster. Die Views sind in Java-Code gebaut, ein Presenter verbindet sie mit dem Model.",
          "Die Kartenauswahl ist eine Strategie: Ein CardSelector nutzt hinter einem gemeinsamen Interface einen zufälligen oder einen gewichteten Algorithmus. Eine Bewertung setzt das Gewicht der Karte, von 8 für falsch bis 1 für leicht, und der gewichtete Algorithmus zieht jede Karte mit einer Wahrscheinlichkeit proportional zu ihrem Gewicht.",
          "Stapel, Lerndaten und Serien werden mit Jackson als JSON gespeichert. Übersetzungen und Theme-Farben kommen aus Provider-Klassen, an die sich die Views binden, sodass Sprache und Theme sofort wechseln. JUnit 5 und Mockito testen Model, Speicherung und Übersetzungen. Entstanden ist die App als Schulprojekt im Viererteam, mit User Stories, Pflichtenheft und Protokollen in AsciiDoc, veröffentlicht auf GitHub Pages.",
        ],
        snippetNotes: [
          "Die Bewertung bestimmt, wie oft die Karte wiederkommt.",
          "Statistiken lassen sich auf den letzten Tag, die letzte Woche oder den letzten Monat eingrenzen.",
        ],
      },
      "vector-viewer": {
        title: "3D-Vektor-Viewer",
        summary: "3D-Vektoren mit Schiebereglern bauen und live um eine kreisende Kamera beobachten.",
        description:
          "Ein interaktiver 3D-Vektor-Viewer in C# mit Raylib-cs. Vektoren hinzufügen, Start- und Endpunkt per Slider setzen und live in einem mitwachsenden, beschrifteten Koordinatengitter mit kreisender Kamera verfolgen.",
        features: [
          "Vektoren per Klick hinzufügen und entfernen; jeder neue Vektor bekommt eine eigene Farbe.",
          "Schieberegler für Start- und Endpunkt: X, Y und Z von −5 bis 5 in Schritten von 0,1.",
          "Eine Liste aller Vektoren; ein Klick wählt einen zum Bearbeiten aus.",
          "Ein Raster, das mit den Vektoren wächst, beschriftet entlang der X- und Z-Achse.",
          "Eine kreisende Kamera mit Zoom per Mausrad, unter Linux, Windows und macOS.",
        ],
        built: [
          "Geschrieben in C# auf .NET 10 mit Raylib-cs, den C#-Bindings für raylib. Die Solution hat zwei Projekte: eine Konsolen-App mit Fenster, Kamera und Hauptschleife und eine Klassenbibliothek mit Vektor-Model, Seitenleiste, Raster und einer Zeichen-Erweiterung.",
          "In jedem Frame wird das Raster an den größten Vektor angepasst, jeder Vektor als Zylinder mit einem Kegel als Spitze gezeichnet und die Achsenbeschriftung von 3D in Bildschirmkoordinaten projiziert. Das Panel mit Buttons, Schiebereglern und Liste zeichnet raylib direkt, ohne UI-Framework.",
        ],
        snippetNotes: [
          "Eine Extension-Methode zeichnet einen Vektor als dünnen Zylinder mit einem Kegel als Pfeilspitze.",
          "Achsenbeschriftungen werden in den Bildschirmraum projiziert und ausgelassen, wenn sie hinter der Kamera liegen.",
        ],
      },
      crow: {
        title: "Crow Demo Backend",
        summary: "Eine kleine C++-REST-API für Laptops und Server auf Basis des Crow-Frameworks.",
        description:
          "Ein REST-Backend in C++ auf dem Crow-Framework, das Geräte (Laptops und Server) aus einem In-Memory-Speicher nach dem Repository-Pattern ausliefert. Gebaut mit CMake FetchContent.",
        features: [
          "Geräte unter /devices anlegen, abrufen, ändern und löschen.",
          "Zwei Gerätetypen: Laptops mit Akkulaufzeit und Server mit RAM und Kernen.",
          "Jeder JSON-Body wird geprüft, Fehler kommen als 400 Bad Request mit einer Meldung zurück.",
          "IDs sind eindeutig; ein zweites Gerät mit derselben ID wird abgelehnt.",
          "Fertige Testanfragen für jeden Endpunkt in einer .http-Datei.",
        ],
        built: [
          "C++ mit dem Header-only-Framework Crow, das CMake beim Build über FetchContent lädt. Ein Build-Skript konfiguriert und baut das Projekt und startet den Server auf Port 3000.",
          "Die Geräte nutzen Vererbung: Laptop und Server erben von einer abstrakten Klasse Device und überschreiben getSpecs(). Die Speicherung steckt hinter einem Interface IDeviceRepository mit einer In-Memory-Implementierung, sodass eine Datenbank sie ersetzen könnte, ohne die Routen anzufassen.",
          "Die Routen werden in je einer kleinen Funktion pro HTTP-Methode registriert. Eingehendes JSON liest Crows JSON-Reader, und daraus entsteht der passende Gerätetyp oder eine Fehlermeldung.",
        ],
        snippetNotes: [
          "GET /devices liefert die Spezifikation jedes Geräts als JSON.",
          "Das Feld type im Body entscheidet, welches Gerät entsteht, jeweils mit eigenen Prüfungen.",
        ],
      },
      "driving-tracker": {
        title: "DrivingTracker",
        summary: "Ein JavaFX-Fahrtenbuch für Übungsfahrten, das den Fortschritt zum L17-Kilometerziel zeigt.",
        description:
          "Eine JavaFX-Desktop-App, um Fahrten zu erfassen und Fahrstatistiken anzuzeigen. Die Daten liegen in einer eingebetteten H2-Datenbank, dazu gibt es JUnit-Tests und eine eigene Dokumentationsseite.",
        features: [
          "Übungsfahrten eintragen: Datum, Start und Ziel, Kilometerstände, Bedingungen (Tag, Nacht, Regen, Nebel, Schnee, Eis …) und Notizen.",
          "Fahrten nach Stadt oder Bedingung durchsuchen und nach Datum sortieren.",
          "Den Fortschritt zu den nötigen Kilometern sehen: 3.000 km für L17, sonst 1.000 km.",
          "Statistiken zu Fahrten im aktuellen Monat, zur durchschnittlichen Strecke und ein Diagramm der letzten vier Kalenderwochen.",
          "Alle Fahrten als CSV importieren und exportieren.",
        ],
        built: [
          "In Österreich dürfen Fahrschüler mit L17 schon ab 17 mit einer Begleitperson fahren, nach 3.000 km Übungsfahrten. DrivingTracker ist das Fahrtenbuch für diese Kilometer.",
          "Es ist eine JavaFX-Desktop-App mit FXML-Views und Controllern. Die Fahrten liegen in einer Observable List, umhüllt von einer gefilterten und einer sortierten Liste, sodass sich die Tabelle selbst aktualisiert, wenn Fahrten dazukommen, gesucht oder umsortiert werden.",
          "Die Daten liegen in einer eingebetteten H2-Datenbank mit zwei Tabellen, den Fahrten und ihren Bedingungen, angesprochen über JDBC und Prepared Statements. Der CSV-Import überspringt Zeilen, die er nicht lesen kann. JUnit-Tests decken das Fahrt-Model ab, und die Dokumentation ist in AsciiDoc geschrieben und als eigene Seite veröffentlicht.",
        ],
        snippetNotes: [
          "Zwei Tabellen: die Fahrten und zu jeder Fahrt ihre Bedingungen.",
          "Der Fortschritt ist die Gesamtstrecke geteilt durch das Ziel der gewählten Variante.",
        ],
      },
      rpn: {
        title: "RPN-Rechner",
        summary: "Ein UPN-Taschenrechner in C# und Avalonia, der den Stack auch als Graph zeichnen kann.",
        description:
          "Ein Desktop-Rechner für umgekehrte polnische Notation in C# mit Avalonia UI. Er hat Stack-Operationen, Tastatureingabe, eine Graph-Ansicht und getrennte Projekte für Core, Logik und Tests.",
        features: [
          "Zahlen auf einen Stack mit bis zu fünf Werten legen und mit +, −, × und ÷ rechnen.",
          "Die obersten Werte tauschen, den Stack leeren oder die letzte Ziffer löschen.",
          "Komplett per Tastatur bedienbar, auch über den Nummernblock.",
          "Fehler wie zu wenige Werte, ein voller Stack oder Division durch null werden direkt angezeigt.",
          "Graph-Modus: Der Stack wird zu den Koeffizienten eines Polynoms, gezeichnet von −10 bis 10.",
        ],
        built: [
          "C# auf .NET 8 mit Avalonia UI und dem dunklen Fluent-Theme. Die Solution hat vier Projekte: Core mit dem Rechner-Interface und den Exceptions, Logic mit dem Stack-Rechner und der Funktionsauswertung, die App und xUnit-Tests.",
          "Die Oberfläche ist in C#-Code statt in XAML gebaut. Tasten sind mit denselben Handlern verbunden wie die Buttons, sodass sich Maus und Tastatur gleich verhalten.",
          "Für den Graphen werden die Stack-Werte als Koeffizienten von c₀ + c₁x + c₂x² + … gelesen, in Schritten von 0,01 ausgewertet und als Liniensegmente auf ein Avalonia-Canvas mit Achsen und Markierungen gezeichnet.",
        ],
        snippetNotes: [
          "Die Stack-Werte werden zu den Koeffizienten eines Polynoms.",
          "Tastenkürzel verwenden dieselben Handler wie die Buttons.",
        ],
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
    heading: "Lass uns etwas bauen.",
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
