"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Opening /<lang>/#contact (directly, or from a project page) should land on that section. The
 * browser jumps as soon as the element exists, before web fonts and client-only content have
 * settled the layout, so jump once more when they have.
 */
export default function HashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let cancelled = false;
    document.fonts.ready.then(() =>
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (cancelled || !el || Math.abs(el.getBoundingClientRect().top) < 2) return;
        el.scrollIntoView({ block: "start" });
      })
    );
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  return null;
}
