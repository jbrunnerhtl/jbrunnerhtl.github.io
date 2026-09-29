import React from "react";
import { GITHUB_MARK_PATH } from "./githubMark";

export default function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={GITHUB_MARK_PATH} />
    </svg>
  );
}
