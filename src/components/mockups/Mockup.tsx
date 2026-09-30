import React from "react";

export type MockupKind = "laptop" | "window" | "terminal";

interface MockupProps {
  kind: MockupKind;
  /** Pre-highlighted HTML (see lib/highlight.ts). */
  html: string;
  /** File name or command, shown in the title bar. */
  title: string;
  /** Accessible description of what the mockup shows. */
  label: string;
  /** Cut long code at a fixed height with a fade (home page); full length otherwise. */
  clip?: boolean;
  className?: string;
}

/** The code itself: real, selectable text; long lines scroll inside the frame, never the page. */
function Code({ html, clip }: { html: string; clip?: boolean }) {
  return <div className={`mockup-code ${clip ? "mockup-code-clip" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

function TitleBar({ title, dark }: { title: string; dark?: boolean }) {
  return (
    <div aria-hidden className={`mockup-bar ${dark ? "mockup-bar-dark" : ""}`}>
      <span className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="min-w-0 truncate font-mono text-[11px]">{title}</span>
      <span className="w-[46px]" />
    </div>
  );
}

/**
 * A stylized device showing code from a project: a laptop (web apps; its lid opens when revealed),
 * an application window (desktop apps) or a terminal (backends). CSS only, no images.
 */
export default function Mockup({ kind, html, title, label, clip, className = "" }: MockupProps) {
  const caption = <figcaption className="sr-only">{label}</figcaption>;

  if (kind === "laptop") {
    return (
      <figure data-reveal="device" className={`mockup-laptop ${className}`}>
        {caption}
        <div className="mockup-lid">
          <div className="mockup-screen">
            <TitleBar title={title} />
            <Code html={html} clip={clip} />
          </div>
        </div>
        <div aria-hidden className="mockup-base" />
      </figure>
    );
  }

  const terminal = kind === "terminal";
  return (
    <figure data-reveal="device" className={`mockup-window ${terminal ? "mockup-terminal" : ""} ${className}`}>
      {caption}
      <TitleBar title={title} dark={terminal} />
      <Code html={html} clip={clip} />
    </figure>
  );
}
