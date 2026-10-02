import { ImageResponse } from "next/og";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { OG_IMAGE_SIZE } from "@/lib/site";

// Link preview for /en/ and /de/ and their project pages (Open Graph and the large Twitter/X card),
// rendered once at build time into the static export as /<lang>/og.png. A route handler rather than
// the opengraph-image convention, so the exported file has a .png extension and static hosts serve
// it as an image. Drawn in code in the site's dark look: no downloaded images or fonts.

export const dynamic = "force-static";

const size = OG_IMAGE_SIZE;
const ACCENT = "#e879f9";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/og.png">) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);
  const { profile } = PORTFOLIO_DATA;

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
          color: "#f2f2f2",
          backgroundColor: "#111111",
        }}
      >
        {/* A soft sphere, like the hero's, to the right. */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 20,
            width: 590,
            height: 590,
            borderRadius: "50%",
            backgroundImage:
              "radial-gradient(circle at 32% 30%, rgba(232, 121, 249, 0.55) 0%, rgba(232, 121, 249, 0) 45%), radial-gradient(circle at 50% 50%, #3c3440 0%, rgba(60, 52, 64, 0.4) 60%, rgba(17, 17, 17, 0) 71%)",
          }}
        />
        {/* The section divider: a thin line with a notched bar under its start. */}
        <div style={{ display: "flex", position: "relative", width: 132, height: 14 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 132, height: 2, backgroundColor: ACCENT }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 80, height: 12, backgroundColor: ACCENT }} />
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 30, letterSpacing: "0.3em", color: "#b3b3b3" }}>
          {profile.name.toUpperCase()}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontSize: 128, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1 }}>
          <span>{t.hero.role}</span>
          <div style={{ display: "flex", width: 220, height: 2, marginLeft: 40, backgroundColor: "#8c8c8c" }} />
        </div>
        <div style={{ display: "flex", marginTop: 8, fontSize: 128, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1, color: "#b3b3b3" }}>
          <span style={{ color: "#8c8c8c", marginRight: 28 }}>+</span>
          {t.hero.roles[0]}
        </div>
        <div style={{ position: "absolute", left: 96, bottom: 56, display: "flex", fontSize: 24, color: "#8c8c8c" }}>
          {t.profile.heroLine}
        </div>
      </div>
    ),
    size,
  );
}
