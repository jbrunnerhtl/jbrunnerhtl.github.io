import { BASE_PATH, localePath } from "@/lib/basePath";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE } from "@/i18n/config";

// Static replacement for a server-side locale redirect: saved choice (cookie) first, then the
// browser's languages, then the default. Runs in <head>-order before anything paints.
const REDIRECT_SCRIPT = `(function(){var L=${JSON.stringify(LOCALES)},m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([a-z]+)/),p=m&&L.indexOf(m[1])>-1?m[1]:null;if(!p){var n=navigator.languages||[navigator.language];for(var i=0;i<n.length&&!p;i++){var b=String(n[i]||"").toLowerCase().split("-")[0];if(L.indexOf(b)>-1)p=b}}location.replace(${JSON.stringify(BASE_PATH)}+"/"+(p||${JSON.stringify(DEFAULT_LOCALE)})+"/"+location.hash)})()`;

export default function RootRedirect() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      {/* Without JavaScript: plain links (and no auto-redirect guessing). */}
      <main className="grid min-h-[100svh] place-items-center p-6">
        <nav className="flex gap-3 text-sm" aria-label="Language">
          <a className="rounded-full border border-line px-4 py-2 hover:bg-fg/[0.06]" href={localePath("en")} hrefLang="en">
            English
          </a>
          <a className="rounded-full border border-line px-4 py-2 hover:bg-fg/[0.06]" href={localePath("de")} hrefLang="de">
            Deutsch
          </a>
        </nav>
      </main>
      <noscript>
        <p className="sr-only">
          <a href={`${BASE_PATH}/${DEFAULT_LOCALE}/`}>Continue</a>
        </p>
      </noscript>
    </>
  );
}
