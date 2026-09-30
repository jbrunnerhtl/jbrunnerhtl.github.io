# Continuation Prompt

Lies diese Datei zuerst, wenn du die Arbeit an der Portfolio-Seite fortsetzt. Stand: 30.09.2026.

## Arbeitsweise (vom Besitzer vorgegeben)

- Antworte auf Deutsch.
- Committe nur lokal, **pushe nie**. Pushen, PRs mergen und GitHub-Einstellungen macht der Besitzer selbst.
- Teste Änderungen in **WebKit** (der Besitzer nutzt Safari), mit Playwright. Wichtiger Text darf nie über CSS `content` gezeichnet werden.
- Änderungen laufen über **OpenSpec**: `/openspec-propose` bzw. `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Specs liegen in `openspec/specs/`, offene Changes in `openspec/changes/`.
- Next.js 16 weicht von älterem Wissen ab. Lies vor Next-spezifischem Code die Doku in `node_modules/next/dist/docs/` (siehe `AGENTS.md`).
- Auf Port 3000 läuft ein eigener Node-Prozess des Besitzers. Den nicht anfassen; `npm run dev` kollidiert damit. Zum Ansehen: `npm run build`, dann `out/` statisch ausliefern (z. B. `python3 -m http.server 3200` im Ordner `out`).

## Stand der Branches

- `main`: alte Space-Journey-Seite (live unter `https://jbrunnerhtl.github.io/personal-wesite3.0/`).
- `feature/improve-search-visibility`: SEO-Change (ein Commit, `1d811c9`).
- `feature/portfolio-redesign`: baut auf dem SEO-Branch auf und enthält **beides**, SEO und das neue Layout nach dem Vorbild von hamishw.com. Das ist der Branch, der gemergt werden soll. Nichts davon ist gepusht.

## Offene OpenSpec-Changes

### `improve-search-visibility` (14/15 Tasks)

Umzug auf die User-Site `https://jbrunnerhtl.github.io/`, Google- und Bing-Verifizierung (Tags auch auf `/`), IndexNow-Job `notify` im Workflow (Key `3c0d0bc384bd907c591dbd5a96780cba`, Datei `public/<key>.txt`) und reicheres JSON-LD.

- Offen: **Task 5.4**. Nach dem ersten Deploy auf der User-Site per `curl` prüfen, dass `/robots.txt`, `/sitemap.xml`, `/<key>.txt`, `/en/` und `/de/` mit 200 antworten und der `notify`-Job ohne Warnung lief.

### `redesign-portfolio-layout` (35/36 Tasks)

Neues Layout: Seitenleiste, Hero mit Displacement-Sphere (three.js/r3f), sechs Projekt-Sections mit Code-Mockups (shiki beim Build), Detailseiten `/<lang>/projects/<slug>/`, Light/Dark-Mode, 404 und OG-Bild im neuen Look.

- Offen: **Task 8.4**, erst beim Archivieren und erst nachdem `improve-search-visibility` archiviert ist:
  - das leere `openspec/specs/station-journey/` löschen,
  - den `Purpose` von `canvas-3d-experience` und `portfolio-ui` anpassen,
  - mit `openspec validate --specs` prüfen.
- Das SEO-Delta dieser Change setzt den Stand nach `improve-search-visibility` voraus. Deshalb **zuerst** die SEO-Change archivieren, **danach** das Redesign.

## Was der Besitzer noch tun muss (Reihenfolge wichtig)

1. `feature/portfolio-redesign` pushen und einen PR nach `main` öffnen, noch nicht mergen.
2. Das Repo auf GitHub in `jbrunnerhtl.github.io` umbenennen. Lokal: `git remote set-url origin git@github.com:jbrunnerhtl/jbrunnerhtl.github.io.git`.
3. Direkt danach den PR mergen. Der Deploy geht dann auf `https://jbrunnerhtl.github.io/`.
4. Die neue Adresse setzen: im Feld „Website“ des GitHub-Profils, als Homepage des Repos und als Link im Profil-README (Repo `jbrunnerhtl/jbrunnerhtl`).
5. Google Search Console: Property vom Typ URL-Präfix, den Token als Repo-Variable `GOOGLE_SITE_VERIFICATION` anlegen, den Workflow neu starten, bestätigen, `sitemap.xml` einreichen und die Indexierung beantragen.
6. Bing Webmaster Tools: die Seite aus der Google Search Console importieren.

Sagt der Besitzer, dass der Deploy durch ist:

1. `/opsx:apply improve-search-visibility`, um Task 5.4 zu prüfen.
2. `/opsx:archive` für `improve-search-visibility`.
3. `/opsx:archive` für `redesign-portfolio-layout`, inklusive Task 8.4.

## Fakten, die man sonst neu herausfinden müsste

- **Flashcards:** Der Default-Branch `main` ist fast leer; das vollständige Projekt liegt auf **`develop`**. Snippets und Quell-Links zeigen deshalb auf `develop`.
- **Crow-Terminal-Mockup:** Die Ausgabe ist echt, aufgezeichnet vom lokal gebauten Backend (clang++ mit Crow v1.3.3 und Asio). Das lief auf Port 18080, weil 3000 belegt war; angezeigt wird Port 3000 wie im Repo.
- **Code-Snippets:** `src/data/snippets.ts` enthält wörtliche Ausschnitte; Auslassungen sind mit „…“ markiert. Das Generator-Skript lag nur im Scratchpad. Neue Snippets also wieder wörtlich aus dem Repo übernehmen und jede Zeile gegen die Quelldatei prüfen.
- **Driving Planner** hat eine Live-Seite auf GitHub Pages der Klassenorganisation (`demoUrl` in `src/data/portfolioData.ts`).
- **Profilbild:** `public/profile.jpg` ist das GitHub-Avatar (460×460, eine Galaxie-Grafik).
- Texte stehen in `src/i18n/dictionaries/{en,de}.ts`; `de.ts` muss exakt die Form von `en.ts` haben (prüft der Typ `Dictionary`). Die deutschen Texte der Projektseiten hat der Besitzer noch nicht gegengelesen.
- Hero-Rollen (änderbar in den Wörterbüchern): EN „Developer + Student / Backend Dev / App Builder / Tinkerer“, DE „Entwickler + Schüler / Backend-Dev / App-Bauer / Tüftler“.
- Farben sind Tokens in `src/app/globals.css` (Dark auf `:root`, Light auf `:root[data-theme="light"]`). Alle Textfarben haben mindestens 4,5:1 Kontrast; nach Farbänderungen erneut prüfen.

## Checks vor jedem Commit (wie in der CI)

```
npx next typegen && npx tsc --noEmit && npm run lint && npm run build
```

Danach die betroffenen Ansichten in WebKit prüfen: Dark und Light, 1440/1024/390/320 px, ohne JavaScript und mit reduzierter Bewegung. Die Seite darf nie horizontal überlaufen, und ohne JavaScript muss aller Inhalt sichtbar sein.
