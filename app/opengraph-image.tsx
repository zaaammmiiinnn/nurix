import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nurix — AI that ships.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
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

        {/* Top Header */}
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
              nurix
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
            DUBAI, UAE • FIXED PRICE
          </div>
        </div>

        {/* Hero Title */}
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
              fontSize: "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#FFFFFF",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            AI that ships.
          </h1>

          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#A1A1AA",
              margin: 0,
              maxWidth: "840px",
            }}
          >
            Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.
          </p>
        </div>

        {/* Footer */}
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
            <span>12+ Projects Shipped</span>
            <span>•</span>
            <span>5-Day Delivery</span>
            <span>•</span>
            <span>UAE-Based</span>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#8B5CF6",
              letterSpacing: "-0.01em",
            }}
          >
            nurix.ae
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
