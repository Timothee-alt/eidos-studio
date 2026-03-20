import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eidos Studio — Rendre visible l'essentiel · Lannion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#050507",
          color: "#f6f6f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#3b7bff",
              boxShadow: "0 0 12px #3b7bff",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(246,246,247,0.4)",
            }}
          >
            Rendre visible l&apos;essentiel
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "80px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            EIDOS
          </span>
          <span
            style={{
              fontSize: "80px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#3b7bff",
            }}
          >
            Studio.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "rgba(246,246,247,0.3)",
            }}
          >
            WebGL · Sites premium · Applications
          </span>
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "rgba(246,246,247,0.3)",
            }}
          >
            eidos-studio.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
