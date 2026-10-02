# Continuation Prompt

Lies diese Datei zuerst, wenn du die Arbeit an der Portfolio-Seite fortsetzt. Stand: 02.10.2026.

## Arbeitsweise (vom Besitzer vorgegeben)

- Antworte auf Deutsch.
- Committe nur lokal, **pushe nie**. Pushen, PRs und GitHub-Einstellungen macht der Besitzer selbst.
- Teste Änderungen in **WebKit** (der Besitzer nutzt Safari), mit Playwright. Wichtiger Text darf nie über CSS `content` gezeichnet werden.
- Änderungen laufen über **OpenSpec**: `/opsx:explore` → `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Die Specs liegen in `openspec/specs/`, die abgeschlossenen Changes in `openspec/changes/archive/`.
- Next.js 16 weicht von älterem Wissen ab. Lies vor Next-spezifischem Code die Doku in `node_modules/next/dist/docs/` (siehe `AGENTS.md`).
- Auf Port 3000 läuft ein eigener Node-Prozess des Besitzers. Den nicht anfassen; `npm run dev` kollidiert damit. Zum Ansehen: `npm run build`, dann `out/` statisch ausliefern (z. B. `python3 -m http.server 3200` im Ordner `out`).

## Stand

- Die Seite ist live unter **`https://jbrunnerhtl.github.io/`**. Das Repo heißt `jbrunnerhtl/jbrunnerhtl.github.io` und ist damit die User-Site ohne Base-Path. Deploy: `.github/workflows/deploy.yml` bei jedem Push auf `main`, täglich und manuell. Nach Pushes und manuellen Läufen meldet der Job `notify` neue Inhalte an IndexNow.
- Keine offenen OpenSpec-Changes. Zuletzt archiviert: `2026-10-02-change-accent-to-magenta-violet`, davor `2026-09-30-improve-search-visibility` und `2026-09-30-redesign-portfolio-layout`.
- **Noch nicht live:** Die Umstellung der Akzentfarbe von Türkis auf Magenta-Violett liegt lokal auf dem Branch `feature/magenta-violet-accent` (nicht gepusht). Der Besitzer pusht und merged selbst; bis dahin zeigt die Live-Seite Türkis.
- Aktuelle Specs: `canvas-3d-experience` (Hero-Sphere), `portfolio-ui`, `project-showcase`, `project-pages`, `search-engine-optimization`, `site-deployment`. Alle gültig (`openspec validate --specs`).

## Aufbau der Seite

Das Layout folgt dem Vorbild von hamishw.com; Code, Logo und Texte sind eigene.

- **Seitenleiste** (`src/components/navigation/Sidebar.tsx`): Monogramm „JB.“, senkrechte Abschnittslinks, GitHub und E-Mail. Oben rechts Sprachwechsel und Umschalter für Dark und Light. Unter 1024 px ein Menü über den ganzen Bildschirm.
- **Startseite** (`src/app/[lang]/page.tsx`), in dieser Reihenfolge:
  - Hero mit wechselnder Rolle und Displacement-Sphere (`src/components/hero/`)
  - sechs Projekt-Sections mit Code-Mockups
  - weitere Repos
  - Über mich mit Stats und Profilbild
  - Skills mit Timeline
  - Kontakt
- **Projektseiten** `src/app/[lang]/projects/[slug]/page.tsx` für die sechs Projekte in EN und DE, mit Metadaten und JSON-LD.
- **Farbmodus:** Das Skript in `src/lib/theme.ts` setzt ihn vor dem ersten Paint (`data-theme`, `html.js`). Die Tokens stehen in `src/app/globals.css`.
- **Akzentfarbe:** dunkles Magenta-Violett in zwei Tönen.
  - `--accent` (`#a21caf`, beide Modi): Füllung der Buttons, der Block hinter dem Profilbild und die Textmarkierung. Label darauf: `--accent-fg` (weiß).
  - `--accent-text` (Dark `#e879f9`, Light `#a21caf`): Akzenttext, Fokusrahmen, Divider, Hover-Linie der Navigation und die kleinen Marker in Skills und auf den Projektseiten.
  - `--sphere-light` ist in beiden Modi `#e879f9`, `--sphere-base` ist violett getönt.
  - Das OG-Bild (`src/app/[lang]/og.png/route.tsx`) hat eine eigene Kopie der Farben und muss bei Farbänderungen von Hand mitgezogen werden.
- **Einblendungen:** `[data-reveal]` mit `RevealObserver`; `DecoderText` für den Scramble-Effekt. Ohne JavaScript ist alles sichtbar.
- **Code-Mockups:** Syntax-Highlighting mit shiki beim Build (`src/lib/highlight.ts`). Die Ausschnitte stehen in `src/data/snippets.ts`.
- **Daten und Texte:** `src/data/portfolioData.ts` und `src/i18n/dictionaries/{en,de}.ts`. `de.ts` muss exakt die Form von `en.ts` haben.

## Was der Besitzer eventuell noch tun muss

Stand 30.09.: Das Profil-README verlinkt schon auf die neue Adresse. **Noch keine Verifizierungs-Tags live.**

1. Das Feld „Website“ im GitHub-Profil und die Homepage des Repos auf `https://jbrunnerhtl.github.io/` setzen (falls noch nicht geschehen).
2. Google Search Console: Property vom Typ URL-Präfix `https://jbrunnerhtl.github.io/`, Methode „HTML-Tag“.
   - Den Token als Repo-Variable `GOOGLE_SITE_VERIFICATION` anlegen und den Workflow neu starten.
   - Bestätigen, `sitemap.xml` einreichen und die Indexierung für `/en/` und `/de/` beantragen.
3. Bing Webmaster Tools: aus der Google Search Console importieren, oder die Repo-Variable `BING_SITE_VERIFICATION` setzen.

Prüfen, ob die Tags live sind:

```
curl -s https://jbrunnerhtl.github.io/ | grep -o 'google-site-verification\|msvalidate.01'
```

## Fakten, die man sonst neu herausfinden müsste

- **Flashcards:** Der Default-Branch `main` ist fast leer; das vollständige Projekt liegt auf **`develop`**. Snippets und Quell-Links zeigen darauf.
- **Crow-Terminal-Mockup:** Die Ausgabe ist echt, aufgezeichnet vom lokal gebauten Backend (clang++ mit Crow v1.3.3 und Asio). Das lief auf Port 18080, weil 3000 belegt war; angezeigt wird Port 3000 wie im Repo.
- **Code-Snippets:** Nur wörtlich aus den Repos übernehmen; Auslassungen mit „…“ markieren. Jede Zeile gegen die Quelldatei prüfen, denn das frühere Generator-Skript lag nur im Scratchpad.
- **Driving Planner** hat eine Live-Seite auf GitHub Pages der Klassenorganisation (`demoUrl`).
- **Profilbild:** `public/profile.jpg` ist das GitHub-Avatar (460×460, eine Galaxie-Grafik). Daneben steht „JBRUNNERHTL“ als senkrechter Schriftzug in voller Textfarbe; die frühere Outline-Variante war schwer lesbar.
- **Hero-Rollen** (in den Wörterbüchern): EN „Developer + Student / Backend Dev / App Builder / Tinkerer“, DE „Entwickler + Schüler / Backend-Dev / App-Bauer / Tüftler“.
- **Kontrast:** Alle Textfarben haben in beiden Modi mindestens 4,5:1. Nach Farbänderungen erneut prüfen: `--accent-fg` (weiß) auf `--accent`, und `--accent-text` auf `--bg` und `--surface`. Im Dark Mode ist `--accent-text` heller als die Füllung, weil das dunkle Magenta auf `#111` nur 2,99:1 erreicht.
- **Kugel und Hero-Titel:** Im Light Mode liegt die graue zweite Titelzeile über der Kugel. Mit `#a21caf` als Kugellicht waren es nur etwa 2,6:1, mit `#e879f9` etwa 4:1 (in WebKit gemessen). Das Kugellicht im Light Mode deshalb nicht abdunkeln.
- **Offen nach der Farbumstellung:** Die Kugel wirkt im Dark Mode recht dunkel (bei Bedarf `--sphere-base` aufhellen), und der Hover der Akzent-Buttons (`brightness(1.08)`) wurde nicht geprüft. Der Besitzer hat beides noch nicht in Safari beurteilt.
- **Playwright für WebKit:** Im Projekt ist kein Playwright installiert. Im Cache liegt WebKit-Build 2359; dazu passt `playwright-core@1.63.0`, im Scratchpad installiert.
- **IndexNow-Key:** `3c0d0bc384bd907c591dbd5a96780cba`, als `INDEXNOW_KEY` im Workflow und als `public/<key>.txt`. Beide nur gemeinsam ändern; der Build prüft das.
- **Deutsche Texte der Projektseiten:** hat der Besitzer noch nicht ausdrücklich gegengelesen.
- **OpenSpec:** Entfernt eine Change alle Anforderungen einer Capability, braucht ihre `.openspec.yaml` den Eintrag `retire_capabilities: true`, sonst bricht `openspec archive` ab.

## Checks vor jedem Commit (wie in der CI)

```
npx next typegen && npx tsc --noEmit && npm run lint && npm run build
```

Danach die betroffenen Ansichten in WebKit prüfen: Dark und Light, 1440/1024/390/320 px, ohne JavaScript und mit reduzierter Bewegung. Die Seite darf nie horizontal überlaufen, und ohne JavaScript muss aller Inhalt sichtbar sein.
