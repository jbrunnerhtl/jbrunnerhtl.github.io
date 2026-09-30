import React from "react";

/**
 * The accent divider that opens a section: a thin line with a notched bar under its start,
 * followed by the section's number ("01") or label. The line draws in when revealed.
 */
export default function SectionDivider({ number, label, className = "" }: { number?: string; label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span aria-hidden data-reveal="line" className="section-divider" />
      <span data-reveal className="font-mono text-sm tracking-wider text-accent-text">
        {number ?? label}
      </span>
    </div>
  );
}
