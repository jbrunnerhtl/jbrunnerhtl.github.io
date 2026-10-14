"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ARCHITECTURE, architectureLinks, type ArchitectureDiagram as Diagram } from "@/data/architecture";
import type { ProjectId } from "@/data/portfolioData";
import { useI18n } from "@/i18n/I18nProvider";

/** The dictionary words of a diagram, as the component reads them. */
interface DiagramTexts {
  label: string;
  layers: Record<string, { name: string; note?: string }>;
  blocks: Record<string, { name: string; label: string; text: string }>;
  links: Record<string, string>;
}

/** A "a · b · c" label that only breaks after a separator, so no part is split or orphaned. */
function Label({ text }: { text: string }) {
  const parts = text.split(" · ");
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && " "}
      <span className="arch-part">{i < parts.length - 1 ? `${part} ·` : part}</span>
    </React.Fragment>
  ));
}

const touches = (pairs: [string, string][], id: string | null) => id !== null && pairs.some(([a, b]) => a === id || b === id);

/**
 * A project's architecture: labelled layers of blocks, joined by arrows inside a layer and by
 * labelled links between layers. Fully rendered as HTML; activating a block highlights it, its
 * direct neighbours and the links between them, and explains it below the diagram.
 */
export default function ArchitectureDiagram({ id, className = "" }: { id: ProjectId; className?: string }) {
  const { t } = useI18n();
  const diagram: Diagram = ARCHITECTURE[id];
  const texts: DiagramTexts = t.projects.items[id].architecture;
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  const links = useMemo(() => architectureLinks(diagram), [diagram]);
  const near = useMemo(() => {
    const set = new Set<string>();
    for (const [a, b] of links) {
      if (a === active) set.add(b);
      if (b === active) set.add(a);
    }
    return set;
  }, [links, active]);

  // Escape and a click outside reset the diagram; listening only while a block is active.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setActive(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [active]);

  const blockState = (block: string) =>
    active === null ? "" : block === active ? "is-active" : near.has(block) ? "is-near" : "is-dim";
  const linkState = (pairs: [string, string][]) => (active === null ? "" : touches(pairs, active) ? "is-lit" : "is-dim");
  const current = active ? texts.blocks[active] : null;

  return (
    <figure ref={ref} data-reveal aria-label={texts.label} className={`arch ${active ? "has-active" : ""} ${className}`}>
      {diagram.layers.map((layer) => {
        const words = texts.layers[layer.id];
        return (
          <React.Fragment key={layer.id}>
            <div className="arch-layer">
              <span className="arch-layer-name">{words.name}</span>
              {layer.rows.map((row, r) => {
                const first = row.blocks[0].id;
                const last = row.blocks[row.blocks.length - 1].id;
                return (
                  <div key={r} className={`arch-row ${row.blocks.length >= 4 ? "is-long" : ""}`}>
                    {row.blocks.map((block, i) => (
                      <React.Fragment key={block.id}>
                        {i > 0 && row.joint !== "none" && (
                          <span
                            aria-hidden
                            className={`arch-arrow ${row.joint === "dashed" ? "is-dashed" : ""} ${linkState([[row.blocks[i - 1].id, block.id]])}`}
                          />
                        )}
                        <button
                          type="button"
                          aria-pressed={active === block.id}
                          onClick={() => setActive(active === block.id ? null : block.id)}
                          className={`arch-block ${block.external ? "is-external" : ""} ${blockState(block.id)}`}
                        >
                          <span className="arch-block-name">{texts.blocks[block.id].name}</span>
                          <span className="arch-block-label">
                            <Label text={texts.blocks[block.id].label} />
                          </span>
                        </button>
                      </React.Fragment>
                    ))}
                    {row.loop && (
                      <span className={`arch-loop ${linkState([[last, first]])}`}>
                        <span>{texts.links[row.loop]}</span>
                      </span>
                    )}
                  </div>
                );
              })}
              {words.note && <p className="arch-note">{words.note}</p>}
            </div>
            {layer.next && (
              <div className={`arch-link ${linkState(layer.next.pairs)}`}>
                {layer.next.label && <span>{texts.links[layer.next.label]}</span>}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {diagram.chips && (
        <ul className="arch-chips">
          {diagram.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      )}

      <div aria-live="polite" className="arch-detail">
        <div>
          {current && (
            <div className="arch-detail-inner">
              <p className="arch-detail-name">{current.name}</p>
              <p className="arch-detail-text">{current.text}</p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
