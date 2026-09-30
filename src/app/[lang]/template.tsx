// Remounts on every navigation below /<lang>/ (home ↔ project pages), so the page fades in.
// The fade is CSS-only and skipped with reduced motion (see .page-in in globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
