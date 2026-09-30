import { ImageResponse } from "next/og";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { seededRandom } from "@/components/3d/random";
import { OG_IMAGE_SIZE } from "@/lib/site";

// Link preview for /en/ and /de/ (Open Graph and the large Twitter/X card), rendered once at build
// time into the static export as /<lang>/og.png. A route handler rather than the opengraph-image
// convention, so the exported file has a .png extension and static hosts serve it as an image.
// Drawn in code like the rest of the space look: no downloaded images or fonts.

export const dynamic = "force-static";

const size = OG_IMAGE_SIZE;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const STARS = (() => {
  const random = seededRandom(630);
  const stars = Array.from({ length: 260 }, () => ({
    x: random() * size.width,
    y: random() * size.height,
    r: random() < 0.9 ? 1 + random() * 1.2 : 2 + random() * 1.5,
    o: 0.25 + random() * 0.65,
  }));
  // Keep the text block clear, so no star sits inside a letter.
  return stars.filter((s) => !(s.x > 80 && s.x < 1000 && s.y > 120 && s.y < 580));
})();

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/og.png">) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);
  const { profile } = PORTFOLIO_DATA;
  const [first, ...rest] = profile.name.split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          color: "#ededee",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 78% 30%, rgba(99, 102, 241, 0.28), transparent), radial-gradient(ellipse 60% 55% at 12% 90%, rgba(56, 189, 248, 0.16), transparent)",
        }}
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              opacity: s.o,
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#a1a1aa" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#34d399" }} />
          {t.profile.heroLine}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 132, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1 }}>
          <span>{first}&nbsp;</span>
          <span
            style={{
              backgroundImage: "linear-gradient(120deg, #ffffff 0%, #c9d4e4 35%, #9fd8ff 65%, #c4b5fd 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {rest.join(" ")}.
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 36, maxWidth: 900, fontSize: 32, lineHeight: 1.4, color: "#a1a1aa" }}>
          {t.hero.tagline}
        </div>
        <div style={{ position: "absolute", left: 96, bottom: 56, display: "flex", fontSize: 24, color: "#71717a" }}>
          github.com/{profile.handle}
        </div>
      </div>
    ),
    size,
  );
}
