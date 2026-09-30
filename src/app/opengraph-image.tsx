import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { personal, seo } from "@/content/site";
import { colors } from "@/content/tokens";
import { DOTS_PATH, LEGS, MAP_H, MAP_W, STOPS } from "@/components/hero/routeGeometry";

// Rendered once at build time (static export).
export const dynamic = "force-static";
export const alt = seo.shareImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "assets-src/fonts", file));

/** The hero's route map as a static SVG: faint land dots, dashed legs, Boston in teal. */
function mapSvg() {
  const boston = STOPS.find((s) => s.current);
  const cities = STOPS.filter((s) => !s.current)
    .map((s) => `<circle cx="${s.x}" cy="${s.y}" r="7" fill="${colors.primary}"/>`)
    .join("");
  const legs = LEGS.map(
    (d) => `<path d="${d}" fill="none" stroke="${colors.primary}" stroke-opacity="0.6" stroke-width="3.5" stroke-dasharray="7 11" stroke-linecap="round"/>`,
  ).join("");
  const current = boston
    ? `<circle cx="${boston.x}" cy="${boston.y}" r="17" fill="none" stroke="${colors.accent}" stroke-opacity="0.35" stroke-width="3"/><circle cx="${boston.x}" cy="${boston.y}" r="9" fill="${colors.accent}"/>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}"><path d="${DOTS_PATH}" fill="${colors.primary}" fill-opacity="0.2"/>${legs}${cities}${current}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function OpengraphImage() {
  const [serif, serifItalic, inter, interMedium] = await Promise.all([
    font("InstrumentSerif-Regular.ttf"),
    font("InstrumentSerif-Italic.ttf"),
    font("Inter-Regular.ttf"),
    font("Inter-Medium.ttf"),
  ]);
  const [first, ...rest] = personal.name.split(" ");
  const mapWidth = 480;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: colors.base,
          color: colors.primary,
          fontFamily: "Inter",
        }}
      >
        {/* Left: who, what, and the one call to action. */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 0 72px 72px", width: 720 }}>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: colors.primarySoft }}>
            {personal.overline}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontFamily: "Instrument Serif", fontSize: 124, lineHeight: 1, letterSpacing: -2 }}>
            <span>{first}</span>
            <span style={{ fontStyle: "italic", marginLeft: 28 }}>{rest.join(" ")}</span>
          </div>
          <div style={{ marginTop: 26, maxWidth: 560, fontSize: 34, lineHeight: 1.3 }}>{personal.tagline}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 44 }}>
            <span style={{ fontSize: 26, fontWeight: 500 }}>{seo.domain}</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 22,
                padding: "10px 22px",
                borderRadius: 999,
                background: colors.accent,
                color: colors.base,
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 999, background: colors.base, marginRight: 12 }} />
              {seo.shareAvailability}
            </span>
          </div>
        </div>

        {/* Right: the route map, as in the hero. */}
        <img
          src={mapSvg()}
          alt=""
          width={mapWidth}
          height={Math.round((mapWidth * MAP_H) / MAP_W)}
          style={{ position: "absolute", right: 64, top: (630 - (mapWidth * MAP_H) / MAP_W) / 2 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Inter", data: inter, style: "normal", weight: 400 },
        { name: "Inter", data: interMedium, style: "normal", weight: 500 },
      ],
    },
  );
}

