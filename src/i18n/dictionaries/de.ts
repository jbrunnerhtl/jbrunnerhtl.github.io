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
    statRepos: "Öffentliche Repositories",
    statContest: "Cloudflight Contest 2024",
    statYears: "{n}+ Jahre",
    statSince: "Programmiert seit {year}",
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
    live: "Live",
    view: "Projekt ansehen",
    moreTitle: "Kleinere Projekte und Schularbeiten auf GitHub.",
    team: "Team · {n}",
    more: "Weitere Repositories",
    all: "Alle {n} Repositories",
    page: {
      features: "Funktionen",
      built: "So ist es gebaut",
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
        architecture: {
          label: "Architektur von Driving Planner",
          layers: {
            client: { name: "Client · Vue 3" },
            api: {
              name: "API · Express 5",
              note: "Router, Service und Repository je Feature: Fahrschulen, Programme, Anmeldungen, Kilometerlog, Termine, Aufgaben, Bewertungen, Benutzer, Auth",
            },
            data: { name: "Daten" },
            background: { name: "Hintergrund · Extern" },
          },
          blocks: {
            views: {
              name: "Views",
              label: "Vue Router · PrimeVue · i18n",
              text: "Die Seiten der Single-Page-App, gebaut aus PrimeVue-Komponenten und umgeschaltet von Vue Router. vue-i18n liefert Deutsch und Englisch.",
            },
            stores: {
              name: "Stores",
              label: "Pinia",
              text: "Pinia-Stores halten den Zustand, den mehrere Seiten teilen, etwa die Fahrschulen, ihre Bewertungen und den angemeldeten Benutzer. Sie laden ihn über die API-Services.",
            },
            client: {
              name: "API-Client",
              label: "fetch · 5-Minuten-Cache",
              text: "Ein Service pro Bereich ruft die REST-API über einen gemeinsamen Client auf, der das JWT aus der Sitzung mitschickt. Listen wie die Fahrschulen werden fünf Minuten im Speicher zwischengespeichert.",
            },
            router: {
              name: "Router",
              label: "JWT-Prüfung · Swagger",
              text: "Ein Express-Router pro Feature. Eine Middleware prüft das JWT, und Routen nur für Admins prüfen zusätzlich die Rolle. Swagger dokumentiert jeden Endpunkt.",
            },
            service: {
              name: "Service",
              label: "Logik · Haversine",
              text: "Die Logik eines Features. Für jede Anfrage öffnet er eine Unit of Work, nur lesend beim Lesen und mit Transaktion bei Änderungen. Der Fahrschul-Service sortiert die Fahrschulen nach ihrer Luftlinie zum Benutzer (Haversine-Formel).",
            },
            repository: {
              name: "Repository",
              label: "SQL je Feature",
              text: "Führt die SQL-Abfragen eines Features über die Unit of Work aus, die ihm der Service übergibt.",
            },
            uow: {
              name: "Unit of Work",
              label: "eine Transaktion pro Änderung",
              text: "Hält eine Datenbankverbindung. Bei Änderungen öffnet sie eine Transaktion, und am Ende entscheidet der Service, ob committet oder zurückgerollt wird.",
            },
            sqlite: {
              name: "SQLite",
              label: "better-sqlite3 · bcrypt",
              text: "Alle Daten liegen in einer SQLite-Datei, angesprochen über better-sqlite3. Passwörter werden als bcrypt-Hash gespeichert.",
            },
            geocoder: {
              name: "Geocoder",
              label: "läuft im Hintergrund",
              text: "Startet fünf Sekunden nach dem Server. Er sucht Koordinaten für Fahrschulen, die eine Adresse, aber noch keine Koordinaten haben, und schreibt jedes Ergebnis in einer eigenen kurzen Transaktion zurück.",
            },
            nominatim: {
              name: "Nominatim",
              label: "OpenStreetMap · 1 Anfrage/s",
              text: "Der Geocoding-Dienst von OpenStreetMap. Der Geocoder wartet zwischen zwei Anfragen eine Sekunde, wie es die Nutzungsbedingungen verlangen.",
            },
          },
          links: { rest: "REST · JWT", transaction: "Transaktion", coordinates: "Koordinaten" },
        },
      },
      flashcards: {
        title: "Flashcards",
        summary: "Eine JavaFX-App zum Lernen mit Karteikarten, mit bewerteten Antworten, Statistiken und Lernserie.",
        description:
          "Eine JavaFX-Desktop-App zum Lernen mit digitalen Karteikarten, sortiert in Stapel. Sie fragt jeden Stapel in zufälliger Reihenfolge ab, speichert zu jeder Antwort eine Bewertung, zählt Lern-Streaks und Statistiken, importiert und exportiert Stapel und speichert sie als JSON mit Jackson. Gebaut nach dem MVP-Pattern, auf Deutsch und Englisch, mit hellem und dunklem Theme und Tests mit JUnit und Mockito.",
        features: [
          "Karten in Stapeln mit Icons ordnen; Karten können Bilder und Audio enthalten.",
          "Der Lernmodus geht einen Stapel einmal in zufälliger Reihenfolge durch.",
          "Jede Antwort als falsch, schwierig, OK oder leicht bewerten.",
          "Statistiken nach Bewertung und Tag, für den letzten Tag, die letzte Woche, den letzten Monat oder insgesamt, dazu eine Lernserie.",
          "Karten und Stapel als JSON importieren und exportieren, mit einem Dialog für Duplikate.",
          "Englisch und Deutsch, helles und dunkles Theme, jederzeit umschaltbar.",
        ],
        built: [
          "Eine JavaFX-Desktop-App nach dem Model-View-Presenter-Muster. Die Views sind in Java-Code gebaut, ein Presenter verbindet sie mit dem Model.",
          "Eine klügere Kartenauswahl ist als Strategie vorbereitet: Ein CardSelector nutzt hinter einem gemeinsamen Interface einen zufälligen oder einen gewichteten Algorithmus. Eine Bewertung setzt das Gewicht der Karte, von 8 für falsch bis 1 für leicht, und der gewichtete Algorithmus zieht jede Karte mit einer Wahrscheinlichkeit proportional zu ihrem Gewicht. Unit-Tests decken sie ab, der Lernmodus mischt den Stapel aber noch und nutzt sie nicht.",
          "Stapel, Lerndaten und Serien werden mit Jackson als JSON gespeichert. Übersetzungen und Theme-Farben kommen aus Provider-Klassen, an die sich die Views binden, sodass Sprache und Theme sofort wechseln. JUnit 5 und Mockito testen Model, Speicherung und Übersetzungen. Entstanden ist die App als Schulprojekt im Viererteam, mit User Stories, Pflichtenheft und Protokollen in AsciiDoc, veröffentlicht auf GitHub Pages.",
        ],
        architecture: {
          label: "Architektur von Flashcards",
          layers: {
            view: { name: "View · JavaFX" },
            presenter: { name: "Presenter" },
            model: { name: "Model" },
            storage: { name: "Speicherung" },
          },
          blocks: {
            providers: {
              name: "Provider",
              label: "Sprache · Theme",
              text: "TranslationProvider und ThemeProvider halten die aktuelle Sprache und das Theme. Die Views binden ihre Texte und Farben daran, deshalb wirkt ein Wechsel sofort.",
            },
            views: {
              name: "Views",
              label: "in Java-Code gebaut",
              text: "Jede Ansicht (Start, Stapel, Lernmodus, Statistik, Einstellungen und die Dialoge) ist in Java-Code gebaut, ohne FXML. Die Views zeigen Daten an und melden, was der Benutzer tut.",
            },
            presenter: {
              name: "MainPresenter",
              label: "Navigation · Suche · Import",
              text: "Ein Presenter verbindet die Views mit dem Model. Er übernimmt die Navigation mit Zurück und Vor, die Suche sowie Import und Export von Stapeln und aktualisiert die Views.",
            },
            study: {
              name: "Lernmodus",
              label: "gemischte Warteschlange",
              text: "Legt die Karten eines Stapels in zufälliger Reihenfolge in eine Warteschlange und geht sie einmal durch. Jede Antwort wird als falsch, schwierig, OK oder leicht bewertet und bei der Karte gespeichert.",
            },
            model: {
              name: "Model",
              label: "Stapel · Karten · Serie",
              text: "Hält die Stapel mit ihren Karten und Lerndaten sowie die Lernserie. Es lädt und speichert sie über die Persistenzschicht.",
            },
            stats: {
              name: "Statistik",
              label: "Tag · Woche · Monat · gesamt",
              text: "StatisticsAggregator zählt die Bewertungen eines Stapels oder aller Stapel, für den letzten Tag, die letzte Woche, den letzten Monat oder insgesamt.",
            },
            selector: {
              name: "Kartenauswahl",
              label: "Strategie · noch nicht eingebunden",
              text: "Eine Strategie für die nächste Karte: zufällig oder gewichtet, sodass falsch (8) oder schwierig (4) bewertete Karten öfter wiederkommen als OK (2) oder leicht (1), unbewertete zählen 3. Unit-Tests decken sie ab, der Lernmodus nutzt sie aber noch nicht.",
            },
            persistence: {
              name: "Persistence",
              label: "Jackson · JSON",
              text: "Speichert die Stapel und die Lernserie mit Jackson als JSON und importiert und exportiert einzelne Karten oder ganze Stapel.",
            },
          },
          links: { events: "Ereignisse · Updates", calls: "Aufrufe", json: "JSON" },
        },
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
        architecture: {
          label: "Architektur des 3D-Vektor-Viewers",
          layers: {
            app: { name: "App · VectorViewer" },
            frame: { name: "Jeder Frame", note: "Raster, Pfeile und Panel liegen in der Klassenbibliothek VectorViewerClasses" },
            model: { name: "Model" },
          },
          blocks: {
            window: {
              name: "Fenster & Kamera",
              label: "raylib · 60 FPS",
              text: "Program.cs öffnet ein maximiertes Fenster mit veränderbarer Größe und 60 Bildern pro Sekunde und richtet eine perspektivische 3D-Kamera auf den Ursprung. Dann startet die Hauptschleife.",
            },
            camera: {
              name: "Kamera",
              label: "kreist · Zoom",
              text: "Jeder Frame beginnt damit, die Kamera auf ihrer Kreisbahn um den Ursprung weiterzubewegen. Das Mausrad zoomt.",
            },
            grid: {
              name: "Raster",
              label: "wächst · Achsenbeschriftung",
              text: "GridSetup passt das Raster an den größten Vektor an und beschriftet die X- und die Z-Achse. Die 3D-Position jeder Beschriftung wird auf den Bildschirm projiziert und weggelassen, wenn sie hinter der Kamera liegt.",
            },
            arrows: {
              name: "Pfeile",
              label: "Zylinder · Kegel",
              text: "Im 3D-Modus wird jeder Vektor als dünner Zylinder mit einem Kegel als Spitze gezeichnet, über eine Extension-Methode auf Vector3.",
            },
            panel: {
              name: "Panel",
              label: "Buttons · Schieberegler · Liste",
              text: "Das Seitenpanel wird zuletzt gezeichnet, direkt mit raylib und ohne UI-Framework. Während es Buttons, Schieberegler und Liste zeichnet, verarbeitet es auch die Maus, deshalb zeigt sich eine Änderung im nächsten Frame.",
            },
            vec: {
              name: "Vec",
              label: "Start · Ende · Farbe",
              text: "Ein Vektor besteht aus Startpunkt, Endpunkt und Farbe. Das Panel hält die Liste und gibt jedem neuen Vektor die nächste Farbe aus einer festen Palette.",
            },
          },
          links: { start: "Hauptschleife", next: "Nächster Frame", vectors: "Vektoren" },
        },
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
          "Die Geräte nutzen Vererbung: Laptop und Server erben von einer abstrakten Klasse Device und überschreiben getSpecs(). Die Speicherung beschreibt ein Interface IDeviceRepository, implementiert im Speicher; die Routen bekommen die In-Memory-Klasse direkt übergeben.",
          "Die Routen werden in je einer kleinen Funktion pro HTTP-Methode registriert. Eingehendes JSON liest Crows JSON-Reader, und daraus entsteht der passende Gerätetyp oder eine Fehlermeldung.",
        ],
        architecture: {
          label: "Architektur des Crow Demo Backends",
          layers: {
            http: { name: "HTTP" },
            app: { name: "Crow-App · main.cpp" },
            storage: { name: "Speicher" },
          },
          blocks: {
            client: {
              name: "Client",
              label: "z. B. requests.http",
              text: "Ein beliebiger HTTP-Client. Das Repository enthält fertige Anfragen für jeden Endpunkt in test/requests.http.",
            },
            routes: {
              name: "Routen",
              label: "eine Funktion pro Methode",
              text: "create_getRoutes, create_postRoutes, create_putRoutes und create_deleteRoutes registrieren jeweils die /devices-Routen einer HTTP-Methode an der Crow-App.",
            },
            check: {
              name: "check_body",
              label: "prüfen · Typ wählen",
              text: "Liest den JSON-Body, prüft die Pflichtfelder und erzeugt je nach Feld type einen Laptop oder einen Server. Jedes Problem wird zu 400 Bad Request mit der Fehlermeldung.",
            },
            devices: {
              name: "Laptop · Server",
              label: "erben von Device",
              text: "Laptop (Akkulaufzeit) und Server (RAM und Kerne) erben von der abstrakten Klasse Device und überschreiben getSpecs(), das GET als Beschreibung zurückgibt.",
            },
            store: {
              name: "InMemoryDeviceRepository",
              label: "std::vector · eindeutige IDs",
              text: "Hält die Geräte in einem Vector im Speicher. Ein Gerät mit einer schon vorhandenen ID lässt sich nicht hinzufügen, und POST antwortet dann mit 400. Die Routen bekommen genau diese Klasse übergeben.",
            },
            contract: {
              name: "IDeviceRepository",
              label: "Interface",
              text: "Das Interface mit Hinzufügen, Abrufen, alle Abrufen, Ändern und Löschen, das der In-Memory-Speicher implementiert.",
            },
          },
          links: { json: "JSON · Port 3000", device: "Device*", implements: "implementiert" },
        },
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
          "Es ist eine JavaFX-Desktop-App mit FXML-Views und Controllern. Die Fahrten liegen in einer Observable List, umhüllt von einer gefilterten und einer sortierten Liste, sodass sich die Listenansicht selbst aktualisiert, wenn Fahrten dazukommen, gesucht oder umsortiert werden.",
          "Die Daten liegen in einer eingebetteten H2-Datenbank mit zwei Tabellen, den Fahrten und ihren Bedingungen, angesprochen über JDBC und Prepared Statements. Der CSV-Import überspringt Zeilen, die er nicht lesen kann. JUnit-Tests decken das Fahrt-Model ab, und die Dokumentation ist in AsciiDoc geschrieben und als eigene Seite veröffentlicht.",
        ],
        architecture: {
          label: "Architektur von DrivingTracker",
          layers: {
            ui: { name: "UI · JavaFX" },
            lists: { name: "TripManager · JavaFX-Listen" },
            data: { name: "Daten" },
          },
          blocks: {
            views: {
              name: "FXML-Views",
              label: "Haupt · Navigation · Statistik",
              text: "Drei FXML-Dateien beschreiben die Hauptansicht, die Navigationsleiste und die Statistikansicht.",
            },
            controllers: {
              name: "Controller",
              label: "einer pro View",
              text: "Jede View hat einen Controller. Der MainController zeigt, erfasst und ändert die Fahrten, der StatisticController zeigt den Fortschritt zum Kilometerziel und die Diagramme.",
            },
            csv: {
              name: "CSV",
              label: "Import · Export",
              text: "Die Navigationsleiste exportiert alle Fahrten in eine CSV-Datei und importiert Fahrten aus einer. Zeilen, die sie nicht lesen kann, überspringt sie.",
            },
            observable: {
              name: "ObservableList",
              label: "alle Fahrten",
              text: "Der TripManager lädt alle Fahrten aus der Datenbank in eine beobachtbare Liste. Hinzufügen, Ändern oder Löschen einer Fahrt ändert die Liste und die Datenbank.",
            },
            filtered: {
              name: "FilteredList",
              label: "Suche",
              text: "Umhüllt die Liste mit der Suche: Eine Fahrt bleibt sichtbar, wenn Startort, Ziel oder eine ihrer Bedingungen den Suchtext enthält.",
            },
            sorted: {
              name: "SortedList",
              label: "neueste · älteste",
              text: "Umhüllt die gefilterte Liste und sortiert sie nach Datum, die neuesten oder die ältesten zuerst.",
            },
            listview: {
              name: "ListView",
              label: "aktualisiert sich selbst",
              text: "Zeigt die sortierte Liste. Weil jede Liste Änderungen an die nächste weitergibt, aktualisiert sich die Anzeige selbst, wenn Fahrten dazukommen, gesucht oder umsortiert werden.",
            },
            db: {
              name: "DatabaseConnection",
              label: "JDBC · Prepared Statements",
              text: "Liest und schreibt die Fahrten mit JDBC und Prepared Statements. Beim Speichern einer geänderten Fahrt werden auch ihre Bedingungen ergänzt und entfernt.",
            },
            h2: {
              name: "H2",
              label: "TRIP · TRIP_CONDITION",
              text: "Eine eingebettete H2-Datenbank in einer Datei, mit zwei Tabellen: den Fahrten und zu jeder Fahrt ihren Bedingungen wie Nacht, Regen oder Schnee.",
            },
          },
          links: { manager: "TripManager", jdbc: "JDBC" },
        },
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
        architecture: {
          label: "Architektur des RPN-Rechners",
          layers: {
            app: { name: "RpnCalcApp · RpnCalc.Test" },
            logic: { name: "RpnCalc.Logic" },
            core: { name: "RpnCalc.Core" },
          },
          blocks: {
            window: {
              name: "MainWindow",
              label: "Avalonia · UI in C#",
              text: "Die ganze Oberfläche ist in C#-Code statt in XAML gebaut, mit dem Fluent-Theme von Avalonia. Tastenkürzel rufen dieselben Handler auf wie die Buttons, deshalb verhalten sich beide gleich.",
            },
            graph: {
              name: "DrawingWindow",
              label: "Canvas · Schritte von 0,01",
              text: "Zeichnet das Polynom von x = −10 bis 10 in Schritten von 0,01 als Liniensegmente auf ein Avalonia-Canvas mit Achsen. Passt kein Teil der Kurve hinein, wirft es GraphOutOfRangeException.",
            },
            tests: {
              name: "Tests",
              label: "xUnit",
              text: "xUnit-Tests für den Stack-Rechner und für die Auswertung des Polynoms.",
            },
            stack: {
              name: "StackCalculator",
              label: "Stack<double> · max. 5",
              text: "Der Rechner auf einem Stack mit höchstens fünf Werten: Push, die vier Grundrechenarten, Tauschen und Leeren. Fehler wie zu wenige Werte oder Division durch null werden als Exceptions geworfen.",
            },
            function: {
              name: "FunctionCalculator",
              label: "Stack → Polynom",
              text: "Liest den Stack als Koeffizienten von c₀ + c₁x + c₂x² + …, mit dem untersten Wert als c₀, und wertet das Polynom an der Stelle x aus.",
            },
            contract: {
              name: "IRpnCalculator",
              label: "Interface",
              text: "Beschreibt, was ein RPN-Rechner bietet: den Stack, Push und Pop, die vier Rechenarten, Tauschen, Leeren und eine Momentaufnahme des Stacks.",
            },
            errors: {
              name: "Exceptions",
              label: "Overflow · Underflow · ÷ 0 · …",
              text: "Eine Exception pro Fehler: voller und leerer Stack, Division durch null, eine leere Zahl hinzufügen und ein Graph, der nicht hineinpasst.",
            },
          },
          links: { uses: "nutzt", implements: "implementiert · wirft" },
        },
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
    heading: "Diese Seite gibt es nicht.",
    text: "Der Link ist vielleicht kaputt, oder die Seite wurde verschoben.",
    back: "Zurück zur Startseite",
  },
};
