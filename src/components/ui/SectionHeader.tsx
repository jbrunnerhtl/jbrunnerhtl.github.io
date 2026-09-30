import React from "react";
import { FadeIn } from "./MotionWrapper";

export default function SectionHeader({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <FadeIn className="mb-10 grid gap-4 sm:mb-14 sm:gap-6 lg:grid-cols-12 lg:gap-10">
      <div data-depth="1" className="eyebrow lg:col-span-3 lg:pt-3">
        <span className="text-accent">{index}</span>
        <span className="mx-2">/</span>
        {label}
      </div>
      <div data-depth="1.6" className="lg:col-span-9">
        <h2 className="text-[clamp(1.875rem,5.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-fg text-balance">{title}</h2>
        {children && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:mt-5">{children}</p>}
      </div>
    </FadeIn>
  );
}
