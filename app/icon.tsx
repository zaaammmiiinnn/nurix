import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070A",
          borderRadius: "7px",
          border: "1px solid rgba(139, 92, 246, 0.5)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 8 28 C 8 16, 13 10, 16 10 C 19 10, 20 23, 23 23 C 26 23, 27 12, 31 12 C 33 12, 33 26, 30 29"
            stroke="#8B5CF6"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="28" r="2.5" fill="#8B5CF6" />
          <circle cx="16" cy="11" r="2.8" fill="#A78BFA" />
          <circle cx="21" cy="22" r="2.2" fill="#6366F1" />
          <circle cx="27" cy="14" r="2.5" fill="#38BDF8" />
          <circle cx="30" cy="29" r="2.8" fill="#22D3EE" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
