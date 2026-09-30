# Continuation Prompt

Lies diese Datei zuerst, wenn du die Arbeit an der Portfolio-Seite fortsetzt. Stand: 30.09.2026.

## Arbeitsweise (vom Besitzer vorgegeben)

- Antworte auf Deutsch.
- Committe nur lokal, **pushe nie**. Pushen, PRs mergen und GitHub-Einstellungen macht der Besitzer selbst.
- Teste Änderungen in **WebKit** (der Besitzer nutzt Safari), mit Playwright. Wichtiger Text darf nie über CSS `content` gezeichnet werden.
- Änderungen laufen über **OpenSpec**: `/openspec-propose` bzw. `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Specs liegen in `openspec/specs/`, offene Changes in `openspec/changes/`.
- Next.js 16 weicht von älterem Wissen ab. Lies vor Next-spezifischem Code die Doku in `node_modules/next/dist/docs/` (siehe `AGENTS.md`).
- Auf Port 3000 läuft ein eigener Node-Prozess des Besitzers. Den nicht anfassen; `npm run dev` kollidiert damit. Zum Ansehen: `npm run build`, dann `out/` statisch ausliefern (z. B. `python3 -m http.server 3200` im Ordner `out`).

## Stand

- Das Redesign (Layout nach dem Vorbild von hamishw.com) und die SEO-Änderungen sind gemergt (PR #7) und live unter `https://jbrunnerhtl.github.io/`. Das Repo heißt jetzt `jbrunnerhtl.github.io` und ist damit die User-Site.
- Live geprüft am 30.09.2026: `robots.txt` und `sitemap.xml` (14 URLs) an der Host-Wurzel, IndexNow-Key-Datei, alle Projektseiten, das Vorschaubild und die 404-Seite. Der `notify`-Job (IndexNow) lief laut Besitzer grün.
- Beide OpenSpec-Changes sind archiviert und in die Specs übernommen (`2026-09-30-improve-search-visibility`, `2026-09-30-redesign-portfolio-layout`). Es gibt keine offenen Changes. Die Capability `station-journey` ist entfernt.
- Aktuelle Specs in `openspec/specs/`: `canvas-3d-experience` (Hero-Sphere), `portfolio-ui`, `project-showcase`, `project-pages`, `search-engine-optimization`, `site-deployment`.

## Was der Besitzer eventuell noch tun muss

Beim Archivieren waren noch keine Verifizierungs-Tags live. Falls noch nicht erledigt:

1. Die neue Adresse setzen: im Feld „Website“ des GitHub-Profils, als Homepage des Repos und als Link im Profil-README (Repo `jbrunnerhtl/jbrunnerhtl`).
2. Google Search Console: Property vom Typ URL-Präfix `https://jbrunnerhtl.github.io/`, den Token als Repo-Variable `GOOGLE_SITE_VERIFICATION` anlegen, den Workflow neu starten, bestätigen, `sitemap.xml` einreichen und die Indexierung beantragen.
3. Bing Webmaster Tools: die Seite aus der Google Search Console importieren (oder die Repo-Variable `BING_SITE_VERIFICATION` setzen).

Prüfen, ob die Tags live sind:

```
curl -s https://jbrunnerhtl.github.io/ | grep -o 'google-site-verification\|msvalidate.01'
```

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
