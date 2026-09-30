// Remounts when going from one project page to the next, which the /<lang>/ template doesn't.
export default function ProjectTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
