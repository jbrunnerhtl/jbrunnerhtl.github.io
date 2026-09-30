"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
}

/** Fades content up into place the first time it enters the viewport. */
export function FadeIn({
  children,
  delay = 0,
  distance = 18,
  duration = 0.9,
  className = "",
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerContainer({ children, staggerDelay = 0.08, className = "", ...props }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function StaggerItem({ children, className = "", ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Splits a line into words that rise into view one after another.
 * Pure CSS (.reveal-word in globals.css), so it starts on first paint instead of
 * waiting for hydration. `className` goes on each moving word, not a wrapper, so
 * gradient text (background-clip: text) moves with its glyphs.
 */
export function RevealText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {/* Mask with vertical breathing room: the tight h1 line-height would otherwise clip glyph tops/bottoms. */}
          <span aria-hidden className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] pr-[0.06em] -mr-[0.06em] align-bottom">
            <span
              className={`reveal-word inline-block ${className}`}
              style={{ animationDelay: `${delay + i * 0.07}s` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </>
  );
}
