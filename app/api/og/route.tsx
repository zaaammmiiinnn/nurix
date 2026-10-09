import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "AI that ships.";
    const subtitle =
      searchParams.get("subtitle") ||
      "Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.";
    const badge = searchParams.get("badge") || "DUBAI, UAE • FIXED PRICE";
    const metric = searchParams.get("metric");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#07070A",
            padding: "80px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle gradient background glow */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-150px",
              width: "650px",
              height: "650px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(34, 211, 238, 0.08) 50%, transparent 70%)",
            }}
          />

          {/* Top Bar with Brand and Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#8B5CF6",
                  boxShadow: "0 0 16px #8B5CF6",
                }}
              />
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.04em",
                }}
              >
                NeuralWaves
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#A1A1AA",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "960px",
              zIndex: 10,
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {title}
            </h1>

            {metric && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#A78BFA",
                    fontFamily: "monospace",
                  }}
                >
                  ⚡ {metric}
                </span>
              </div>
            )}

            <p
              style={{
                fontSize: "24px",
                lineHeight: 1.4,
                color: "#A1A1AA",
                margin: 0,
                maxWidth: "840px",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Footer Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", gap: "24px", fontSize: "16px", color: "#71717A" }}>
              <span>5-Day Delivery</span>
              <span>•</span>
              <span>100% Fixed Price</span>
              <span>•</span>
              <span>UAE Focused</span>
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#8B5CF6",
                letterSpacing: "-0.01em",
              }}
            >
              neuralwaves.in
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    return new Response(`Failed to generate OG Image: ${errorMsg}`, {
      status: 500,
    });
  }
}
