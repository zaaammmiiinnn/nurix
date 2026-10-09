import { ImageResponse } from "next/og";

export const alt = "NeuralWaves — AI that ships.";
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
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="38" height="38" rx="10" fill="#07070A" stroke="#8B5CF6" strokeWidth="1.5" />
              <path
                d="M 8 28 C 8 16, 13 10, 16 10 C 19 10, 20 23, 23 23 C 26 23, 27 12, 31 12 C 33 12, 33 26, 30 29"
                stroke="#8B5CF6"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="28" r="2.2" fill="#8B5CF6" />
              <circle cx="16" cy="11" r="2.4" fill="#A78BFA" />
              <circle cx="21" cy="22" r="2" fill="#6366F1" />
              <circle cx="27" cy="14" r="2.2" fill="#38BDF8" />
              <circle cx="30" cy="29" r="2.4" fill="#22D3EE" />
            </svg>
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
            neuralwaves.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
