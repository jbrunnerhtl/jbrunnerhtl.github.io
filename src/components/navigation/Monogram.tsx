import React from "react";

/** "JB." — the site's mark: initials in the text color, the period in the accent. */
export default function Monogram({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`font-sans text-[1.625rem] font-extrabold leading-none tracking-[-0.06em] ${className}`}>
      JB<span className="text-accent-text">.</span>
    </span>
  );
}
