import React from "react";

/**
 * One stop of the station journey. In the stacked layout both wrappers are `display: contents`,
 * so the page lays out exactly as without them. In journey mode ([data-journey] on <html>) the
 * station becomes a fixed full-viewport layer whose body the JourneyProvider moves and fades.
 */
export default function Station({
  name,
  section,
  children,
}: {
  /** Unique station name, e.g. "about" or "projects-2". */
  name: string;
  /** Nav section this station belongs to (omit for the hero). */
  section?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="station" data-station={name} data-section={section}>
      <div className="station-body">{children}</div>
    </div>
  );
}
