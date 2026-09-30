export type Theme = "dark" | "light";

/** localStorage key of an explicit color mode choice. */
export const THEME_KEY = "theme";

/** Browser UI color per mode (<meta name="theme-color">), matching --bg. */
export const THEME_COLOR: Record<Theme, string> = { dark: "#111111", light: "#f2f2f2" };

/**
 * Runs in <head> before the first paint on every page: applies the saved color mode, else the
 * system's, so there is never a flash of the other mode. Also marks <html class="js">, which lets
 * CSS hide not-yet-revealed content only when scripts run.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,t;d.classList.add("js");try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t})()`;
