"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface NameSegment {
  text: string;
  className: string;
}

/** Wait for the CSS entrance (RevealText) to settle before the first swap. */
const FIRST_DELAY_MS = 3500;
const HOLD_MS = 3500;
/** Delay between neighbouring letters, and until the next name starts rising in. */
const STAGGER_S = 0.03;
const IN_DELAY_S = 0.35;

type Word = { letters: string; className: string }[];

/** Splits segments into words (for line wrapping) made of same-style runs. */
function toWords(segments: NameSegment[]): Word[] {
  const words: Word[] = [[]];
  for (const { text, className } of segments) {
    text.split(/( )/).forEach((part) => {
      if (part === " ") words.push([]);
      else if (part) words[words.length - 1].push({ letters: part, className });
    });
  }
  return words.filter((w) => w.length);
}

function Name({ segments, mode }: { segments: NameSegment[]; mode?: "in" | "out" }) {
  let i = 0;
  const delay = () => `${(mode === "in" ? IN_DELAY_S : 0) + i++ * STAGGER_S}s`;
  return toWords(segments).map((word, w) => (
    <React.Fragment key={w}>
      {w > 0 && " "}
      <span data-word className="inline-block whitespace-nowrap">
        {word.flatMap((run, r) =>
          [...run.letters].map((letter, l) => (
            // Mask with vertical breathing room so glyph tops and bottoms aren't clipped (as in RevealText).
            <span key={`${r}-${l}`} className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-bottom">
              <span
                data-letter
                className={`inline-block ${run.className} ${mode ? `name-${mode}` : ""}`}
                style={mode ? { animationDelay: delay() } : undefined}
              >
                {letter}
              </span>
            </span>
          )),
        )}
      </span>
    </React.Fragment>
  ));
}

/**
 * Stretches each letter's background over its whole word, so gradient text (background-clip: text)
 * reads as one continuous gradient although every letter is its own animated box.
 */
function alignGradients(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
    const box = word.getBoundingClientRect();
    word.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter) => {
      const left = letter.getBoundingClientRect().left - box.left;
      letter.style.backgroundSize = `${box.width}px 100%`;
      letter.style.backgroundPosition = `${-left}px 0`;
    });
  });
}

/**
 * Alternates a heading between names: the letters of one name leave upwards while the next rises in.
 * The first name is shown by `intro` (server-rendered, CSS entrance). Every name reserves its space
 * invisibly so the heading never changes height. Purely visual: the page's real heading is separate.
 * Stays on the first name when reduced motion is preferred, and pauses off-screen or in a hidden tab.
 */
export default function NameSwap({
  names,
  intro,
}: {
  names: NameSegment[][];
  intro: React.ReactNode;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  // null while the intro is showing; `step` remounts the letters so their animations restart.
  const [swap, setSwap] = useState<{ current: number; previous: number; step: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || names.length < 2) return;

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(boxRef.current!);

    let current = 0;
    let step = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      if (visible && !document.hidden) {
        const previous = current;
        current = (current + 1) % names.length;
        setSwap({ current, previous, step: ++step });
      }
      timer = setTimeout(next, HOLD_MS);
    };
    timer = setTimeout(next, FIRST_DELAY_MS);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [names]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!swap || !box) return;
    alignGradients(box);
    const observer = new ResizeObserver(() => alignGradients(box));
    observer.observe(box);
    return () => observer.disconnect();
  }, [swap]);

  return (
    <>
      <span ref={boxRef} aria-hidden className="grid">
        {names.map((name, i) => (
          <span key={`size-${i}`} className="invisible [grid-area:1/1]">
            <Name segments={name} />
          </span>
        ))}
        {swap ? (
          <>
            <span key={`out-${swap.step}`} className="[grid-area:1/1]">
              <Name segments={names[swap.previous]} mode="out" />
            </span>
            <span key={`in-${swap.step}`} className="[grid-area:1/1]">
              <Name segments={names[swap.current]} mode="in" />
            </span>
          </>
        ) : (
          <span className="[grid-area:1/1]">{intro}</span>
        )}
      </span>
    </>
  );
}
