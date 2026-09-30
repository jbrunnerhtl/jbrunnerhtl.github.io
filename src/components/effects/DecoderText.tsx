"use client";

import React, { useEffect, useRef } from "react";

// Code-ish glyphs the letters pass through before they settle.
const GLYPHS = "0123456789{}[]<>/\\#$%&*+=_~;:";
const DURATION = 900;
/** How many characters scramble at once, ahead of the settled part. */
const SPREAD = 5;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Text that builds up left to right through random glyphs. Screen readers and the server HTML
 * always get the final text (sr-only copy; the visual copy starts as the final text too).
 * Plays when it first scrolls into view, and again whenever `text` changes; not with reduced motion.
 */
export default function DecoderText({
  text,
  className = "",
  playOnView = true,
}: {
  text: string;
  className?: string;
  /** Scramble in on first view. When false, only changes of `text` scramble (e.g. the hero role). */
  playOnView?: boolean;
}) {
  const visual = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = visual.current;
    if (!el) return;
    const initial = first.current;
    first.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (initial && !playOnView)) {
      el.textContent = text;
      return;
    }

    let raf = 0;
    const play = () => {
      const start = performance.now();
      const chars = [...text];
      const frame = (now: number) => {
        const p = Math.min((now - start) / DURATION, 1) * (chars.length + SPREAD);
        const frag = document.createDocumentFragment();
        chars.forEach((c, i) => {
          if (i < p - SPREAD || c === " ") {
            frag.append(c);
          } else {
            // Not yet settled: a glyph while scrambling, an invisible placeholder before that,
            // so the line keeps its final width and never reflows.
            const span = document.createElement("span");
            span.textContent = i < p ? randomGlyph() : c;
            span.className = i < p ? "text-faint" : "opacity-0";
            frag.append(span);
          }
        });
        el.replaceChildren(frag);
        if (p < chars.length + SPREAD) raf = requestAnimationFrame(frame);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(frame);
    };

    if (!initial) {
      play();
      return () => cancelAnimationFrame(raf);
    }
    // First run: wait until it is on screen.
    el.style.opacity = "0";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.style.opacity = "";
        play();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.style.opacity = "";
    };
  }, [text, playOnView]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* The effect rewrites this span's children, so React must not reconcile them: it only sets
          the HTML when `text` changes. */}
      <span ref={visual} aria-hidden dangerouslySetInnerHTML={{ __html: escapeHtml(text) }} />
    </span>
  );
}
