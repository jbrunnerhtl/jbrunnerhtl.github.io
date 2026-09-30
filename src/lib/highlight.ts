import "server-only";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { SNIPPETS, type SnippetId } from "@/data/snippets";

// Build-time only: the mockups ship as static, pre-highlighted HTML, so no highlighter (and no
// WASM) ever reaches the browser. Both color modes are emitted as CSS variables
// (--shiki-dark / --shiki-light), and globals.css picks one per data-theme.
let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-dark-default.mjs"), import("shiki/themes/github-light-default.mjs")],
    langs: [
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/java.mjs"),
      import("shiki/langs/csharp.mjs"),
      import("shiki/langs/cpp.mjs"),
      import("shiki/langs/shellsession.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** The snippet as highlighted HTML (a <pre class="shiki">), for both color modes. */
export async function highlight(id: SnippetId) {
  const { code, lang } = SNIPPETS[id];
  const hl = await getHighlighter();
  return hl.codeToHtml(code.replace(/\n$/, ""), {
    lang,
    themes: { dark: "github-dark-default", light: "github-light-default" },
    defaultColor: false,
  });
}

/** Highlighted HTML for several snippets, keyed by id. */
export async function highlightAll<T extends SnippetId>(ids: readonly T[]) {
  const entries = await Promise.all(ids.map(async (id) => [id, await highlight(id)] as const));
  return Object.fromEntries(entries) as Record<T, string>;
}
